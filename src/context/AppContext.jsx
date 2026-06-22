import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { user as seedUser } from '../lib/data.js'
import { getDailyQuests, inferFocus, todaySeed } from '../lib/quests.js'
import { useI18n } from './LanguageContext.jsx'

/* Global, cross-page app state: navigation, mood/aura, EXP economy, the panic
   overlay, toasts, the companion mascot, and the shared adaptive quest board.
   Kept deliberately lightweight (React state, no external store) for the
   prototype. Mascot + theme-like prefs persist to localStorage. */

const AppContext = createContext(null)

// How many times per day a user may ask the AI to re-curate. Deliberately small
// — endlessly swapping quests is avoidance; facing today's set gently is the work.
export const RECURATE_LIMIT = 2

const persisted = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}
const persist = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

// Build the text corpus the AI "reads" to personalise quests: recent diary
// entries + recent AI-chat messages.
const buildCorpus = (journals, chatLog) => [
  ...journals.slice(0, 8).map((j) => j.text),
  ...chatLog.slice(-12),
]

export function AppProvider({ children }) {
  const { t, lang } = useI18n()

  const [view, setView] = useState('dashboard')
  const [mood, setMood] = useState('calm') // 'calm' | 'anxious' | 'neutral'
  const [exp, setExp] = useState(seedUser.exp)
  const [panicOpen, setPanicOpen] = useState(false)
  const [zen, setZen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  // Companion mascot
  const [mascotId, setMascotIdState] = useState(() => persisted('mindvault.mascot', 'cat'))
  const [mascotHidden, setMascotHiddenState] = useState(() => persisted('mindvault.mascotHidden', false))
  const [mascotPokes, setMascotPokes] = useState(0)
  // When set, the floating mascot glides to this rect and becomes a chat avatar.
  const [dockTarget, setDockTarget] = useState(null)

  // Saved Zen diary entries (read back later on the Diary page) + the user's
  // recent AI-chat messages. Together they seed the personalised quest focus.
  const initialJournals = persisted('mindvault.journals', [])
  const initialChat = persisted('mindvault.chatLog', [])
  const [journals, setJournals] = useState(initialJournals)
  const [chatLog, setChatLog] = useState(initialChat)

  // Shared, adaptive daily quest board (consistent across Dashboard & Quests),
  // weighted toward the focus areas inferred from the user's diary + chat + mood.
  const initialFocus = inferFocus(buildCorpus(initialJournals, initialChat), 'calm')
  const [questFocus, setQuestFocus] = useState(initialFocus)
  const [questSeed, setQuestSeed] = useState(todaySeed())
  const [quests, setQuests] = useState(() => getDailyQuests(todaySeed(), initialFocus))

  // Re-curate budget, reset each calendar day.
  const [recurate, setRecurate] = useState(() => {
    const today = todaySeed()
    const saved = persisted('mindvault.recurate', null)
    return saved && saved.date === today ? saved : { date: today, count: 0 }
  })
  const recurateLeft = Math.max(0, RECURATE_LIMIT - (recurate.date === todaySeed() ? recurate.count : 0))

  // Keep the "your focus right now" signal live as the diary / chat / mood
  // evolve (without reshuffling the day's quests — those stay stable until
  // re-curate or the next day, so the board doesn't shift under the user).
  useEffect(() => {
    setQuestFocus(inferFocus(buildCorpus(journals, chatLog), mood))
  }, [journals, chatLog, mood])

  // Toasts: dedupe identical messages and cap how many show at once, so rapid
  // taps (re-curate, changing companion) can never stack up and fill the screen.
  const toast = useCallback((message, icon = 'check') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => {
      const deduped = list.filter((x) => x.message !== message)
      return [...deduped, { id, message, icon }].slice(-3)
    })
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3200)
  }, [])

  const addExp = useCallback(
    (amount, note) => {
      setExp((e) => e + amount)
      if (note) toast(note, 'star')
    },
    [toast]
  )

  const spendExp = useCallback((amount) => {
    let ok = false
    setExp((e) => {
      if (e >= amount) { ok = true; return e - amount }
      return e
    })
    return ok
  }, [])

  const completeQuest = useCallback(
    (quest) => {
      setQuests((list) => list.map((q) => (q.id === quest.id ? { ...q, done: true, progress: 100 } : q)))
      const title = quest.title?.[lang] || quest.title?.en || quest.title
      addExp(quest.exp, t('exp.gain', { n: quest.exp, title }))
    },
    [addExp, t, lang]
  )

  /* "Ask the AI to re-curate" — a fresh seed yields a new recommended set,
     re-weighted to the current focus. Capped per day: once the budget is spent,
     we gently encourage staying with today's set rather than running from it. */
  const recurateQuests = useCallback(() => {
    const today = todaySeed()
    const base = recurate.date === today ? recurate : { date: today, count: 0 }
    if (base.count >= RECURATE_LIMIT) {
      toast(t('quests.recurateLimitToast'), 'star')
      return false
    }
    const seed = `${today}-${Math.random().toString(36).slice(2, 7)}`
    const focus = inferFocus(buildCorpus(journals, chatLog), mood)
    setQuestFocus(focus)
    setQuestSeed(seed)
    setQuests(getDailyQuests(seed, focus))
    const next = { date: today, count: base.count + 1 }
    setRecurate(next)
    persist('mindvault.recurate', next)
    toast(t('quests.recurateDoneToast'), 'star')
    return true
  }, [recurate, journals, chatLog, mood, toast, t])

  const saveJournal = useCallback((text) => {
    const clean = text.trim()
    if (!clean) return null
    const entry = {
      id: Math.random().toString(36).slice(2),
      text: clean,
      words: clean.split(/\s+/).length,
      ts: Date.now(),
    }
    setJournals((list) => {
      const next = [entry, ...list]
      persist('mindvault.journals', next)
      return next
    })
    return entry
  }, [])

  const deleteJournal = useCallback((id) => {
    setJournals((list) => {
      const next = list.filter((j) => j.id !== id)
      persist('mindvault.journals', next)
      return next
    })
  }, [])

  // Record a user's AI-chat message so it can feed the personalised quest focus.
  // Kept to the last 30 messages — enough signal, never unbounded.
  const logChat = useCallback((text) => {
    const clean = (text || '').trim()
    if (!clean) return
    setChatLog((list) => {
      const next = [...list, clean].slice(-30)
      persist('mindvault.chatLog', next)
      return next
    })
  }, [])

  const setMascot = useCallback((id) => { setMascotIdState(id); persist('mindvault.mascot', id) }, [])
  const setMascotHidden = useCallback((hidden) => {
    setMascotHiddenState(hidden)
    persist('mindvault.mascotHidden', hidden)
  }, [])
  const pokeMascot = useCallback(() => setMascotPokes((n) => n + 1), [])

  const openPanic = useCallback(() => setPanicOpen(true), [])
  const closePanic = useCallback(() => setPanicOpen(false), [])

  const go = useCallback((v) => {
    setView(v)
    setSidebarOpen(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        view, go,
        mood, setMood,
        exp, addExp, spendExp,
        panicOpen, openPanic, closePanic,
        zen, setZen,
        sidebarOpen, setSidebarOpen,
        toasts, toast,
        mascotId, setMascot,
        mascotHidden, setMascotHidden,
        mascotPokes, pokeMascot,
        dockTarget, setDockTarget,
        journals, saveJournal, deleteJournal,
        chatLog, logChat,
        quests, completeQuest, recurateQuests, questSeed,
        questFocus, recurateLeft, recurateLimit: RECURATE_LIMIT,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
