import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import { IconPalette, IconCheck } from './Icons.jsx'

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        title="Change theme"
      >
        <IconPalette size={19} />
      </button>

      {open && (
        <div
          className="card card--pad"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 260,
            zIndex: 50,
            padding: 'var(--space-3)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="eyebrow" style={{ padding: '4px 8px 8px' }}>Theme</div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false) }}
              className="nav__item"
              style={{ justifyContent: 'space-between' }}
            >
              <span className="row" style={{ gap: 10 }}>
                <span style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {t.swatch.map((c) => (
                    <span key={c} style={{ width: 14, height: 22, background: c }} />
                  ))}
                </span>
                <span className="col" style={{ lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{t.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{t.hint}</span>
                </span>
              </span>
              {theme === t.id && <IconCheck size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
