import { useApp } from '../context/AppContext.jsx'
import { moods } from '../lib/data.js'

/* Dynamic Aura — an animated CSS blob representing aggregated mood.
   `calm` → slow, rounded, cool breathing. `anxious` → fast, sharp, warm. */
export default function Aura({ showControls = true }) {
  const { mood, setMood } = useApp()
  const m = moods[mood] || moods.calm
  const state = m.state // 'calm' | 'anxious'

  return (
    <div className="col" style={{ gap: 'var(--space-5)' }}>
      <div className="aura-stage">
        <div className={`aura ${state}`} role="img" aria-label={`Current mood: ${m.label}`}>
          <div className="aura__blob b1" />
          <div className="aura__blob b2" />
          <div className="aura__blob b3" />
          <div className="aura__core">
            <div className="mood">{m.label}</div>
            <div className="pct">{m.score}% balance</div>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="aura-controls">
          <span className="muted" style={{ alignSelf: 'center', fontSize: '0.82rem', marginRight: 4 }}>
            Simulate mood:
          </span>
          {Object.entries(moods).map(([key, val]) => (
            <button
              key={key}
              className={`mood-pill ${mood === key ? 'active' : ''}`}
              onClick={() => setMood(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
