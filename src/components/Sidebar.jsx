import { useApp } from '../context/AppContext.jsx'
import { useI18n } from '../context/LanguageContext.jsx'
import Logo from './Logo.jsx'
import {
  IconDashboard, IconJournal, IconQuest, IconDoctor,
  IconLifebuoy, IconMessage, IconUser,
} from './Icons.jsx'

const NAV = [
  { id: 'dashboard', key: 'nav.dashboard', Icon: IconDashboard },
  { id: 'journal', key: 'nav.journal', Icon: IconJournal },
  { id: 'quests', key: 'nav.quests', Icon: IconQuest },
  { id: 'community', key: 'nav.community', Icon: IconMessage },
  { id: 'teleconsult', key: 'nav.teleconsult', Icon: IconDoctor },
]

export default function Sidebar() {
  const { view, go, openPanic, sidebarOpen, setSidebarOpen } = useApp()
  const { t } = useI18n()

  return (
    <>
      <div className={`scrim ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <Logo size={38} title="MindVault" />
          <span className="brand__name">Mind<span>Vault</span></span>
        </div>

        <nav className="nav">
          <div className="nav__label">{t('nav.menu')}</div>
          {NAV.map(({ id, key, Icon }) => (
            <button
              key={id}
              className={`nav__item ${view === id ? 'active' : ''}`}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              {t(key)}
            </button>
          ))}
        </nav>

        <div className="sidebar__spacer" />

        <button className="btn btn--danger btn--block" onClick={openPanic}>
          <IconLifebuoy size={18} />
          {t('nav.panic')}
        </button>
        <button
          className={`nav__item nav__item--footer ${view === 'profile' ? 'active' : ''}`}
          onClick={() => go('profile')}
        >
          <IconUser size={19} />
          {t('nav.profile')}
        </button>
      </aside>
    </>
  )
}
