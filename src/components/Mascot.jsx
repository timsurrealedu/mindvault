import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { getLines, reactionEmotes, loveEmotes, getMascot } from '../lib/mascots.js'
import MascotSprite from './MascotSprite.jsx'
import { IconClose, IconPaw } from './Icons.jsx'

const POS_KEY = 'mindvault.mascotPos'
const PET = 64 // mascot footprint (px)
const EDGE = 14 // margin kept from the viewport edge
const DRAG_THRESHOLD = 4 // px before a press counts as a drag, not a tap
const THROW_SPEED = 0.55 // px/ms — a flick faster than this becomes a throw
const THROW_PROJECT = 90 // ms of momentum projected onto the cross axis

// The distinct reaction animations the pet can play, picked at random per pet.
const REACTIONS = ['react-wiggle', 'react-bounce', 'react-spin', 'react-nod']
const LOVE_STREAK = 3 // pets in quick succession that tip into a "love" reaction
const STREAK_WINDOW = 1500 // ms within which pets count toward a streak

const loadPos = () => {
  try {
    const v = localStorage.getItem(POS_KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/* Decide which side the speech bubble sits on so it always stays on-screen:
   below when the mascot hugs the top, above otherwise; aligned to whichever
   half of the screen the mascot is in. Default (no custom pos) = bottom-right. */
function placementFor(pos) {
  if (!pos || typeof window === 'undefined') return { v: 'above', h: 'right' }
  const cx = pos.x + PET / 2
  return {
    v: pos.y < window.innerHeight * 0.3 ? 'below' : 'above',
    h: cx > window.innerWidth / 2 ? 'right' : 'left',
  }
}

// Snap a position to the nearest of the four viewport edges.
function snapToEdge(p) {
  const dl = p.x
  const dr = window.innerWidth - (p.x + PET)
  const dt = p.y
  const db = window.innerHeight - (p.y + PET)
  const nearest = Math.min(dl, dr, dt, db)
  let { x, y } = p
  if (nearest === dl) x = EDGE
  else if (nearest === dr) x = window.innerWidth - PET - EDGE
  else if (nearest === dt) y = EDGE
  else y = window.innerHeight - PET - EDGE
  return {
    x: clamp(x, EDGE, window.innerWidth - PET - EDGE),
    y: clamp(y, EDGE, window.innerHeight - PET - EDGE),
  }
}

/* Throw the mascot in the direction of the flick. The dominant velocity axis
   decides which edge it flies to (so a fast leftward flick crosses to the LEFT
   edge even from the right side); the cross-axis landing point is projected
   from the perpendicular velocity, so faster/steeper throws land predictably
   further along — deterministic of the throw's speed and angle. */
function throwTo(p, vx, vy) {
  const W = window.innerWidth
  const H = window.innerHeight
  let { x, y } = p
  if (Math.abs(vx) >= Math.abs(vy)) {
    x = vx > 0 ? W - PET - EDGE : EDGE
    y = clamp(p.y + vy * THROW_PROJECT, EDGE, H - PET - EDGE)
  } else {
    y = vy > 0 ? H - PET - EDGE : EDGE
    x = clamp(p.x + vx * THROW_PROJECT, EDGE, W - PET - EDGE)
  }
  return { x, y }
}

/* The global companion. Appears on every page (unless hidden), breathes and
   occasionally hops at idle, and reacts with varied animations + a burst of
   floating emotes when petted. Rapid affection builds a "love" streak with a
   special purring reaction and a glow. It speaks the active app language,
   offers grounding lines when the mood reads anxious, can be dragged anywhere
   — and FLUNG: a fast flick throws it across the screen toward the direction
   of the throw (slow releases just snap to the nearest edge). Position
   persists; the speech bubble flips to stay on-screen. */
export default function Mascot() {
  const { mascotId, mascotHidden, setMascotHidden, mascotPokes, mood, zen, dockTarget } = useApp()
  const { lang } = useI18n()
  const L = getLines(lang)

  const [line, setLine] = useState(() => getLines(lang).idle[0])
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [reacting, setReacting] = useState(false)
  const [reactType, setReactType] = useState(REACTIONS[0])
  const [reactKey, setReactKey] = useState(0) // forces the sprite to restart its animation
  const [loved, setLoved] = useState(false)
  const [hop, setHop] = useState(false)
  const [flung, setFlung] = useState(false)
  const [emotes, setEmotes] = useState([])
  const [pos, setPos] = useState(loadPos)
  const [dragging, setDragging] = useState(false)

  const elRef = useRef(null)
  const reactTimer = useRef(null)
  const lovedTimer = useRef(null)
  const flungTimer = useRef(null)
  const hideTimer = useRef(null) // hides the bubble after its visible window
  const idleTimer = useRef(null) // schedules the next idle line after a pause
  const firstPoke = useRef(true)
  const suppressClick = useRef(false)
  const drag = useRef(null)
  const emoteId = useRef(0)
  const streak = useRef({ count: 0, at: 0 })
  // Refs so timer callbacks always read the latest language / mood.
  const langRef = useRef(lang); langRef.current = lang
  const moodRef = useRef(mood); moodRef.current = mood

  /* The bubble isn't always on screen: a line shows for ~3s, then the bubble
     hides for 5–10s before a fresh idle line appears — petting or dragging the
     mascot speaks again immediately and restarts the cycle. (function decls so
     speak ⇄ scheduleNextIdle can reference each other regardless of order.) */
  function scheduleNextIdle() {
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      const lines = getLines(langRef.current)
      const pool = moodRef.current === 'anxious' ? lines.comfort : lines.idle
      speak(pick(pool))
    }, 5000 + Math.random() * 5000)
  }
  function speak(text, hold = 3000) {
    setLine(text)
    setBubbleVisible(true)
    clearTimeout(hideTimer.current)
    clearTimeout(idleTimer.current)
    hideTimer.current = setTimeout(() => {
      setBubbleVisible(false)
      scheduleNextIdle()
    }, hold)
  }

  // Kick off the speak/pause cycle on mount (a gentle greeting shortly after load).
  useEffect(() => {
    const greet = setTimeout(() => {
      const lines = getLines(langRef.current)
      speak(pick(moodRef.current === 'anxious' ? lines.comfort : lines.idle))
    }, 1000)
    return () => clearTimeout(greet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Occasional idle hop so the companion feels alive even when left alone.
  useEffect(() => {
    const t = setInterval(() => {
      setReacting((r) => {
        setDragging((d) => {
          if (!r && !d) {
            setHop(true)
            setTimeout(() => setHop(false), 700)
          }
          return d
        })
        return r
      })
    }, 9000)
    return () => clearInterval(t)
  }, [])

  // Puff out a few floating emote particles from the mascot.
  const burstEmotes = (palette, count) => {
    const next = Array.from({ length: count }, () => ({
      id: emoteId.current++,
      ch: pick(palette),
      dx: Math.round((Math.random() - 0.5) * 56), // horizontal drift
      rot: Math.round((Math.random() - 0.5) * 40),
      delay: Math.round(Math.random() * 120),
    }))
    setEmotes((cur) => [...cur, ...next])
    next.forEach((e) => {
      setTimeout(() => setEmotes((cur) => cur.filter((x) => x.id !== e.id)), 1200 + e.delay)
    })
  }

  const react = () => {
    // Track rapid pets toward a "love" streak.
    const now = Date.now()
    streak.current.count = now - streak.current.at < STREAK_WINDOW ? streak.current.count + 1 : 1
    streak.current.at = now
    const isLove = streak.current.count >= LOVE_STREAK

    speak(pick(isLove ? L.love : L.reaction))
    setReactType(isLove ? 'react-spin' : pick(REACTIONS))
    setReactKey((k) => k + 1)
    setReacting(true)
    burstEmotes(isLove ? loveEmotes : reactionEmotes, isLove ? 6 : 3)

    if (isLove) {
      setLoved(true)
      clearTimeout(lovedTimer.current)
      lovedTimer.current = setTimeout(() => setLoved(false), 1400)
    }

    clearTimeout(reactTimer.current)
    reactTimer.current = setTimeout(() => setReacting(false), 900)
  }

  // React to external pokes (e.g. a new line typed in Zen mode).
  useEffect(() => {
    if (firstPoke.current) { firstPoke.current = false; return }
    react()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mascotPokes])

  // Give the mascot an explicit starting position (default corner) so it can
  // glide smoothly when docking into chat or being thrown, instead of jumping
  // from a CSS bottom/right anchor.
  useEffect(() => {
    setPos((p) => p || { x: window.innerWidth - PET - 24, y: window.innerHeight - PET - 24 })
  }, [])

  // Re-snap to keep the mascot on-screen after a viewport resize.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? snapToEdge(p) : p))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => () => {
    clearTimeout(reactTimer.current)
    clearTimeout(lovedTimer.current)
    clearTimeout(flungTimer.current)
    clearTimeout(hideTimer.current)
    clearTimeout(idleTimer.current)
  }, [])

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      d.moved = true
      setDragging(true)
      // Keep the bubble up with playful chatter for the whole drag.
      setLine(pick(L.drag))
      setBubbleVisible(true)
      clearTimeout(hideTimer.current)
      clearTimeout(idleTimer.current)
    }
    // Track instantaneous velocity for throw detection.
    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) {
      d.vx = (e.clientX - d.lastX) / dt
      d.vy = (e.clientY - d.lastY) / dt
      d.lastX = e.clientX
      d.lastY = e.clientY
      d.lastT = now
    }
    if (d.moved) {
      setPos({
        x: clamp(d.baseX + dx, EDGE, window.innerWidth - PET - EDGE),
        y: clamp(d.baseY + dy, EDGE, window.innerHeight - PET - EDGE),
      })
    }
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (!d?.moved) return

    suppressClick.current = true // swallow the click that follows a drag
    const speed = Math.hypot(d.vx, d.vy)
    const thrown = speed > THROW_SPEED

    // Celebrate the landing: a spin for a throw, a settle-bounce for a drop.
    setReactType(thrown ? 'react-spin' : 'react-bounce')
    setReactKey((k) => k + 1)
    setReacting(true)
    clearTimeout(reactTimer.current)
    reactTimer.current = setTimeout(() => setReacting(false), thrown ? 900 : 700)

    if (thrown) {
      setFlung(true)
      clearTimeout(flungTimer.current)
      flungTimer.current = setTimeout(() => setFlung(false), 650)
    }

    // A quick word on landing, then resume the normal speak/pause cycle.
    speak(pick(L.reaction))

    setPos((p) => {
      if (!p) return p
      const target = thrown ? throwTo(p, d.vx, d.vy) : snapToEdge(p)
      try { localStorage.setItem(POS_KEY, JSON.stringify(target)) } catch { /* ignore */ }
      return target
    })
  }

  const onPointerDown = (e) => {
    if (dockTarget) return // docked as a chat avatar — not draggable
    if (e.target.closest('.mascot-hide')) return // let the hide button work
    const rect = elRef.current.getBoundingClientRect()
    drag.current = {
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      baseX: rect.left,
      baseY: rect.top,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    }
    elRef.current.setPointerCapture?.(e.pointerId)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  if (mascotHidden) {
    return (
      <button
        className="mascot-show"
        onClick={() => setMascotHidden(false)}
        title="Show companion"
        aria-label="Show companion"
      >
        <IconPaw size={18} />
      </button>
    )
  }

  const m = getMascot(mascotId)
  const place = placementFor(pos)
  const docked = !!dockTarget // becomes the Diary chat avatar
  const positioned = docked
    ? {
        left: dockTarget.x,
        top: dockTarget.y,
        right: 'auto',
        bottom: 'auto',
        // Centre the 64px footprint on the avatar, then lift it slightly: the
        // pixel sprites are bottom-anchored (empty rows up top), so a dead-centre
        // box reads as sitting too low. -57% nudges the creature into the middle.
        transform: `translate(-50%, -57%) scale(${dockTarget.scale})`,
        transformOrigin: 'center center',
      }
    : pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : undefined

  return (
    <div
      ref={elRef}
      className={`mascot ${zen ? 'mascot--zen' : ''} ${dragging ? 'dragging' : ''} ${flung ? 'flung' : ''} ${loved ? 'loved' : ''} ${docked ? 'mascot--docked' : ''}`}
      style={positioned}
      onPointerDown={onPointerDown}
    >
      <button className="mascot-hide" onClick={() => setMascotHidden(true)} aria-label="Hide companion">
        <IconClose size={13} />
      </button>

      {/* Floating emote particles emitted on pet. */}
      <div className="mascot-emotes" aria-hidden="true">
        {emotes.map((e) => (
          <span
            key={e.id}
            className="mascot-emote"
            style={{ '--dx': `${e.dx}px`, '--rot': `${e.rot}deg`, animationDelay: `${e.delay}ms` }}
          >
            {e.ch}
          </span>
        ))}
      </div>

      <div
        className={`mascot-bubble place-${place.v} align-${place.h} ${reacting ? 'pop' : ''} ${
          bubbleVisible || dragging ? '' : 'hidden'
        }`}
        aria-hidden={!(bubbleVisible || dragging)}
      >
        {line}
      </div>
      <button
        className="mascot-tap"
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return }
          react()
        }}
        aria-label={`Pet ${m.name} (drag or throw to move)`}
        title={`Pet ${m.name} · drag or throw to move`}
      >
        <MascotSprite
          key={reactKey}
          id={mascotId}
          px={4}
          className={`mascot-pet ${reacting ? `reacting ${reactType}` : ''} ${hop ? 'hop' : ''}`}
        />
      </button>
    </div>
  )
}
