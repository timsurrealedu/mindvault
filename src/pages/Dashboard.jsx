import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import Aura from '../components/Aura.jsx'
import QuestCard from '../components/QuestCard.jsx'
import Confetti from '../components/Confetti.jsx'
import { user, quoteOfDay } from '../lib/data.js'
import {
  IconShield, IconSparkle, IconChevronLeft, IconChevronRight, IconLeaf,
} from '../components/Icons.jsx'

export default function Dashboard() {
  const { go, quests, completeQuest } = useApp()
  const { t, lang } = useI18n()
  const quote = quoteOfDay()
  const [fire, setFire] = useState(null)
  const scrollerRef = useRef(null)

  const complete = (q) => {
    completeQuest(q)
    setFire(Date.now())
  }

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 304, behavior: 'smooth' })
  }

  const openQuests = quests.filter((q) => !q.done).length

  return (
    <div className="view">
      <Confetti fireKey={fire} />

      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('dash.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('dash.welcome', { name: user.name })}</h1>
        </div>
        <span className="badge badge--web3"><IconShield size={14} /> {t('dash.e2e')}</span>
      </div>

      {/* Aura + stats */}
      <div className="grid dash-hero">
        <div className="card card--pad">
          <div className="row between">
            <div>
              <div className="eyebrow">{t('dash.moodAura')}</div>
              <h2 style={{ fontSize: '1.2rem' }}>{t('dash.weather')}</h2>
            </div>
            <span className="badge"><IconSparkle size={13} /> {t('dash.aiAgg')}</span>
          </div>
          <Aura />
        </div>

        <div className="col" style={{ gap: 'var(--space-4)' }}>
          <div className="card card--pad week-card">
            <div className="eyebrow">{t('dash.thisWeek')}</div>
            <div className="week-hero">
              <span className="week-hero__num">{user.streak}</span>
              <span className="week-hero__unit">{t('dash.dayStreak')} <span aria-hidden="true">🔥</span></span>
            </div>
            <p className="week-hero__note">{t('dash.streakNote')}</p>
            <div className="week-stats">
              <div><b>{t('dash.lv', { n: user.level })}</b><span>{t('dash.resilience')}</span></div>
              <div><b>{user.exp.toLocaleString()}</b><span>{t('dash.exp')}</span></div>
              <div><b>{openQuests}</b><span>{t('dash.openQuests')}</span></div>
            </div>
          </div>

          <div className="card card--pad quote-card" style={{ flex: 1 }}>
            <div className="row between">
              <div className="eyebrow">{t('dash.quoteTitle')}</div>
              <IconLeaf size={16} color="var(--success)" />
            </div>
            <blockquote className="quote-card__text">{quote[lang] || quote.en}</blockquote>
          </div>
        </div>
      </div>

      {/* Daily quests */}
      <div className="section-head">
        <div>
          <h2>{t('dash.dailyQuests')}</h2>
          <p>{t('dash.dailyQuestsSub')}</p>
        </div>
        <div className="row gap-2">
          <button className="icon-btn" onClick={() => scrollBy(-1)} aria-label={t('dash.scrollLeft')}>
            <IconChevronLeft size={18} />
          </button>
          <button className="icon-btn" onClick={() => scrollBy(1)} aria-label={t('dash.scrollRight')}>
            <IconChevronRight size={18} />
          </button>
          <button className="btn btn--ghost btn--sm" onClick={() => go('quests')}>{t('common.viewAll')}</button>
        </div>
      </div>
      <div className="hscroll hscroll--bleed" ref={scrollerRef}>
        {quests.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={complete} />
        ))}
      </div>
    </div>
  )
}
