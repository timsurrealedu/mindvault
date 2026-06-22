import { useEffect, useState } from 'react'

/* Pure-CSS confetti burst. Mount with a unique `fireKey` to trigger a new
   burst; pieces clean themselves up after the animation. */
const COLORS = ['#61afef', '#98c379', '#c678dd', '#e5c07b', '#e06c75', '#fabd2f']

export default function Confetti({ fireKey }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (fireKey == null) return
    const burst = Array.from({ length: 90 }, (_, i) => ({
      id: `${fireKey}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      dur: 1.8 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.6,
    }))
    setPieces(burst)
    const t = setTimeout(() => setPieces([]), 3600)
    return () => clearTimeout(t)
  }, [fireKey])

  if (!pieces.length) return null

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            '--cf-dur': `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}
