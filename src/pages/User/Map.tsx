import { useRef, useState } from 'react'
import type { ReactElement, TouchEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, I, Pill } from '../../tokens'

import soongsilDayMap from '../../assets/soongsil-day-map.png'
import { FestiTabBar } from '../../components/User/Navbar'
import { useDayNightStore } from '../../stores/useDayNightStore'

// ── Stat cell ─────────────────────────────────────────────────────────────────

export function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon?: ReactElement
  color?: string
  dark?: boolean
}) {
  return (
    <div className="flex-1 text-center">
      <div className="mb-0.5 text-[10px] font-semibold text-ink-60">
        {label}
      </div>
      <div
        className="flex items-center justify-center gap-1 text-[15px] font-extrabold tracking-[-0.3px] text-ink"
        style={color ? { color } : undefined}
      >
        {icon && <div className="size-3.25">{icon}</div>}
        {value}
      </div>
    </div>
  )
}

// ── Screen: Map ───────────────────────────────────────────────────────────────

export function MobileMap({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { isDay, setIsDay } = useDayNightStore()
  const [selectedFestivalDay, setSelectedFestivalDay] = useState('2일차')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const lastTouchDist = useRef<number | null>(null)
  const lastOffset = useRef({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)

  const MIN_SCALE = 1
  const MAX_SCALE = 3.5

  function clampOffset(x: number, y: number, s: number) {
    const maxX = (s - 1) * 50
    const maxY = (s - 1) * 50
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.hypot(dx, dy)
      setIsPinching(true)
      lastOffset.current = offset
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      }
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, scale * (dist / lastTouchDist.current))
      )
      lastTouchDist.current = dist
      const clamped = clampOffset(offset.x, offset.y, next)
      setScale(next)
      setOffset(clamped)
    } else if (e.touches.length === 1 && dragStart.current && scale > 1) {
      const nx = e.touches[0].clientX - dragStart.current.x
      const ny = e.touches[0].clientY - dragStart.current.y
      setOffset(clampOffset(nx, ny, scale))
    }
  }

  function handleTouchEnd() {
    lastTouchDist.current = null
    setIsPinching(false)
    dragStart.current = null
    if (scale < 1.05) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
    }
  }

  function zoom(delta: number) {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta))
    const clamped = clampOffset(offset.x, offset.y, next)
    setScale(next)
    setOffset(clamped)
  }

  const markers = [
    {
      id: 6,
      x: 47,
      y: 32,
      type: 'day',
      name: '학생회 굿즈샵',
      wait: 0,
      cat: '판매',
    },
    {
      id: 8,
      x: 55,
      y: 32,
      type: 'day',
      name: '플리마켓',
      wait: 1,
      cat: '판매',
    },
    {
      id: 12,
      x: 73,
      y: 32,
      type: 'day',
      name: '타로 카페',
      wait: 3,
      cat: '체험',
    },
    {
      id: 77,
      x: 25,
      y: 41,
      type: 'special',
      name: '본부 부스',
      wait: 0,
      cat: '안내',
    },
    {
      id: 16,
      x: 32,
      y: 43,
      type: 'night',
      name: '컴공 칵테일바',
      wait: 7,
      cat: '주점',
      hot: true,
    },
    {
      id: 22,
      x: 53,
      y: 43,
      type: 'night',
      name: '의약학부 주점',
      wait: 5,
      cat: '주점',
    },
    {
      id: 73,
      x: 22,
      y: 56,
      type: 'night',
      name: '국문과 술집',
      wait: 4,
      cat: '주점',
    },
    {
      id: 47,
      x: 85,
      y: 55,
      type: 'night',
      name: '미디어 라멘',
      wait: 5,
      cat: '면류',
    },
    {
      id: 38,
      x: 75,
      y: 60,
      type: 'night',
      name: '체대 곱창',
      wait: 3,
      cat: '야식',
    },
    {
      id: 53,
      x: 85,
      y: 69,
      type: 'night',
      name: '아랍어 비빔',
      wait: 2,
      cat: '식사',
    },
    {
      id: 70,
      x: 27,
      y: 83,
      type: 'truck',
      name: '훈제 통삼겹',
      wait: 4,
      cat: '트럭',
      hot: true,
    },
    {
      id: 67,
      x: 41,
      y: 83,
      type: 'truck',
      name: '청춘 만두',
      wait: 0,
      cat: '트럭',
    },
    {
      id: 64,
      x: 55,
      y: 83,
      type: 'truck',
      name: '도쿄 타코야끼',
      wait: 2,
      cat: '트럭',
    },
  ]

  const selectedId = 16

  const typeColor = (type: string) =>
    type === 'truck'
      ? FESTI_TOKENS.sun
      : type === 'night'
        ? FESTI_TOKENS.alert
        : type === 'special'
          ? FESTI_TOKENS.grape
          : FESTI_TOKENS.pop

  const waitStatus = (w: number) => {
    if (w === 0) return { color: FESTI_TOKENS.pop, label: '바로 입장' }
    if (w <= 2) return { color: FESTI_TOKENS.pop, label: `${w}팀` }
    return { color: FESTI_TOKENS.alert, label: `${w}팀` }
  }

  const searchResults = markers.filter((m) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      String(m.id).includes(q) ||
      m.cat.toLowerCase().includes(q)
    )
  })

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E8F4F5] font-festi dark:bg-[#0B1A1F]">
      {/* Zoomable map layer */}
      <div
        className="absolute inset-0 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          transformOrigin: 'center center',
          transition: isPinching ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Map image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${soongsilDayMap})`,
            filter: dark
              ? 'brightness(0.45) saturate(0.5)'
              : 'brightness(1.05) saturate(0.6)',
            opacity: dark ? 0.9 : 0.7,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.55)_100%)] dark:bg-[linear-gradient(180deg,rgba(11,26,31,0.35)_0%,rgba(11,26,31,0.55)_100%)]" />

        {/* Markers layer */}
        <div className="absolute top-44.5 right-0 bottom-57.5 left-0">
          {markers.map((m) => {
            const visible =
              (isDay &&
                (m.type === 'day' ||
                  m.type === 'truck' ||
                  m.type === 'special')) ||
              (!isDay &&
                (m.type === 'night' ||
                  m.type === 'truck' ||
                  m.type === 'special'))
            if (!visible) return null

            const isSel = m.id === selectedId && !isDay
            const pinColor = typeColor(m.type)
            const numColor =
              m.type === 'night' || m.type === 'truck' || m.type === 'day'
                ? '#fff'
                : FESTI_TOKENS.ink
            const labelRight = m.x < 50
            const ws = waitStatus(m.wait)

            return (
              <button
                type="button"
                key={m.id}
                onClick={() => navigate('/booth')}
                className="absolute flex translate-x-[-50%] items-center gap-1.25"
                style={{
                  left: `${m.x}%`,
                  top: `${m.y - 35}%`,
                  flexDirection: labelRight ? 'row' : 'row-reverse',
                  zIndex: isSel ? 5 : 1,
                }}
              >
                <div
                  className="relative flex shrink-0 items-center justify-center rounded-full font-extrabold tracking-[-0.3px]"
                  style={{
                    width: isSel ? 32 : 26,
                    height: isSel ? 32 : 26,
                    background: pinColor,
                    color: numColor,
                    fontSize: isSel ? 13 : 11,
                    boxShadow: isSel
                      ? 'inset 0 0 0 3px #fff, 0 6px 18px rgba(20,26,31,0.35)'
                      : 'inset 0 0 0 2px #fff, 0 2px 8px rgba(20,26,31,0.25)',
                  }}
                >
                  {m.id}
                  {isSel && (
                    <div
                      className="absolute -inset-2 -z-1 animate-[festi-pulse_2s_ease-out_infinite] rounded-full opacity-25"
                      style={{ background: pinColor }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.25 whitespace-nowrap rounded-[9px] border border-[rgba(20,26,31,0.08)] bg-white px-2 py-1.25 text-[11px] font-bold tracking-[-0.2px] text-ink shadow-[0_3px_10px_rgba(20,26,31,0.18)] dark:border-white/10 dark:bg-[#1B3239]">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: ws.color }}
                  />
                  {m.name}
                  <span
                    className="text-[10px] font-extrabold"
                    style={{ color: ws.color }}
                  >
                    {ws.label}
                  </span>
                  {m.hot && (
                    <span className="rounded bg-alert px-1 py-px text-[8px] font-extrabold tracking-[0.3px] text-white">
                      HOT
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {/* end zoomable layer */}

      {/* Zoom buttons */}
      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoom(0.5)}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-white/95 text-[20px] font-bold text-ink shadow-[0_2px_8px_rgba(20,26,31,0.15)] dark:bg-[#13262D]/95"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoom(-0.5)}
          disabled={scale <= MIN_SCALE}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-white/95 text-[20px] font-bold text-ink shadow-[0_2px_8px_rgba(20,26,31,0.15)] disabled:opacity-35 dark:bg-[#13262D]/95"
        >
          −
        </button>
      </div>

      {/* Top header */}
      <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0)_100%)] px-4 pt-13.5 pb-3.5 dark:bg-[linear-gradient(180deg,rgba(11,26,31,0.97)_0%,rgba(11,26,31,0)_100%)]">
        <div className="mt-1.5 mb-2.5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex flex-1 items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2.5 text-left shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-white/5"
          >
            <div className="size-4.5 text-ink-60">{I.search()}</div>
            <div className="text-sm font-medium text-ink-60">
              부스 번호 또는 이름
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/trucks')}
            className="flex size-11 items-center justify-center rounded-full bg-cta text-cta-ink shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]"
          >
            <div className="size-5">{I.list()}</div>
          </button>
        </div>

        {/* Day/Night + day-N chips */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-white p-0.75 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-[#13262D]/95">
            {[
              { id: 'day', label: '주간', ico: I.sun, color: FESTI_TOKENS.pop },
              {
                id: 'night',
                label: '야간',
                ico: I.moon,
                color: FESTI_TOKENS.alert,
              },
            ].map((o) => {
              const on = (o.id === 'day') === isDay
              return (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setIsDay(o.id === 'day')}
                  className={`flex items-center gap-1.25 rounded-full px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                    on ? 'text-white' : 'text-ink-60'
                  }`}
                  style={on ? { background: o.color } : undefined}
                >
                  <div className="size-3.5">{o.ico()}</div>
                  {o.label}
                </button>
              )
            })}
          </div>
          <div className="flex flex-1 gap-1.5 overflow-x-auto">
            {['2일차', '1일차', '3일차'].map((d) => (
              <button
                type="button"
                onClick={() => setSelectedFestivalDay(d)}
                key={d}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                  selectedFestivalDay === d
                    ? 'border-cta bg-cta text-cta-ink'
                    : 'border-border bg-white/85 text-ink-80 dark:bg-white/5'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compact legend */}
      <div className="absolute top-40 right-3 z-5 flex flex-col gap-1.25 rounded-xl border border-border bg-white/95 px-2.5 py-2 text-[11px] font-bold text-ink-80 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] backdrop-blur-md dark:bg-[#13262D]/95">
        {[
          isDay
            ? { c: FESTI_TOKENS.pop, l: '주간 부스' }
            : { c: FESTI_TOKENS.alert, l: '야간 주점' },
          { c: FESTI_TOKENS.sun, l: '푸드트럭' },
          { c: FESTI_TOKENS.grape, l: '안내·본부' },
        ].map((x) => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div
              className="size-2.25 rounded-full shadow-[inset_0_0_0_1.5px_#fff]"
              style={{ background: x.c }}
            />
            {x.l}
          </div>
        ))}
        <div className="mt-px border-t border-border pt-1.25 text-[10px] font-semibold text-ink-60">
          <div className="mb-0.75 flex items-center gap-1.25">
            <span className="size-1.5 rounded-full bg-pop" />
            여유 / 0-2팀
          </div>
          <div className="flex items-center gap-1.25">
            <span className="size-1.5 rounded-full bg-alert" />
            대기 / 3팀+
          </div>
        </div>
      </div>

      {/* Bottom sheet - selected booth */}
      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface px-4.5 pt-2.5 pb-25 shadow-[0_-8px_32px_rgba(15,42,51,0.18)]">
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-ink-20" />
        <div className="flex items-center gap-2.75">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-alert text-[15px] font-extrabold text-white shadow-[inset_0_0_0_3px_#fff,0_4px_12px_rgba(255,90,90,0.4)]">
            16
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.25">
              <Pill
                color={FESTI_TOKENS.alertSoft}
                ink={FESTI_TOKENS.alert}
                style={{ fontSize: 10 }}
              >
                야간 · 주점
              </Pill>
              <span className="text-[10px] font-semibold text-ink-60">
                베어드홀 동측
              </span>
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-extrabold tracking-[-0.3px] text-ink">
              컴공과 칵테일 바
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex gap-1.5 rounded-xl bg-surface-alt p-2">
          <Stat
            label="대기"
            value="7팀"
            color={FESTI_TOKENS.alert}
            dark={dark}
          />
          <div className="w-px bg-border" />
          <Stat label="예상" value="22분" dark={dark} />
          <div className="w-px bg-border" />
        </div>

        <div className="mt-2.5 flex gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/booth')}
            className="flex-1 rounded-[14px] border border-border bg-surface-alt p-3 text-center text-[13px] font-bold text-ink"
          >
            상세보기
          </button>
          <button
            type="button"
            onClick={() => navigate('/waiting/register')}
            className="flex flex-2 items-center justify-center gap-1.5 rounded-[14px] bg-cta p-3 text-center text-sm font-extrabold tracking-[-0.3px] text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]"
          >
            웨이팅 걸기
            <span className="rounded-full bg-alert px-1.75 py-0.5 text-[11px] font-extrabold text-white">
              7팀
            </span>
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div
            className="absolute inset-0 z-30 bg-[rgba(0,0,0,0.4)]"
            style={{ animation: 'festi-fade-in 0.18s ease both' }}
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          />
          <div
            className="absolute inset-x-0 top-0 z-40 bg-surface px-4 pt-13.5 pb-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            style={{
              animation:
                'festi-page-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
            }}
          >
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface-alt px-3.5 py-2.5">
                <div className="size-4.5 text-ink-60">{I.search()}</div>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="부스 번호 또는 이름"
                  className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="size-4 text-ink-40"
                  >
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="text-sm font-bold text-ink-60"
              >
                취소
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink-40">
                  검색 결과가 없습니다
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {searchResults.map((m) => {
                    const ws = waitStatus(m.wait)
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery('')
                          navigate('/booth')
                        }}
                        className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-colors hover:bg-surface-alt active:bg-surface-alt"
                      >
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                          style={{ background: typeColor(m.type) }}
                        >
                          {m.id}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                            {m.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-60">
                            {m.cat}
                          </div>
                        </div>
                        <div
                          className="text-[13px] font-extrabold"
                          style={{ color: ws.color }}
                        >
                          {ws.label}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <FestiTabBar active="map" dark={dark} />

      <style>{`
        @keyframes festi-pulse {
          0%   { transform: scale(0.7); opacity: 0.55; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
