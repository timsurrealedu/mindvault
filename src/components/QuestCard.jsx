import { useI18n } from '../context/LanguageContext.jsx'
import {
  IconCheck, IconStar, IconUsers, IconShield, IconWind, IconLeaf, IconHeart, IconBook,
} from './Icons.jsx'

// Focus identity is carried by a tinted leading icon (color-coded per area),
// not a side-stripe. See DESIGN.md → The Meaningful-State Rule / Do's & Don'ts.
const FOCUS_ICON = {
  grounding: IconLeaf,
  connection: IconUsers,
  rest: IconWind,
  body: IconHeart,
  reflection: IconBook,
  courage: IconShield,
}

export default function QuestCard({ quest, onComplete }) {
  const { t, lang } = useI18n()
  const Icon = FOCUS_ICON[quest.track] || IconStar
  const title = quest.title?.[lang] || quest.title?.en || quest.title
  const desc = quest.desc?.[lang] || quest.desc?.en || quest.desc

  return (
    <div className={`card card--hover quest-card track-${quest.track} ${quest.done ? 'done' : ''}`}>
      <div className="quest-card__head">
        <span className="quest-track-icon"><Icon size={18} /></span>
        <div className="col quest-track-meta">
          <span className="quest-track-label">{t(`focus.${quest.track}`)}</span>
          <span className="quest-track-hint">{t(`focus.${quest.track}.hint`)}</span>
        </div>
        <span className="badge badge--exp"><IconStar size={12} /> {quest.exp}</span>
      </div>

      <h4>{title}</h4>
      <p className="quest-desc">{desc}</p>

      <div className="quest-progress-wrap">
        <div className="quest-progress" role="progressbar" aria-valuenow={quest.progress} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${quest.progress}%` }} />
        </div>
        <span className="quest-progress-pct">{quest.progress}%</span>
      </div>

      {quest.done ? (
        <span className="quest-done-row">
          <IconCheck size={16} /> {t('quest.done')}
        </span>
      ) : (
        <button className="btn btn--primary btn--sm btn--block" onClick={() => onComplete(quest)}>
          {t('quest.complete')}
        </button>
      )}
    </div>
  )
}
