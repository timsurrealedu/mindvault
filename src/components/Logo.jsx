/* MindVault brand logo — a thought-cloud cradling a sleeping pixel cat.
   Imported from the Claude Design project "Journal app logo design"
   (Logo.dc.html + PixelCat.dc.html) and reimplemented as a self-contained,
   scalable React component.

   The mark is THEME-AWARE: every colour is drawn from the active theme's CSS
   variables (see themes.css), so it recolours live the instant the theme
   switches — One Dark blues, Gruvbox earth tones, Material brights — with no
   JS. (SVG fill/stroke are applied via `style`, not presentation attributes,
   because only the CSS-property form resolves var().)

   Variants:
     - "badge" (default): cat-cloud on a --primary rounded square (app-icon
       lockup). Best for small spots like the sidebar.
     - "mark": cat-cloud on transparent (the primary lockup).
     - "mono": single-colour outline cloud + silhouette cat (defaults to
       --text-strong; override with the `color` prop). */

const CLOUD_PATH =
  'M44,138 C12,138 8,99 38,93 C26,60 64,44 84,64 C94,34 138,34 150,62 C178,46 210,68 194,96 C218,102 212,138 180,138 Z'

// 16x10 "curled sleeping cat" sprite. . = transparent, O/E = outline,
// B = body, L = light belly/paws, P = pink nose.
const CAT_ROWS = [
  '...O........O...',
  '..OBO......OBO..',
  '..OBBOOOOOOBBO..',
  '.OBBBBBBBBBBBBO.',
  'OBBBBBBBBBBBBBBO',
  'OBEEBBBBBBBPBBBO',
  'OBBBBBBBBBBBBBBO',
  'OBLLBBBBBBBBLLBO',
  '.OBLLLLLLLLLLBO.',
  '..OOOOOOOOOOOO..',
]
const CAT_W = 16
const CAT_H = 10

// Theme-driven palette. Values are CSS-variable references resolved live.
const THEMED_CAT = {
  outline: 'var(--text-strong)',
  body: 'var(--accent)',
  light: 'var(--primary)',
  pink: 'var(--danger)',
}

function CatSprite({ cell, colors }) {
  const map = { O: colors.outline, E: colors.outline, B: colors.body, L: colors.light, P: colors.pink }
  const rects = []
  CAT_ROWS.forEach((row, y) => {
    for (let x = 0; x < CAT_W; x++) {
      const fill = map[row[x]]
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} style={{ fill }} />)
    }
  })
  return (
    <svg
      width={CAT_W * cell}
      height={CAT_H * cell}
      viewBox={`0 0 ${CAT_W * cell} ${CAT_H * cell}`}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
    >
      {rects}
    </svg>
  )
}

// Cloud + cat composite. cloudW drives every other dimension proportionally.
function Composite({ cloudW, strokeVB, catRatio, cloudFill, cloudStroke, catColors }) {
  const cloudH = (cloudW * 172) / 220
  const catW = cloudW * catRatio
  return (
    <div style={{ position: 'relative', width: cloudW, height: cloudH }}>
      <svg
        viewBox="0 0 220 172"
        width={cloudW}
        height={cloudH}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
      >
        <path
          d={CLOUD_PATH}
          strokeWidth={strokeVB}
          strokeLinejoin="round"
          style={{ fill: cloudFill, stroke: cloudStroke }}
        />
      </svg>
      <div style={{ position: 'absolute', left: '50%', bottom: cloudH * 0.12, transform: 'translateX(-50%)' }}>
        <CatSprite cell={catW / CAT_W} colors={catColors} />
      </div>
    </div>
  )
}

export default function Logo({ size = 38, variant = 'badge', color, title = 'MindVault logo', className, ...rest }) {
  if (variant === 'mono') {
    const c = color || 'var(--text-strong)'
    return (
      <span className={className} role="img" aria-label={title} {...rest}>
        <Composite cloudW={size} strokeVB={5} catRatio={100 / 180} cloudFill="none" cloudStroke={c}
          catColors={{ body: c, light: c, outline: c, pink: c }} />
      </span>
    )
  }

  if (variant === 'mark') {
    return (
      <span className={className} role="img" aria-label={title} {...rest}>
        <Composite cloudW={size} strokeVB={5} catRatio={160 / 300} cloudFill="var(--surface)" cloudStroke="var(--border)"
          catColors={THEMED_CAT} />
      </span>
    )
  }

  // badge (default)
  return (
    <span
      className={className}
      role="img"
      aria-label={title}
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: size * 0.22,
        background: 'var(--primary)',
        boxShadow: `inset 0 ${-Math.max(2, size * 0.03)}px 0 rgba(0,0,0,.12)`,
        display: 'grid',
        placeItems: 'center',
      }}
      {...rest}
    >
      <Composite cloudW={size * 0.74} strokeVB={6} catRatio={100 / 150} cloudFill="var(--surface)" cloudStroke="var(--border)"
        catColors={THEMED_CAT} />
    </span>
  )
}
