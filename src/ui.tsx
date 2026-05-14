import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { SPOT_TOKENS, SPOT_FONT } from './tokens'

// ── Spotter wordmark ──────────────────────────────────────────────────────────

export function SpotterMark({
  size = 22,
  mono = false,
  color,
}: {
  size?: number
  mono?: boolean
  color?: string
}): ReactElement {
  const ink = color ?? SPOT_TOKENS.ink
  const dot = mono ? ink : SPOT_TOKENS.pop
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.28,
        fontFamily: SPOT_FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -0.6,
        color: ink,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: size * 0.95,
          height: size * 0.95,
          borderRadius: '50%',
          background: SPOT_TOKENS.mint,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: '50%',
            background: dot,
          }}
        />
      </span>
      <span>spotter</span>
    </div>
  )
}

// ── Placeholder photo block ───────────────────────────────────────────────────

const PHOTO_BG: Record<string, string> = {
  mint: '#D6EEEF',
  coral: '#F6E2DB',
  sun: '#F6ECC2',
  grape: '#E2DDF0',
  leaf: '#DCEADC',
  rose: '#F2D9DF',
  ink: '#DEE3E6',
}

export function PhotoSlot({
  label = '',
  ratio = '4/3',
  tone: t = 'mint',
  radius = 16,
  style = {},
}: {
  label?: string
  ratio?: string
  tone?: string
  radius?: number
  style?: CSSProperties
}): ReactElement {
  return (
    <div
      style={{
        aspectRatio: ratio,
        width: '100%',
        borderRadius: radius,
        background: PHOTO_BG[t] ?? '#E6E9EC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 11,
        color: 'rgba(20,26,31,0.4)',
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {label}
    </div>
  )
}

// ── Pill / tag ────────────────────────────────────────────────────────────────

export function Pill({
  children,
  color = SPOT_TOKENS.mintSoft,
  ink = SPOT_TOKENS.ink,
  size = 'sm',
  style = {},
}: {
  children: ReactNode
  color?: string
  ink?: string
  size?: 'sm' | 'lg'
  style?: CSSProperties
}): ReactElement {
  const sz =
    size === 'lg'
      ? { fontSize: 14, padding: '6px 12px' }
      : { fontSize: 12, padding: '4px 9px' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: color,
        color: ink,
        borderRadius: 9999,
        fontFamily: SPOT_FONT,
        fontWeight: 600,
        ...sz,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
