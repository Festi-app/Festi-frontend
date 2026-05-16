import type { CSSProperties, ReactElement, ReactNode } from 'react'

export const DAY_GRADIENT = 'linear-gradient(135deg, #FFD747 0%, #FF9500 100%)'
export const NIGHT_GRADIENT =
  'linear-gradient(135deg, #3B3F8C 0%, #7B5EA7 100%)'

// eslint-disable-next-line react-refresh/only-export-components
export const FESTI_TOKENS = {
  mint: '#A9E5E7',
  mintDeep: '#6FC8CB',
  mintSoft: '#E6F2F3',
  mintWash: '#F1F7F8',
  ink: '#141A1F',
  ink80: '#2E363C',
  ink60: '#5E676D',
  ink40: '#8C949A',
  ink20: '#C8CDD1',
  ink10: '#E6E9EC',
  cream: '#F2F3F4',
  paper: '#FFFFFF',
  coral: '#00C6E0',
  coralSoft: '#CCF4FA',
  pop: '#22C36A',
  popSoft: '#D9F2E2',
  alert: '#FF5A5A',
  alertSoft: '#FFE0E1',
  sun: '#FFD747',
  sunSoft: '#FFF3C2',
  grape: '#9C8BE0',
  grapeSoft: '#E7E1F7',
  leaf: '#7DBE7A',
  leafSoft: '#DDEFDC',
  rose: '#F38AA5',
  roseSoft: '#FCDDE5',
  r: { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 9999 },
  shadow: {
    card: '0 1px 2px rgba(20,26,31,0.04), 0 8px 24px rgba(20,26,31,0.06)',
    pop: '0 8px 32px rgba(20,26,31,0.14)',
    hit: '0 8px 22px rgba(0,198,224,0.4)',
  },
}

export const FESTI_FONT = `'Pretendard', 'Pretendard Variable', -apple-system, system-ui, sans-serif`

export interface ToneTheme {
  bg: string
  surface: string
  surfaceAlt: string
  border: string
  ink: string
  ink80: string
  ink60: string
  ink40: string
  ink20: string
  mint: string
  mintDeep: string
  mintSoft: string
  cta: string
  ctaInk: string
  chip: string
  chipInk: string
}

// eslint-disable-next-line react-refresh/only-export-components
export function tone(): ToneTheme {
  const dark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  return {
    bg: dark ? '#0F1216' : '#F2F3F4',
    surface: dark ? '#1A1E23' : '#FFFFFF',
    surfaceAlt: dark ? '#252A30' : '#F1F7F8',
    border: dark ? '#2F353B' : '#E6E9EC',
    ink: dark ? '#F2F5F7' : '#141A1F',
    ink80: dark ? '#CDD5DA' : '#2E363C',
    ink60: dark ? '#8B939B' : '#5E676D',
    ink40: dark ? '#5F676D' : '#8C949A',
    ink20: dark ? '#3E454D' : '#C8CDD1',
    mint: FESTI_TOKENS.mint,
    mintDeep: FESTI_TOKENS.mintDeep,
    mintSoft: dark ? '#1F3035' : '#E6F2F3',
    cta: FESTI_TOKENS.coral,
    ctaInk: '#FFFFFF',
    chip: dark ? '#252A30' : '#F3F5F6',
    chipInk: dark ? '#F2F5F7' : '#141A1F',
  }
}

// ── Festiter wordmark ──────────────────────────────────────────────
export function FestiterMark({
  size = 22,
  mono = false,
  color,
}: {
  size?: number
  mono?: boolean
  color?: string
}): ReactElement {
  const ink = color ?? FESTI_TOKENS.ink
  const dot = mono ? ink : FESTI_TOKENS.pop
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.28,
        fontFamily: FESTI_FONT,
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
          background: FESTI_TOKENS.mint,
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
      <span>Fest!v.</span>
    </div>
  )
}

