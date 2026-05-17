import type { CSSProperties, ReactNode } from 'react'

// ── B burst mark ───────────────────────────────────────────────────────────

const C = 200

function polar(angleDeg: number, r: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [C + Math.cos(a) * r, C + Math.sin(a) * r]
}

const STREAKS = [
  { a: 12, len: 178, w: 14 },
  { a: 47, len: 130, w: 10 },
  { a: 86, len: 168, w: 16 },
  { a: 128, len: 96, w: 12 },
  { a: 164, len: 158, w: 13 },
  { a: 208, len: 122, w: 10 },
  { a: 246, len: 178, w: 17 },
  { a: 292, len: 104, w: 11 },
  { a: 326, len: 148, w: 14 },
]

const SPARKS: [number, number, number][] = [
  [88, 100, 7],
  [310, 88, 5],
  [340, 200, 6],
  [302, 322, 7],
  [180, 348, 5],
  [62, 286, 7],
  [70, 178, 4],
  [240, 60, 4],
  [148, 70, 5],
]

export function FestivMark({
  color = '#0A0A0A',
  size = 240,
  style,
}: {
  color?: string
  size?: number
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      style={{ display: 'block', ...style }}
    >
      {STREAKS.map((s, i) => {
        const [x2, y2] = polar(s.a, s.len)
        return (
          <line
            key={i}
            x1={C}
            y1={C}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={s.w}
            strokeLinecap="round"
          />
        )
      })}
      {STREAKS.map((s, i) => {
        const [x, y] = polar(s.a, s.len)
        return (
          <circle key={'c' + i} cx={x} cy={y} r={s.w * 0.55} fill={color} />
        )
      })}
      {SPARKS.map(([x, y, r], i) => (
        <circle key={'s' + i} cx={x} cy={y} r={r} fill={color} />
      ))}
      <circle cx={C} cy={C} r={22} fill={color} />
    </svg>
  )
}

// ── Wordmark ───────────────────────────────────────────────────────────────

export function FestivWordmark({
  color = '#0A0A0A',
  size = 96,
  bangSlot = null,
  style,
}: {
  color?: string
  size?: number
  bangSlot?: ReactNode
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        font: `900 ${size}px/0.95 "Archivo", "Helvetica Neue", system-ui, sans-serif`,
        letterSpacing: '-0.045em',
        color,
        display: 'inline-flex',
        alignItems: 'baseline',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span>Fest</span>
      {bangSlot ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size * 0.42,
            height: size,
          }}
        >
          {bangSlot}
        </span>
      ) : (
        <span>!</span>
      )}
      <span>v.</span>
    </span>
  )
}

// ── Header lockup — wordmark with burst as "!" ─────────────────────────────

export function FestivHeaderLogo({
  color = '#0A0A0A',
  size = 32,
  style,
}: {
  color?: string
  size?: number
  style?: CSSProperties
}) {
  return (
    <FestivWordmark
      color={color}
      size={size}
      bangSlot={<FestivMark color={color} size={size * 0.95} />}
      style={style}
    />
  )
}

// ── Loading screen ─────────────────────────────────────────────────────────

export function FestivLoadingScreen({
  message = '축제 정보를 불러오는 중…',
}: {
  message?: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#F2FF00',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 44,
        color: '#0A0A0A',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 26,
          animation: 'festiv-pulse 1.6s ease-in-out infinite',
        }}
      >
        <FestivMark color="#0A0A0A" size={120} />
        <FestivWordmark color="#0A0A0A" size={92} />
      </div>

      <div
        style={{
          width: 200,
          height: 3,
          background: 'rgba(0,0,0,0.12)',
          borderRadius: 9999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100%',
            background: '#0A0A0A',
            borderRadius: 9999,
            animation: 'festiv-bar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        {message}
      </div>

      <style>{`
        @keyframes festiv-pulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.06); opacity: 0.92; }
        }
        @keyframes festiv-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
