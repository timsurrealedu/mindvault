import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import {
  communityCategories, communityThreads, handleAdjectives, handleAnimals,
} from '../lib/data.js'
import {
  IconShield, IconHeart, IconMessage, IconSend, IconHeartHands, IconLock,
} from '../components/Icons.jsx'

const resolveBody = (body, lang) => (typeof body === 'string' ? body : body?.[lang] || body?.en || '')
const randomHandle = () => ({
  handle: `${handleAdjectives[Math.floor(Math.random() * handleAdjectives.length)]} ${
    handleAnimals[Math.floor(Math.random() * handleAnimals.length)]
  }`,
  emoji: ['🦦', '🐦', '🦊', '🪶', '🐨', '🐝', '🦌', '🐳', '🐧'][Math.floor(Math.random() * 9)],
})

export default function Community() {
  const { toast } = useApp()
  const { t, lang } = useI18n()
  const me = useMemo(randomHandle, [])
  const catLabel = (id) => t(`community.cat.${id}`)
  const [threads, setThreads] = useState(communityThreads)
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const [draftCat, setDraftCat] = useState('anxiety')
  const [supported, setSupported] = useState({})
  const [openThread, setOpenThread] = useState(null) // which thread's replies are expanded
  const [replyDraft, setReplyDraft] = useState('')

  const visible = filter === 'all' ? threads : threads.filter((t) => t.category === filter)

  const post = () => {
    const body = draft.trim()
    if (!body) return
    const thread = {
      id: Math.random().toString(36).slice(2),
      handle: me.handle, emoji: me.emoji, category: draftCat,
      time: 'just now', body, support: 0, replyList: [], mine: true,
    }
    setThreads((list) => [thread, ...list])
    setDraft('')
    toast(t('community.sharedToast'), 'shield')
  }

  const support = (id) => {
    if (supported[id]) return
    setSupported((s) => ({ ...s, [id]: true }))
    setThreads((list) => list.map((x) => (x.id === id ? { ...x, support: x.support + 1 } : x)))
  }

  const toggleReplies = (id) => {
    setReplyDraft('')
    setOpenThread((cur) => (cur === id ? null : id))
  }

  const sendReply = (id) => {
    const body = replyDraft.trim()
    if (!body) return
    const reply = { id: Math.random().toString(36).slice(2), handle: me.handle, emoji: me.emoji, time: 'just now', body, mine: true }
    setThreads((list) => list.map((x) => (x.id === id ? { ...x, replyList: [...(x.replyList || []), reply] } : x)))
    setReplyDraft('')
    toast(t('community.replySent'), 'shield')
  }

  return (
    <div className="view">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('community.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('community.title')}</h1>
        </div>
        <div className="row gap-2 wrap">
          <span className="badge badge--web3"><IconShield size={14} /> {t('community.moderated')}</span>
          <span className="badge"><IconLock size={13} /> {t('community.anon')}</span>
        </div>
      </div>

      {/* Composer */}
      <div className="card card--pad">
        <div className="row between" style={{ marginBottom: 'var(--space-3)' }}>
          <span className="row gap-2">
            <span className="community-avatar" aria-hidden="true">{me.emoji}</span>
            <span className="col" style={{ lineHeight: 1.2 }}>
              <strong style={{ color: 'var(--text-strong)', fontSize: '0.9rem' }}>{t('community.postingAs', { handle: me.handle })}</strong>
              <span className="muted" style={{ fontSize: '0.76rem' }}>{t('community.identityHidden')}</span>
            </span>
          </span>
        </div>
        <textarea
          className="field"
          rows={3}
          placeholder={t('community.placeholder')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
        />
        <div className="row between wrap gap-2 mt-4">
          <div className="row gap-2 wrap">
            {communityCategories.filter((c) => c.id !== 'all').map((c) => (
              <button
                key={c.id}
                className={`mood-pill ${draftCat === c.id ? 'active' : ''}`}
                onClick={() => setDraftCat(c.id)}
              >
                {catLabel(c.id)}
              </button>
            ))}
          </div>
          <button className="btn btn--primary" onClick={post} disabled={!draft.trim()}>
            <IconSend size={16} /> {t('community.share')}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="row gap-2 wrap mt-6" style={{ marginBottom: 'var(--space-4)' }}>
        {communityCategories.map((c) => (
          <button
            key={c.id}
            className={`mood-pill ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
          >
            {catLabel(c.id)}
          </button>
        ))}
      </div>

      {/* Threads */}
      <div className="col" style={{ gap: 'var(--space-4)' }}>
        {visible.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon"><IconMessage size={26} /></div>
            <strong>{t('community.emptyTitle')}</strong>
            <span className="muted">{t('community.emptyBody')}</span>
          </div>
        )}
        {visible.map((th) => (
          <div className="card card--pad community-thread" key={th.id}>
            <div className="community-thread__head">
              <span className="community-avatar" aria-hidden="true">{th.emoji}</span>
              <div className="col flex-1" style={{ lineHeight: 1.3 }}>
                <strong style={{ color: 'var(--text-strong)', fontSize: '0.92rem' }}>{th.handle}</strong>
                <span className="muted" style={{ fontSize: '0.76rem' }}>{th.time}</span>
              </div>
              <span className="badge badge--track-burnout">{catLabel(th.category)}</span>
            </div>
            <p className="community-thread__body">{resolveBody(th.body, lang)}</p>
            <div className="row gap-4">
              <button
                className={`community-action ${supported[th.id] ? 'active' : ''}`}
                onClick={() => support(th.id)}
              >
                <IconHeart size={16} /> {th.support} <span className="community-action__label">{t('community.support')}</span>
              </button>
              <button
                className={`community-action ${openThread === th.id ? 'active' : ''}`}
                onClick={() => toggleReplies(th.id)}
                aria-expanded={openThread === th.id}
              >
                <IconMessage size={16} /> {(th.replyList || []).length} <span className="community-action__label">{t('community.replies')}</span>
              </button>
            </div>

            {openThread === th.id && (
              <div className="reply-thread">
                {(th.replyList || []).length === 0 ? (
                  <p className="reply-thread__empty muted">{t('community.noReplies')}</p>
                ) : (
                  (th.replyList || []).map((rep) => (
                    <div className={`reply ${rep.mine ? 'reply--mine' : ''}`} key={rep.id}>
                      <span className="community-avatar community-avatar--sm" aria-hidden="true">{rep.emoji}</span>
                      <div className="reply__bubble">
                        <div className="reply__meta">
                          <strong>{rep.handle}</strong>
                          <span className="muted">{rep.time}</span>
                        </div>
                        <p className="reply__body">{resolveBody(rep.body, lang)}</p>
                      </div>
                    </div>
                  ))
                )}

                <div className="reply-compose">
                  <span className="community-avatar community-avatar--sm" aria-hidden="true">{me.emoji}</span>
                  <input
                    className="field"
                    placeholder={t('community.replyPlaceholder')}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendReply(th.id)}
                  />
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => sendReply(th.id)}
                    disabled={!replyDraft.trim()}
                    aria-label={t('community.reply')}
                  >
                    <IconSend size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="card card--pad mt-6 community-guidelines">
        <div className="row gap-2" style={{ marginBottom: 8 }}>
          <IconHeartHands size={18} color="var(--success)" />
          <strong style={{ color: 'var(--text-strong)' }}>{t('community.guidelinesTitle')}</strong>
        </div>
        <p className="muted" style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.6 }}>
          {t('community.guidelinesBody')}
        </p>
      </div>
    </div>
  )
}