// ── Mini icon set (24px, 1.6 stroke) ─────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const I = {
  pin: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
        stroke={c}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.4" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  sun: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <circle cx="12" cy="12" r="4" stroke={c} strokeWidth="1.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <line
          key={d}
          x1="12"
          y1="2.5"
          x2="12"
          y2="5"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${d} 12 12)`}
        />
      ))}
    </svg>
  ),
  moon: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M20 14.5A8 8 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth="1.6" />
      <line
        x1="16"
        y1="16"
        x2="20.5"
        y2="20.5"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15L6 16z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 20.5a2 2 0 004 0"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  home: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M4 11.5L12 4.5l8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  map: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M3 5.5l6-1.5 6 1.5 6-1.5v14l-6 1.5-6-1.5-6 1.5v-14z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line x1="9" y1="4" x2="9" y2="19" stroke={c} strokeWidth="1.6" />
      <line x1="15" y1="5.5" x2="15" y2="20.5" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  ticket: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M3 8.5V6a1 1 0 011-1h16a1 1 0 011 1v2.5a2.5 2.5 0 000 5V16a1 1 0 01-1 1H4a1 1 0 01-1-1v-2.5a2.5 2.5 0 000-5z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="6"
        x2="14"
        y2="16"
        stroke={c}
        strokeWidth="1.6"
        strokeDasharray="2 2"
      />
    </svg>
  ),
  user: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth="1.6" />
      <path
        d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  truck: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <rect
        x="1.5"
        y="7"
        width="12"
        height="9"
        rx="1"
        stroke={c}
        strokeWidth="1.6"
      />
      <path
        d="M13.5 10h4l4 3v3h-8v-6z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="17.5" r="1.6" stroke={c} strokeWidth="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  star: (c = 'currentColor', fill = 'none'): ReactElement => (
    <svg viewBox="0 0 24 24" fill={fill} width="100%" height="100%">
      <path
        d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 20l1-6L3.4 9.9l6-.9L12 3.5z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clock: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 2"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  plus: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  minus: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  chev: (
    c = 'currentColor',
    dir: 'l' | 'r' | 'u' | 'd' = 'r'
  ): ReactElement => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="100%"
      height="100%"
      style={{
        transform:
          dir === 'l'
            ? 'rotate(180deg)'
            : dir === 'u'
              ? 'rotate(-90deg)'
              : dir === 'd'
                ? 'rotate(90deg)'
                : 'none',
      }}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M5 12.5l4.5 4.5L19.5 7"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  call: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 005.5 5.5L14.5 13.5l5 2v3a2 2 0 01-2.2 2C9.5 19.7 4.3 14.5 3.5 6.7 3.4 5.4 4.2 4.4 5 4z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  settings: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.6" />
      <path
        d="M19.4 13.7l1.6 1.3-2 3.4-2-.6a7 7 0 01-2 1.2l-.4 2H10l-.4-2a7 7 0 01-2-1.2l-2 .6-2-3.4 1.6-1.3a7 7 0 010-2.3L3.6 8.6l2-3.4 2 .6a7 7 0 012-1.2l.4-2h4.6l.4 2c.7.3 1.4.7 2 1.2l2-.6 2 3.4-1.6 1.3a7 7 0 010 2.3z"
        stroke={c}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  grid: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <rect
        x="3.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.6"
      />
      <rect
        x="13.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.6"
      />
      <rect
        x="3.5"
        y="13.5"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.6"
      />
      <rect
        x="13.5"
        y="13.5"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.6"
      />
    </svg>
  ),
  list: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <line
        x1="4"
        y1="6.5"
        x2="20"
        y2="6.5"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="17.5"
        x2="20"
        y2="17.5"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  edit: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M4 20h4l11-11-4-4L4 16v4z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 6l4 4" stroke={c} strokeWidth="1.6" />
    </svg>
  ),
  trash: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
      <path
        d="M5 7h14M9 7V4.5h6V7M7 7l1 13h8l1-13"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  dots: (c = 'currentColor'): ReactElement => (
    <svg viewBox="0 0 24 24" fill={c} width="100%" height="100%">
      <circle cx="6" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="18" cy="12" r="1.7" />
    </svg>
  ),
}

// ── Placeholder photo block ───────────────────────────────────────
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
  className,
}: {
  label?: string
  ratio?: string
  tone?: string
  radius?: number
  style?: CSSProperties
  className?: string
}): ReactElement {
  return (
    <div
      className={className}
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

// ── Pill / tag ────────────────────────────────────────────────────
export function Pill({
  children,
  color = FESTI_TOKENS.mintSoft,
  ink = FESTI_TOKENS.ink,
  size = 'sm',
  style = {},
  className,
}: {
  children: ReactNode
  color?: string
  ink?: string
  size?: 'sm' | 'lg'
  style?: CSSProperties
  className?: string
}): ReactElement {
  const sz =
    size === 'lg'
      ? { fontSize: 14, padding: '6px 12px' }
      : { fontSize: 12, padding: '4px 9px' }
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: color,
        color: ink,
        borderRadius: 9999,
        fontFamily: FESTI_FONT,
        fontWeight: 600,
        ...sz,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
