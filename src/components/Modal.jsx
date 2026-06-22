import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from './Icons.jsx'

export default function Modal({ children, onClose, className = '', width }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Portal to <body> so the fixed backdrop covers the whole viewport. Pages
  // render inside `.view`, which holds a persistent `transform` (its entrance
  // animation uses fill-mode: both) — that makes it the containing block for
  // any `position: fixed` child, which would otherwise clip the blur to the
  // centred content column and break it on mobile.
  return createPortal(
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
    </div>,
    document.body
  )
}
