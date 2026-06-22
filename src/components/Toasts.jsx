import { useApp } from '../context/AppContext.jsx'
import { IconCheck, IconStar, IconShield } from './Icons.jsx'

const ICONS = { check: IconCheck, star: IconStar, shield: IconShield }

export default function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.icon] || IconCheck
        return (
          <div className="toast" key={t.id}>
            <span className="toast__icon"><Icon size={18} /></span>
            {t.message}
          </div>
        )
      })}
    </div>
  )
}
