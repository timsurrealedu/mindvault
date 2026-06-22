import { useEffect } from 'react'
import { IconClose } from './Icons.jsx'

export default function Modal({ children, onClose, className = '', width }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className={`modal ${className}`}
        style={{ position: 'relative', width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {onClose && (
          <button className="icon-btn modal__close" onClick={onClose} aria-label="Close">
            <IconClose size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
