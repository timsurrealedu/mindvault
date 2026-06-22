import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import Confetti from '../components/Confetti.jsx'
import { rewards, user } from '../lib/data.js'
import { topFocus } from '../lib/quests.js'
import {
  IconGift, IconPaw, IconSparkle, IconHeart, IconStar, IconCheck, IconRefresh, IconLock,
} from '../components/Icons.jsx'

const REWARD_ICONS = { paw: IconPaw, sparkle: IconSparkle, gift: IconGift, heart: IconHeart }

/* The Rewards page — dedicated to the EXP economy: what you've earned, what
   you're working toward, and exactly what each reward gives you. Earning lives
   at the bottom (the checkable daily quests, same set as the Dashboard), so the
   page reads top-to-bottom as balance → spend → earn. */
export default function Quests() {
  const {
    exp, spendExp, toast, quests, completeQuest, recurateQuests, recurateLeft, recurateLimit,
    questFocus, journals,
  } = useApp()
  const { t, lang } = useI18n()
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

  // Economy: cheapest-first, find the next goal you can't yet afford, and how
  // many are already redeemable.
  const sorted = [...rewards].sort((a, b) => a.cost - b.cost)
  const readyCount = sorted.filter((r) => exp >= r.cost).length
  const nextReward = sorted.find((r) => exp < r.cost) || null
  const nextPct = nextReward ? Math.min(100, Math.round((exp / nextReward.cost) * 100)) : 100

  return (
    <div className="view">
      <Confetti fireKey={fire} />

      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('quests.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('quests.title')}</h1>
        </div>
      </div>

      {/* EXP balance hero — what you hold, your level, and the next goal. */}
      <div className="card card--pad reward-balance">
        <div className="reward-balance__main">
          <div className="reward-balance__icon"><IconStar size={26} /></div>
          <div>
            <div className="eyebrow">{t('reward.balanceTitle')}</div>
            <div className="reward-balance__num">{exp.toLocaleString()} <span>EXP</span></div>
            <div className="reward-balance__level">{t('reward.levelLabel')} · {t('dash.lv', { n: user.level })}</div>
          </div>
        </div>
        <div className="reward-balance__next">
          {nextReward ? (
            <>
              <div className="row between">
                <span className="muted" style={{ fontSize: '0.8rem' }}>{t('reward.nextUp')}</span>
                <span className="reward-balance__nextname">{nextReward.title}</span>
              </div>
              <div className="quest-progress" style={{ margin: 'var(--space-3) 0 var(--space-2)' }}>
                <i style={{ width: `${nextPct}%` }} />
              </div>
              <div className="row between">
                <span className="muted" style={{ fontSize: '0.78rem' }}>
                  {t('reward.toGo', { n: (nextReward.cost - exp).toLocaleString() })}
                </span>
                {readyCount > 0 && (
                  <span className="muted" style={{ fontSize: '0.78rem' }}>{t('reward.readyCount', { n: readyCount })}</span>
                )}
              </div>
            </>
          ) : (
            <p className="muted" style={{ margin: 0 }}>{t('reward.allReady')}</p>
          )}
        </div>
      </div>

      {/* Spend — every reward inline, with detail on what the EXP buys. */}
      <div className="section-head">
        <div>
          <h2>{t('reward.spendTitle')}</h2>
          <p>{t('reward.spendSub')}</p>
        </div>
        <span className="badge badge--web3"><IconLock size={13} /> {t('dash.e2e')}</span>
      </div>
      <div className="reward-grid">
        {sorted.map((r) => {
          const Icon = REWARD_ICONS[r.icon] || IconGift
          const affordable = exp >= r.cost
          const rpct = Math.min(100, Math.round((exp / r.cost) * 100))
          return (
            <div className={`card reward-item ${affordable ? 'reward-item--ready' : ''}`} key={r.id}>
              <div className="reward-item__head">
                <div className="reward-item__icon"><Icon size={24} /></div>
                <div className="flex-1">
                  <div className="reward-item__title">{r.title}</div>
                  <span className={`reward-kind reward-kind--${r.kind}`}>{t(`reward.kind.${r.kind}`)}</span>
                </div>
              </div>
              <p className="reward-item__desc">{r.desc?.[lang] || r.desc?.en}</p>
              <div className="reward-item__progress">
                <div className="quest-progress"><i style={{ width: `${rpct}%` }} /></div>
                <span className="reward-item__cost">
                  {affordable
                    ? <span className="reward-ready"><IconCheck size={12} /> {t('reward.ready')}</span>
                    : t('reward.progress', { have: exp.toLocaleString(), cost: r.cost.toLocaleString() })}
                </span>
              </div>
              <button
                className={`btn btn--block btn--sm ${affordable ? 'btn--primary' : ''}`}
                onClick={() => redeem(r)}
                disabled={!affordable}
              >
                {affordable
                  ? <><IconStar size={14} /> {t('reward.redeem')} · {r.cost} EXP</>
                  : <><IconLock size={13} /> {t('reward.cost', { n: r.cost.toLocaleString() })}</>}
              </button>
            </div>
          )
        })}
      </div>

      {/* Earn — the checkable daily quests (same set as the Dashboard) + the
          limited re-curate control and your current focus. */}
      <div className="section-head">
        <div>
          <h2>{t('reward.earnTitle')}</h2>
          <p>{t('reward.earnSub')}</p>
        </div>
        <span className="badge badge--exp">{t('quests.completedOf', { done, total })}</span>
      </div>
      <div className="card card--pad">
        <div className="row between" style={{ marginBottom: 'var(--space-3)' }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>{t('quests.completedOf', { done, total })}</span>
          <span className="quest-progress-pct">{pct}%</span>
        </div>
        <div
          className="quest-progress"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ marginBottom: 'var(--space-4)' }}
        >
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

        {journals.length > 0 && (
          <div className="focus-chips mt-5">
            {areas.map((k) => (
              <span key={k} className={`focus-chip track-${k}`}>{t(`focus.${k}`)}</span>
            ))}
          </div>
        )}
        <div className="recurate-row mt-4">
          <button className="btn btn--ghost btn--sm" onClick={recurateQuests} disabled={recurateLeft === 0}>
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
      </div>
    </div>
  )
}
