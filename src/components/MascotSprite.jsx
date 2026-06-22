import { getMascot } from '../lib/mascots.js'

/* Renders a mascot's 16x16 pixel map as crisp SVG rects. `px` controls the
   pixel size; `className` lets callers attach idle/reaction animations. */
export default function MascotSprite({ id, px = 4, className = '', style }) {
  const m = getMascot(id)
  const rects = []
  m.sprite.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x]
      if (c !== '0' && m.colors[c]) {
        rects.push(<rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={m.colors[c]} />)
      }
    }
  })
  return (
    <svg
      className={className}
      style={style}
      width={16 * px}
      height={16 * px}
      viewBox={`0 0 ${16 * px} ${16 * px}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={m.name}
    >
      {rects}
    </svg>
  )
}
