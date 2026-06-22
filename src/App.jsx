import { useApp } from './context/AppContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import PanicMode from './components/PanicMode.jsx'
import Toasts from './components/Toasts.jsx'
import Mascot from './components/Mascot.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Journal from './pages/Journal.jsx'
import Quests from './pages/Quests.jsx'
import Community from './pages/Community.jsx'
import Teleconsult from './pages/Teleconsult.jsx'
import Profile from './pages/Profile.jsx'

const PAGES = {
  dashboard: Dashboard,
  journal: Journal,
  quests: Quests,
  community: Community,
  teleconsult: Teleconsult,
  profile: Profile,
}

export default function App() {
  const { view, zen } = useApp()
  const Page = PAGES[view] || Dashboard

  // Zen mode hides all navigation chrome for distraction-free writing.
  if (zen) {
    return (
      <div className="app-shell zen">
        <main className="main"><Page /></main>
        <PanicMode />
        <Mascot />
        <Toasts />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <Page />
      </main>
      <PanicMode />
      <Mascot />
      <Toasts />
    </div>
  )
}
