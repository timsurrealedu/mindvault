import { useApp } from '../context/AppContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { user } from '../lib/data.js'
import { MASCOTS } from '../lib/mascots.js'
import MascotSprite from '../components/MascotSprite.jsx'
import {
  IconShield, IconStar, IconCheck, IconLock, IconEye, IconEyeOff, IconHeart, IconGlobe,
} from '../components/Icons.jsx'

export default function Profile() {
  const {
    exp, mascotId, setMascot, mascotHidden, setMascotHidden, toast,
  } = useApp()
  const { theme, setTheme, themes } = useTheme()
  const { t, lang, setLang, languages } = useI18n()

  return (
    <div className="view">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{t('profile.eyebrow')}</div>
          <h1 style={{ fontSize: '1.7rem' }}>{t('profile.title', { name: user.name })}</h1>
        </div>
        <span className="badge badge--web3"><IconShield size={14} /> {t('profile.web3')}</span>
      </div>

      {/* Hero */}
      <div className="card card--pad profile-hero">
        <div className="profile-hero__avatar"><MascotSprite id={mascotId} px={5} /></div>
        <div className="flex-1">
          <h2 style={{ fontSize: '1.3rem' }}>{user.name}</h2>
          <p className="muted" style={{ fontSize: '0.88rem' }}>
            {t('profile.level', { lv: user.level, days: user.joinedDays })}
          </p>
          <div className="row gap-2 wrap mt-4">
            <span className="badge badge--exp"><IconStar size={13} /> {exp.toLocaleString()} EXP</span>
            <span className="badge badge--web3"><span className="pulse-dot" /> {t('profile.streakBadge', { n: user.streak })}</span>
            <span className="badge"><IconHeart size={12} /> {t('profile.calmBadges')}</span>
          </div>
        </div>
      </div>

      {/* Companion customization */}
      <div className="section-head">
        <div>
          <h2>{t('profile.companion')}</h2>
          <p>{t('profile.companionSub')}</p>
        </div>
      </div>
      <div className="card card--pad">
        <div className="mascot-picker">
          {MASCOTS.map((m) => (
            <button
              key={m.id}
              className={`mascot-choice ${mascotId === m.id ? 'active' : ''}`}
              onClick={() => { setMascot(m.id); toast(t('profile.nowCompanion', { name: m.name }), 'check') }}
              aria-pressed={mascotId === m.id}
            >
              <MascotSprite id={m.id} px={4} className={mascotId === m.id ? 'mascot-pet' : ''} />
              <span className="mascot-choice__name">{m.emoji} {m.name}</span>
              {mascotId === m.id && <span className="mascot-choice__check"><IconCheck size={14} /></span>}
            </button>
          ))}
        </div>

        <div className="consent-row mt-6">
          <div className="row gap-2">
            {mascotHidden ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            <div className="col">
              <strong style={{ color: 'var(--text-strong)' }}>{t('profile.showCompanion')}</strong>
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                {mascotHidden ? t('profile.hiddenHint') : t('profile.shownHint')}
              </span>
            </div>
          </div>
          <button
            className={`switch ${!mascotHidden ? 'on' : ''}`}
            onClick={() => setMascotHidden(!mascotHidden)}
            aria-pressed={!mascotHidden}
            aria-label={t('profile.showCompanion')}
          />
        </div>
      </div>

      {/* Language */}
      <div className="section-head">
        <div>
          <h2>{t('profile.language')}</h2>
          <p>{t('profile.languageSub')}</p>
        </div>
      </div>
      <div className="grid grid-2">
        {languages.map((l) => (
          <button
            key={l.id}
            className={`card card--pad lang-choice ${lang === l.id ? 'active' : ''}`}
            onClick={() => setLang(l.id)}
            aria-pressed={lang === l.id}
          >
            <span className="lang-choice__tag"><IconGlobe size={16} /> {l.tag}</span>
            <span className="col flex-1" style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--text-strong)' }}>{l.label}</strong>
            </span>
            {lang === l.id && <IconCheck size={16} color="var(--primary)" />}
          </button>
        ))}
      </div>

      {/* Appearance */}
      <div className="section-head">
        <div>
          <h2>{t('profile.appearance')}</h2>
          <p>{t('profile.appearanceSub')}</p>
        </div>
      </div>
      <div className="grid grid-3">
        {themes.map((th) => (
          <button
            key={th.id}
            className={`card card--pad theme-choice ${theme === th.id ? 'active' : ''}`}
            onClick={() => setTheme(th.id)}
            aria-pressed={theme === th.id}
          >
            <div className="theme-choice__swatch">
              {th.swatch.map((c) => <span key={c} style={{ background: c }} />)}
            </div>
            <div className="col flex-1" style={{ lineHeight: 1.3, textAlign: 'left' }}>
              <strong style={{ color: 'var(--text-strong)' }}>{th.label}</strong>
              <span className="muted" style={{ fontSize: '0.78rem' }}>{th.hint}</span>
            </div>
            {theme === th.id && <IconCheck size={16} color="var(--primary)" />}
          </button>
        ))}
      </div>

      {/* Privacy */}
      <div className="section-head">
        <div>
          <h2>{t('profile.privacy')}</h2>
          <p>{t('profile.privacySub')}</p>
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card card--pad">
          <div className="row between">
            <strong style={{ color: 'var(--text-strong)' }}>{t('profile.vault')}</strong>
            <IconLock size={16} color="var(--success)" />
          </div>
          <p className="muted mt-2" style={{ fontSize: '0.88rem' }}>{t('profile.vaultBody')}</p>
          <span className="badge badge--web3 mt-4"><span className="pulse-dot" /> {t('profile.walletLinked')}</span>
        </div>
        <div className="card card--pad">
          <div className="row between">
            <strong style={{ color: 'var(--text-strong)' }}>{t('profile.dataControl')}</strong>
            <IconShield size={16} color="var(--primary)" />
          </div>
          <p className="muted mt-2" style={{ fontSize: '0.88rem' }}>{t('profile.dataBody')}</p>
          <div className="row gap-2 mt-4 wrap">
            <button className="btn btn--ghost btn--sm" onClick={() => toast(t('profile.exportToast'), 'shield')}>{t('profile.exportData')}</button>
            <button className="btn btn--ghost btn--sm" onClick={() => toast(t('profile.consentToast'), 'shield')}>{t('profile.consentLog')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
