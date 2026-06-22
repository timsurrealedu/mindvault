import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import Modal from '../components/Modal.jsx'
import Confetti from '../components/Confetti.jsx'
import { rewards } from '../lib/data.js'
import { topFocus } from '../lib/quests.js'
import {
  IconGift, IconPaw, IconSparkle, IconHeart, IconStar, IconCheck, IconRefresh,
} from '../components/Icons.jsx'

const REWARD_ICONS = { paw: IconPaw, sparkle: IconSparkle, gift: IconGift, heart: IconHeart }

/* "Growth & Rewards" — the reflective counterpart to the Dashboard. You DO
   today's quests on the Dashboard; here you understand and steer the journey:
   what your quests are focusing on (and why), the limited re-curate control,
   today's progress at a glance, and the Rewards Hub. No duplicated quest cards,
   so it no longer feels redundant with the Dashboard. */
export default function Quests() {
  const {
    exp, spendExp, toast, quests, completeQuest, recurateQuests, recurateLeft, recurateLimit,
    questFocus, journals,
  } = useApp()
  const { t, lang } = useI18n()
  const [hubOpen, setHubOpen] = useState(false)
  const [fire, setFire] = useState(null)

  const redeem = (r) => {
    if (spendExp(r.cost)) toast(t('reward.redeemedToast', { title: r.title }), 'check')
    else toast(t('reward.notEnoughToast'), 'star')
  }

  const check = (q) => {
    if (q.done) return
    completeQuest(q)
    setFire(Date.now())
  }

  const done = quests.filter((q) => q.done).length
  const total = quests.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const areas = topFocus(questFocus, 4)

  return (
    <div className="view">
      <Confetti fireKey={fire} />

      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('quests.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('quests.title')}</h1>
        </div>
        <button className="btn btn--primary" onClick={() => setHubOpen(true)}>
          <IconGift size={18} /> {t('quests.rewardsHub', { exp: exp.toLocaleString() })}
        </button>
      </div>

      {/* Personalisation: what today's quests are focusing on, and why. */}
      <div className="card card--pad">
        <div className="row between" style={{ alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div className="flex-1">
            <div className="row gap-2" style={{ alignItems: 'center' }}>
              <span className="community-intro__icon"><IconSparkle size={18} /></span>
              <strong style={{ color: 'var(--text-strong)' }}>{t('quests.focusTitle')}</strong>
            </div>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {journals.length === 0 ? t('quests.focusEmpty') : t('quests.focusBody')}
            </p>
          </div>
        </div>

        {journals.length > 0 && (
          <div className="focus-chips mt-5">
            {areas.map((k) => (
              <span key={k} className={`focus-chip track-${k}`}>{t(`focus.${k}`)}</span>
            ))}
          </div>
        )}

        <div className="recurate-row mt-5">
          <button
            className="btn btn--ghost btn--sm"
            onClick={recurateQuests}
            disabled={recurateLeft === 0}
          >
            <IconRefresh size={16} />
            {recurateLeft > 0 ? t('quests.recurate') : t('quests.recurateNone')}
          </button>
          <span className="recurate-meter" aria-hidden="true">
            {Array.from({ length: recurateLimit }).map((_, i) => (
              <span key={i} className={`recurate-pip ${i < recurateLeft ? 'on' : ''}`} />
            ))}
          </span>
          <span className="muted" style={{ fontSize: '0.78rem' }}>
            {recurateLeft > 0 ? t('quests.recurateLeft', { n: recurateLeft }) : ''}
          </span>
        </div>
        <p className="muted" style={{ margin: '10px 0 0', fontSize: '0.78rem', lineHeight: 1.55 }}>
          {t('quests.recurateHint')}
        </p>
      </div>

      {/* Daily Quests — same set as the Dashboard, checkable right here. */}
      <div className="section-head">
        <div>
          <h2>{t('dash.dailyQuests')}</h2>
          <p>{t('quests.progressSub')}</p>
        </div>
        <span className="badge badge--exp">{t('quests.completedOf', { done, total })}</span>
      </div>
      <div className="card card--pad">
        <div className="row between" style={{ marginBottom: 'var(--space-3)' }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>{t('quests.completedOf', { done, total })}</span>
          <span className="quest-progress-pct">{pct}%</span>
        </div>
        <div className="quest-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ marginBottom: 'var(--space-4)' }}>
          <i style={{ width: `${pct}%` }} />
        </div>

        {done === total ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>{t('quests.allDone')}</p>
        ) : (
          <div className="growth-tasks">
            {quests.map((q) => (
              <button
                key={q.id}
                className={`growth-task ${q.done ? 'done' : ''}`}
                onClick={() => check(q)}
                disabled={q.done}
                aria-pressed={q.done}
              >
                <span className="growth-task__mark">{q.done && <IconCheck size={13} />}</span>
                <span className="growth-task__title">{q.title?.[lang] || q.title?.en || q.title}</span>
                <span className={`focus-chip track-${q.track}`}>{t(`focus.${q.track}`)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {hubOpen && (
        <Modal onClose={() => setHubOpen(false)} width={620}>
          <div className="modal__head">
            <div className="modal__icon"><IconGift size={22} /></div>
            <div>
              <h3>{t('reward.hubTitle')}</h3>
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                {t('reward.balance')}: <strong style={{ color: 'var(--accent)' }}>{exp.toLocaleString()} EXP</strong>
              </span>
            </div>
          </div>
          <div className="grid grid-2">
            {rewards.map((r) => {
              const Icon = REWARD_ICONS[r.icon] || IconGift
              const affordable = exp >= r.cost
              return (
                <div className="card reward-card" key={r.id}>
                  <div className="reward-icon"><Icon size={26} /></div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{r.title}</div>
                    <div className="muted" style={{ fontSize: '0.82rem' }}>{r.sub}</div>
                  </div>
                  <span className="badge badge--exp"><IconStar size={12} /> {r.cost} EXP</span>
                  <button
                    className={`btn btn--block btn--sm ${affordable ? 'btn--primary' : ''}`}
                    onClick={() => redeem(r)}
                    disabled={!affordable}
                    style={!affordable ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                  >
                    {affordable ? <><IconCheck size={15} /> {t('reward.redeem')}</> : t('reward.locked')}
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </div>
  )
}
