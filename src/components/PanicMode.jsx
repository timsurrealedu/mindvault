import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { groundingSteps } from '../lib/data.js'
import { IconClose, IconWind, IconAnchor, IconTrash2, IconHeart, IconCheck } from './Icons.jsx'

/* ---------------- Intervention 1: Box Breathing ---------------- */
const PHASES = [
  { key: 'breath.in', cls: 'inhale' },
  { key: 'breath.hold', cls: 'inhale' },
  { key: 'breath.out', cls: 'exhale' },
  { key: 'breath.hold', cls: 'exhale' },
]

function BoxBreathing() {
  const { t } = useI18n()
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(4)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const next = (p + 1) % 4
            if (next === 0) setCycles((n) => n + 1)
            return next
          })
          return 4
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const current = PHASES[phase]
  return (
    <div className="panic-stage">
      <div className="breath-phase">{t(current.key)}</div>
      {/* The ring + halo expand on inhale and contract on exhale, guiding the breath. */}
      <div className={`breath-ring ${current.cls}`}>
        <span className="breath-halo" aria-hidden="true" />
        <span className="breath-halo breath-halo--2" aria-hidden="true" />
        <div className={`breath-circle ${current.cls}`}>{count}</div>
      </div>
      <div className="breath-count" aria-hidden="true">{count}</div>
      <p className="muted">{t('breath.note', { n: cycles })}</p>
    </div>
  )
}

/* ---------------- Intervention 2: Grounding 5-4-3-2-1 ---------------- */
function Grounding({ onFinish }) {
  const { t, lang } = useI18n()
  const [i, setI] = useState(0)
  const step = groundingSteps[i]
  const last = i === groundingSteps.length - 1
  const pick = (v) => (typeof v === 'string' ? v : v?.[lang] || v?.en || '')

  return (
    <div className="panic-stage">
      <div className="card card--pad ground-card" key={i}>
        <div className="ground-num">{step.n}</div>
        <div className="ground-sense">{pick(step.sense)}</div>
        <p className="muted">{pick(step.prompt)}</p>
        <button
          className="btn btn--primary btn--lg"
          onClick={() => (last ? onFinish() : setI(i + 1))}
        >
          {last ? t('ground.finish') : t('ground.done')}
        </button>
      </div>
      <div className="ground-dots">
        {groundingSteps.map((_, idx) => (
          <i key={idx} className={idx === i ? 'active' : idx < i ? 'past' : ''} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Intervention 3: Brain Dump (fading thoughts) ---------------- */
function BrainDump() {
  const { t } = useI18n()
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')

  const release = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const id = Math.random().toString(36).slice(2)
    setLines((l) => [...l, { id, text: trimmed, fading: false }])
    // Start the 5s fade on the next frame, then remove the line entirely.
    requestAnimationFrame(() =>
      setLines((l) => l.map((x) => (x.id === id ? { ...x, fading: true } : x)))
    )
    setTimeout(() => setLines((l) => l.filter((x) => x.id !== id)), 5200)
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      release(value)
    }
  }

  return (
    <div className="panic-stage">
      <p className="muted">{t('dump.hintPre')}<strong>Enter</strong>{t('dump.hintPost')}</p>
      <div className="dump-paper">
        {lines.map((l) => (
          <div key={l.id} className={`dump-line ${l.fading ? 'fading' : ''}`}>{l.text}</div>
        ))}
        <input
          className="dump-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('dump.placeholder')}
          autoFocus
        />
      </div>
    </div>
  )
}

/* ---------------- Cool down ---------------- */
function CoolDown({ onClose }) {
  const { t } = useI18n()
  return (
    <div className="panic-stage">
      <div className="cooldown">
        <div className="calm-badge"><IconHeart size={48} color="#fff" /></div>
        <h2>{t('cooldown.title')}</h2>
        <p className="muted" style={{ maxWidth: 380 }}>{t('cooldown.body')}</p>
        <span className="badge badge--exp"><IconCheck size={14} /> {t('cooldown.badge')}</span>
        <button className="btn btn--primary btn--lg" onClick={onClose}>{t('cooldown.return')}</button>
      </div>
    </div>
  )
}

/* ---------------- Shell ---------------- */
const TABS = [
  { id: 'breath', key: 'panic.tabBreath', Icon: IconWind },
  { id: 'ground', key: 'panic.tabGround', Icon: IconAnchor },
  { id: 'dump', key: 'panic.tabDump', Icon: IconTrash2 },
]

export default function PanicMode() {
  const { panicOpen, closePanic, addExp } = useApp()
  const { t } = useI18n()
  const [tab, setTab] = useState('breath')
  const [done, setDone] = useState(false)
  const awarded = useRef(false)

  // Reset to a fresh session each time the overlay opens.
  useEffect(() => {
    if (panicOpen) {
      setTab('breath')
      setDone(false)
      awarded.current = false
    }
  }, [panicOpen])

  if (!panicOpen) return null

  const finish = () => {
    setDone(true)
    if (!awarded.current) {
      awarded.current = true
      addExp(40)
    }
  }

  return (
    <div className="panic-overlay">
      <button className="icon-btn panic-exit" onClick={closePanic} aria-label={t('panic.exit')}>
        <IconClose size={20} />
      </button>

      {done ? (
        <CoolDown onClose={closePanic} />
      ) : (
        <>
          <div className="text-c" style={{ marginTop: 'var(--space-5)' }}>
            <div className="eyebrow">{t('panic.eyebrow')}</div>
            <h1 style={{ fontSize: '1.6rem', marginTop: 8 }}>{t('panic.title')}</h1>
          </div>

          <div className="panic-tabs">
            {TABS.map(({ id, key, Icon }) => (
              <button
                key={id}
                className={`mood-pill ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <span className="row" style={{ gap: 8 }}><Icon size={16} /> {t(key)}</span>
              </button>
            ))}
          </div>

          {tab === 'breath' && <BoxBreathing />}
          {tab === 'ground' && <Grounding onFinish={finish} />}
          {tab === 'dump' && <BrainDump />}

          {tab !== 'ground' && (
            <button className="btn btn--ghost mt-6" onClick={finish} style={{ marginBottom: 'var(--space-6)' }}>
              {t('panic.steadier')}
            </button>
          )}
        </>
      )}
    </div>
  )
}
