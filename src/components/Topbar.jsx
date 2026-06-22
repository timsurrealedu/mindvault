import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import { user } from '../lib/data.js'
import ThemeSwitcher from './ThemeSwitcher.jsx'
import { IconMenu, IconLifebuoy, IconStar } from './Icons.jsx'

const greetingKey = () => {
  const h = new Date().getHours()
  if (h < 12) return 'top.morning'
  if (h < 18) return 'top.afternoon'
  return 'top.evening'
}

export default function Topbar() {
  const { exp, openPanic, setSidebarOpen } = useApp()
  const { t } = useI18n()

  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label={t('nav.menu')}>
        <IconMenu size={20} />
      </button>

      <div className="topbar__greeting">
        <span className="topbar__hi">
          <span className="greet-full">{t(greetingKey())}</span>
          <span className="greet-short">{t('top.hi')}</span>, {user.name} 👋
        </span>
        <span className="topbar__sub">{t('top.sub', { n: user.streak })}</span>
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__actions">
        <span className="badge badge--exp"><IconStar size={14} /> {exp.toLocaleString()} EXP</span>
        <span className="badge badge--web3" title={t('top.sub', { n: user.streak })}>
          <span className="pulse-dot" /> {t('top.web3')}
        </span>
        <ThemeSwitcher />
        <button className="icon-btn" onClick={openPanic} title={t('top.panic')} aria-label={t('top.panic')} style={{ color: 'var(--danger)' }}>
          <IconLifebuoy size={19} />
        </button>
      </div>
    </header>
  )
}
