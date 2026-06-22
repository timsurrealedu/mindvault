import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { api } from '../lib/api.js'
import { anchorToChain, shortHash } from '../lib/web3.js'
import Modal from '../components/Modal.jsx'
import {
  IconSparkle, IconJournal as IconZen, IconSend, IconClose, IconLifebuoy, IconLock,
  IconBook, IconCheck, IconClock, IconTrash2,
} from '../components/Icons.jsx'

const DISTRESS = /\b(panic|can'?t breathe|overwhelm|hopeless|anxious|terrified|spiral|worthless|scared)\b/i

// Zen writing-column width is a continuous slider (px), not fixed presets.
const ZEN_MIN = 600
const ZEN_MAX = 1240
const ZEN_DEFAULT = 880
const persist = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const read = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v) } catch { return fallback }
}

/* ---------------- AI Chat Mode ---------------- */
function ChatMode() {
  const { openPanic, logChat } = useApp()
  const { t } = useI18n()
  const [messages, setMessages] = useState([{ id: 'm0', from: 'ai', text: t('journal.aiGreeting') }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [detect, setDetect] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    const mine = { id: Math.random().toString(36).slice(2), from: 'user', text }
    setMessages((m) => [...m, mine])
    setInput('')
    setTyping(true)
    logChat(text) // feeds the personalised quest focus

    const flagged = DISTRESS.test(text)
    const { reply } = await api.sendChat(text)
    setTyping(false)
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), from: 'ai', text: reply }])
    if (flagged) setTimeout(() => setDetect(true), 700)
  }

  return (
    <>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="chat-window">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.from}`}>
              <div className="who">{m.from === 'ai' ? t('journal.ai') : t('journal.you')}</div>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="bubble ai">
              <div className="typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="chat-input">
          <input
            className="field"
            placeholder={t('journal.chatPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="btn btn--primary" onClick={send} aria-label={t('common.send')}>
            <IconSend size={18} />
          </button>
        </div>
      </div>
      <div className="row gap-2 mt-4" style={{ justifyContent: 'center' }}>
        <span className="chain-indicator flashing"><span className="lock" /> {t('journal.encrypting')}</span>
      </div>

      {/* Gentle auto-trigger when the AI detects panic patterns */}
      {detect && (
        <Modal onClose={() => setDetect(false)} className="auto-detect" width={460}>
          <div className="modal__head">
            <div className="modal__icon"><IconLifebuoy size={22} /></div>
            <div>
              <h3>{t('journal.detectTitle')}</h3>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{t('journal.detectBy')}</span>
            </div>
          </div>
          <p className="muted">{t('journal.detectBody')}</p>
          <div className="row gap-2 mt-6">
            <button className="btn btn--primary flex-1" onClick={() => { setDetect(false); openPanic() }}>
              {t('journal.breathe')}
            </button>
            <button className="btn btn--ghost" onClick={() => setDetect(false)}>{t('common.notNow')}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

/* ---------------- Saved Entries ---------------- */
function SavedEntries() {
  const { journals, deleteJournal, toast } = useApp()
  const { t, lang } = useI18n()
  const [openId, setOpenId] = useState(null)

  const fmt = (ts) =>
    new Date(ts).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })

  if (!journals.length) {
    return (
      <div className="card card--pad empty-state">
        <IconBook size={26} />
        <p className="muted">{t('saved.empty')}</p>
      </div>
    )
  }

  return (
    <>
      <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>
        {t('saved.count', { n: journals.length })}
      </p>
      <div className="saved-list">
        {journals.map((j) => (
          <div key={j.id} className={`card saved-entry ${openId === j.id ? 'open' : ''}`}>
            <button
              className="saved-entry__head"
              onClick={() => setOpenId(openId === j.id ? null : j.id)}
              aria-expanded={openId === j.id}
            >
              <div className="saved-entry__meta">
                <span className="saved-entry__date"><IconClock size={13} /> {fmt(j.ts)}</span>
                <span className="muted">{t('saved.words', { n: j.words })}</span>
              </div>
              <p className="saved-entry__text">{j.text}</p>
            </button>
            <div className="saved-entry__actions">
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  deleteJournal(j.id)
                  if (openId === j.id) setOpenId(null)
                  toast(t('saved.deletedToast'), 'check')
                }}
              >
                <IconTrash2 size={14} /> {t('saved.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------------- Zen Mode ---------------- */
function ZenMode() {
  const { setZen, pokeMascot, saveJournal, toast } = useApp()
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle') // idle | saving | saved
  const [lastHash, setLastHash] = useState(null)
  const [width, setWidth] = useState(() => {
    const w = read('mindvault.zenWidth', ZEN_DEFAULT)
    return typeof w === 'number' ? Math.min(ZEN_MAX, Math.max(ZEN_MIN, w)) : ZEN_DEFAULT
  })
  const [autoformat, setAutoformat] = useState(() => read('mindvault.zenAutoformat', true))
  const taRef = useRef(null)
  const saveTimer = useRef(null)
  const caretRef = useRef(null) // pending caret position after an auto-format edit

  // Auto-expand the textarea to fit its content.
  useEffect(() => {
    const ta = taRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${ta.scrollHeight}px`
    }
    // Restore caret after a programmatic (auto-format) text change.
    if (caretRef.current != null && ta) {
      ta.selectionStart = ta.selectionEnd = caretRef.current
      caretRef.current = null
    }
  }, [text])

  useEffect(() => { persist('mindvault.zenWidth', width) }, [width])
  useEffect(() => { persist('mindvault.zenAutoformat', autoformat) }, [autoformat])

  // Debounced "encrypt & anchor to chain" after the user stops typing.
  useEffect(() => {
    if (!text.trim()) return
    setStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await anchorToChain({ words: text.trim().split(/\s+/).length })
      setLastHash(res.hash)
      setStatus('saved')
    }, 1400)
    return () => clearTimeout(saveTimer.current)
  }, [text])

  // Enter handling: poke the mascot, and (when enabled) gently continue lists.
  const onKeyDown = (e) => {
    if (e.key === 'Enter') pokeMascot()
    if (!autoformat || e.key !== 'Enter' || e.shiftKey) return
    const ta = e.target
    const pos = ta.selectionStart
    if (pos !== ta.selectionEnd) return // don't interfere with a selection
    const value = ta.value
    const lineStart = value.lastIndexOf('\n', pos - 1) + 1
    const line = value.slice(lineStart, pos)
    const bullet = line.match(/^(\s*)[-*•]\s+(.*)$/)
    const num = line.match(/^(\s*)(\d+)([.)])\s+(.*)$/)
    if (!bullet && !num) return
    e.preventDefault()

    if (bullet) {
      const [, indent, content] = bullet
      if (!content.trim()) { // empty item → end the list
        caretRef.current = lineStart
        setText(value.slice(0, lineStart) + value.slice(pos))
        return
      }
      const insert = `\n${indent}- `
      caretRef.current = pos + insert.length
      setText(value.slice(0, pos) + insert + value.slice(pos))
      return
    }
    const [, indent, n, sep, content] = num
    if (!content.trim()) {
      caretRef.current = lineStart
      setText(value.slice(0, lineStart) + value.slice(pos))
      return
    }
    const insert = `\n${indent}${Number(n) + 1}${sep} `
    caretRef.current = pos + insert.length
    setText(value.slice(0, pos) + insert + value.slice(pos))
  }

  const onSave = () => {
    const entry = saveJournal(text)
    if (entry) toast(t('zen.savedToast'), 'check')
    else toast(t('zen.emptyToast'), 'star')
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="zen-wrap" style={{ maxWidth: width }}>
      <div className="zen-meta">
        <span className={`chain-indicator ${status === 'saving' ? 'flashing' : ''}`}>
          <span className="lock" />
          {status === 'saving' && t('journal.encrypting')}
          {status === 'saved' && t('zen.saved', { hash: shortHash(lastHash) })}
          {status === 'idle' && t('zen.idle')}
        </span>
      </div>
      <button className="icon-btn zen-exit" onClick={() => setZen(false)} aria-label={t('zen.exit')}>
        <IconClose size={18} />
      </button>

      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div className="eyebrow">{t('journal.zenMode')} · {t('zen.words', { n: words })}</div>
        <h1 style={{ fontSize: '1.4rem' }}>{t('zen.heading')}</h1>
      </div>

      <textarea
        ref={taRef}
        className="zen-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('zen.placeholder')}
        spellCheck={false}
        autoFocus
      />

      {/* Slim, unobtrusive controls — calm by default, ignorable while writing. */}
      <div className="zen-toolbar">
        <div className="zen-toolbar__group">
          <span className="zen-toolbar__label">{t('zen.width')}</span>
          <input
            type="range"
            className="zen-range"
            min={ZEN_MIN}
            max={ZEN_MAX}
            step={20}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            aria-label={t('zen.width')}
          />
        </div>

        <button
          className={`zen-toggle ${autoformat ? 'on' : ''}`}
          onClick={() => setAutoformat((v) => !v)}
          aria-pressed={autoformat}
          title={t('zen.autoformatHint')}
        >
          <span className="zen-toggle__dot" />
          {t('zen.autoformat')}
        </button>

        <button className="btn btn--ghost btn--sm" onClick={onSave}>
          <IconCheck size={14} /> {t('zen.save')}
        </button>
      </div>
    </div>
  )
}

/* ---------------- Page ---------------- */
export default function Journal() {
  const { zen, setZen, journals } = useApp()
  const { t } = useI18n()
  const [tab, setTab] = useState('chat') // chat | saved

  if (zen) return <ZenMode />

  return (
    <div className="view">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('journal.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('journal.title')}</h1>
        </div>
        <span className="badge"><IconLock size={13} /> {t('journal.private')}</span>
      </div>

      <div className="journal-head" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="segmented">
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>
            <IconSparkle size={16} /> {t('journal.chatMode')}
          </button>
          <button onClick={() => setZen(true)}><IconZen size={16} /> {t('journal.zenMode')}</button>
          <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>
            <IconBook size={16} /> {t('journal.savedTab')}
            {journals.length > 0 && <span className="seg-count">{journals.length}</span>}
          </button>
        </div>
        <span className="muted" style={{ fontSize: '0.85rem' }}>{t('journal.modeHint')}</span>
      </div>

      {tab === 'chat' ? <ChatMode /> : <SavedEntries />}
    </div>
  )
}
