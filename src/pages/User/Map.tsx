import { useEffect, useRef, useState } from 'react'
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
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false)
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sheetDismissing, setSheetDismissing] = useState(false)
  const [sheetDragY, setSheetDragY] = useState(0)
  const [listOpen, setListOpen] = useState(false)
  const [listTab, setListTab] = useState<'day' | 'night' | 'truck'>('night')
  const [listCatFilter, setListCatFilter] = useState<string | null>(null)
  const lastTouchDist = useRef<number | null>(null)
  const lastOffset = useRef({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const sheetDragStart = useRef<number | null>(null)
  // 데스크탑에서 테스트하기 위해 추가한 마우스 드래그 ref
  const mouseDragStart = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const MIN_SCALE = 1
  const MAX_SCALE = 3.5

  // 진입 시 이미지가 화면 세로를 꽉 채우는 스케일로 시작
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const imageH = el.clientWidth * (998 / 1072)
    setScale(Math.min(MAX_SCALE, el.clientHeight / imageH))
  }, [])

  function clampOffset(x: number, y: number, s: number) {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const cw = el.clientWidth
    const ch = el.clientHeight
    const imageH = cw * (998 / 1072)

    // 좌우: 이미지 범위 내에서만 이동
    const maxX = Math.max(0, ((s - 1) * cw) / 2)

    // 상하: 이미지 위/아래 여백이 화면의 30% 이상 보이지 않도록
    const maxY = Math.max(0, (imageH * s) / 2 - ch * 0.2)

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
    } else if (e.touches.length === 1 && scale > MIN_SCALE) {
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
    } else if (
      e.touches.length === 1 &&
      dragStart.current &&
      scale > MIN_SCALE
    ) {
      const nx = e.touches[0].clientX - dragStart.current.x
      const ny = e.touches[0].clientY - dragStart.current.y
      setOffset(clampOffset(nx, ny, scale))
    }
  }

  function handleTouchEnd() {
    lastTouchDist.current = null
    setIsPinching(false)
    dragStart.current = null
    if (scale < MIN_SCALE * 1.05) {
      setScale(MIN_SCALE)
      setOffset({ x: 0, y: 0 })
    }
  }

  function zoom(delta: number) {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta))
    const clamped = clampOffset(offset.x, offset.y, next)
    setScale(next)
    setOffset(clamped)
  }

  function dismissSheet() {
    setSheetDismissing(true)
    setTimeout(() => {
      setSelectedId(null)
      setSheetDismissing(false)
      setSheetDragY(0)
    }, 220)
  }

  function handleSheetTouchStart(e: TouchEvent) {
    e.stopPropagation()
    sheetDragStart.current = e.touches[0].clientY
  }

  function handleSheetTouchMove(e: TouchEvent) {
    e.stopPropagation()
    if (sheetDragStart.current === null) return
    const dy = e.touches[0].clientY - sheetDragStart.current
    if (dy > 0) setSheetDragY(dy)
  }

  function handleSheetTouchEnd(e: TouchEvent) {
    e.stopPropagation()
    if (sheetDragY > 60) {
      dismissSheet()
    } else {
      setSheetDragY(0)
    }
    sheetDragStart.current = null
  }

  function openList() {
    setListTab(isDay ? 'day' : 'night')
    setListCatFilter(null)
    setListOpen(true)
  }

  // 데스크탑에서 테스트하기 위해 추가한 마우스 드래그 핸들러
  function handleMouseDown(e: React.MouseEvent) {
    if (scale <= MIN_SCALE) return
    mouseDragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!mouseDragStart.current) return
    const nx = e.clientX - mouseDragStart.current.x
    const ny = e.clientY - mouseDragStart.current.y
    setOffset(clampOffset(nx, ny, scale))
  }

  function handleMouseUp() {
    mouseDragStart.current = null
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

  const selectedMarker =
    selectedId !== null
      ? (markers.find((m) => m.id === selectedId) ?? null)
      : null

  const listMarkersBase = markers.filter((m) => {
    if (listTab === 'day') return m.type === 'day' || m.type === 'special'
    if (listTab === 'night') return m.type === 'night'
    return m.type === 'truck'
  })

  const listCategories = [...new Set(listMarkersBase.map((m) => m.cat))]

  const listMarkers = listCatFilter
    ? listMarkersBase.filter((m) => m.cat === listCatFilter)
    : listMarkersBase

  const typeColor = (type: string) =>
    type === 'truck'
      ? FESTI_TOKENS.sun
      : type === 'night'
        ? FESTI_TOKENS.alert
        : type === 'special'
          ? FESTI_TOKENS.grape
          : FESTI_TOKENS.pop

  const typePillColors = (type: string): { bg: string; ink: string } => {
    if (type === 'truck')
      return { bg: FESTI_TOKENS.sunSoft ?? '#FFF5D6', ink: FESTI_TOKENS.sun }
    if (type === 'night')
      return { bg: FESTI_TOKENS.alertSoft, ink: FESTI_TOKENS.alert }
    if (type === 'special')
      return {
        bg: FESTI_TOKENS.grapeSoft ?? '#EDE7F8',
        ink: FESTI_TOKENS.grape,
      }
    return { bg: FESTI_TOKENS.popSoft ?? '#E6FBF5', ink: FESTI_TOKENS.pop }
  }

  const typeLabel = (type: string) => {
    if (type === 'truck') return '푸드트럭'
    if (type === 'night') return '야간'
    if (type === 'special') return '안내'
    return '주간'
  }

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
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#E8F4F5] font-festi dark:bg-[#0B1A1F]"
    >
      {/* Zoomable map layer */}
      <div
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => {
          if (selectedId !== null) dismissSheet()
        }}
        style={{
          transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          transformOrigin: 'center center',
          transition: isPinching ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* 이미지 + 마커를 같은 컨테이너에 배치 — x%, y%가 이미지 좌표에 직접 대응 */}
        <div
          className="absolute inset-x-0"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            aspectRatio: '1072 / 998',
          }}
        >
          {/* Map image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${soongsilDayMap})`,
              backgroundSize: '100% 100%',
              filter: 'brightness(1.05) saturate(0.6)',
              opacity: 0.75,
            }}
          />
          {/* 엣지 페이드 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[8%] bg-[linear-gradient(180deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(180deg,#0B1A1F_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%] bg-[linear-gradient(0deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(0deg,#0B1A1F_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(232,244,245,0.18)] dark:bg-[rgba(11,26,31,0.22)]" />

          {/* Markers — left/top % 이 이미지 좌표와 1:1 대응 */}
          {markers.map((m) => {
            const inTimeRange =
              (isDay &&
                (m.type === 'day' ||
                  m.type === 'truck' ||
                  m.type === 'special')) ||
              (!isDay &&
                (m.type === 'night' ||
                  m.type === 'truck' ||
                  m.type === 'special'))
            if (!inTimeRange || hiddenTypes.has(m.type)) return null

            const isSel = m.id === selectedId
            const pinColor = typeColor(m.type)
            const numColor =
              m.type === 'night' || m.type === 'truck' || m.type === 'day'
                ? '#fff'
                : FESTI_TOKENS.ink
            const ws = waitStatus(m.wait)

            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className="absolute"
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  zIndex: isSel ? 5 : 1,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* 줌과 무관하게 마커 크기를 고정하는 역보정 래퍼 */}
                <div
                  className="flex flex-col items-center gap-1"
                  style={{
                    transform: `scale(${1 / scale})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div
                    className="relative flex shrink-0 items-center justify-center rounded-full font-extrabold tracking-[-0.3px]"
                    style={{
                      width: isSel ? 40 : 32,
                      height: isSel ? 40 : 32,
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
                  {isSel && (
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
      <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0)_100%)] px-4 pt-13.5 pb-2 dark:bg-[linear-gradient(180deg,rgba(11,26,31,0.97)_0%,rgba(11,26,31,0)_100%)]">
        <div className="mt-1 mb-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex flex-1 items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-left shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-white/5"
          >
            <div className="size-4.5 text-ink-60">{I.search()}</div>
            <div className="text-sm font-medium text-ink-60">
              부스 번호 또는 이름
            </div>
          </button>
          <button
            type="button"
            onClick={() => openList()}
            className="flex size-11 items-center justify-center rounded-full bg-cta text-cta-ink shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]"
          >
            <div className="size-5">{I.list()}</div>
          </button>
        </div>

        {/* Row 1: Day/Night toggle + 일차 필터칩 */}
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
          {/* 일차 필터칩 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDayDropdownOpen((v) => !v)}
              className="flex items-center gap-1 whitespace-nowrap rounded-full border border-cta bg-cta px-3 py-2 text-[13px] font-bold tracking-[-0.2px] text-cta-ink"
            >
              {selectedFestivalDay}
              <svg
                viewBox="0 0 12 12"
                width="12"
                height="12"
                fill="none"
                style={{
                  transform: dayDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {dayDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1.5 overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_4px_20px_rgba(20,26,31,0.15)] dark:bg-[#13262D]">
                {['1일차', '2일차', '3일차'].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setSelectedFestivalDay(d)
                      setDayDropdownOpen(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-[13px] font-bold tracking-[-0.2px] ${
                      selectedFestivalDay === d ? 'text-cta' : 'text-ink'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 타입 필터칩 — 하단 센터 플로팅 */}
      {selectedId === null && !listOpen && (
        <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center gap-1.5 px-4">
          {(isDay
            ? [
                { type: 'day', label: '주간 부스', color: FESTI_TOKENS.pop },
                { type: 'truck', label: '푸드트럭', color: FESTI_TOKENS.sun },
                {
                  type: 'special',
                  label: '안내·본부',
                  color: FESTI_TOKENS.grape,
                },
              ]
            : [
                {
                  type: 'night',
                  label: '야간 주점',
                  color: FESTI_TOKENS.alert,
                },
                { type: 'truck', label: '푸드트럭', color: FESTI_TOKENS.sun },
                {
                  type: 'special',
                  label: '안내·본부',
                  color: FESTI_TOKENS.grape,
                },
              ]
          ).map(({ type, label, color }) => {
            const hidden = hiddenTypes.has(type)
            return (
              <button
                type="button"
                key={type}
                onClick={() =>
                  setHiddenTypes((prev) => {
                    const next = new Set(prev)
                    if (next.has(type)) next.delete(type)
                    else next.add(type)
                    return next
                  })
                }
                className={`flex items-center gap-1.25 rounded-full border px-3 py-2 text-[13px] font-bold tracking-[-0.2px] backdrop-blur-sm ${
                  hidden
                    ? 'border-border bg-white/70 text-ink-40 dark:bg-[#0B1A1F]/70'
                    : 'border-border bg-white/95 text-ink-80 shadow-[0_2px_12px_rgba(20,26,31,0.12)] dark:bg-[#13262D]/95'
                }`}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: hidden ? '#D3DBDE' : color }}
                />
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Bottom sheet - selected booth */}
      {(selectedId !== null || sheetDismissing) && selectedMarker && (
        <div
          className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface px-4.5 pt-2.5 pb-25 shadow-[0_-8px_32px_rgba(15,42,51,0.18)]"
          style={{
            animation:
              sheetDragY > 0
                ? 'none'
                : sheetDismissing
                  ? 'festi-sheet-out 0.22s ease both'
                  : 'festi-sheet-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
            transform:
              sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
            transition: sheetDragY > 0 ? 'none' : undefined,
          }}
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
        >
          <button
            type="button"
            onClick={dismissSheet}
            className="mx-auto mb-3 block h-1 w-9 rounded-full bg-ink-20"
            aria-label="닫기"
          />
          <div className="flex items-center gap-2.75">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
              style={{
                background: typeColor(selectedMarker.type),
                boxShadow: `inset 0 0 0 3px #fff, 0 4px 12px ${typeColor(selectedMarker.type)}66`,
              }}
            >
              {selectedMarker.id}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1.25">
                <Pill
                  color={typePillColors(selectedMarker.type).bg}
                  ink={typePillColors(selectedMarker.type).ink}
                  style={{ fontSize: 10 }}
                >
                  {typeLabel(selectedMarker.type)} · {selectedMarker.cat}
                </Pill>
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-extrabold tracking-[-0.3px] text-ink">
                {selectedMarker.name}
              </div>
            </div>
          </div>

          {selectedMarker.type !== 'truck' && (
            <div className="mt-2.5 flex gap-1.5 rounded-xl bg-surface-alt p-2">
              <Stat
                label="대기"
                value={
                  selectedMarker.wait === 0
                    ? '없음'
                    : `${selectedMarker.wait}팀`
                }
                color={waitStatus(selectedMarker.wait).color}
                dark={dark}
              />
              <div className="w-px bg-border" />
              <Stat
                label="예상"
                value={
                  selectedMarker.wait === 0
                    ? '바로입장'
                    : `${selectedMarker.wait * 3}분`
                }
                dark={dark}
              />
              <div className="w-px bg-border" />
            </div>
          )}

          <div className="mt-2.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/booth')}
              className="flex-1 rounded-[14px] border border-border bg-surface-alt p-3 text-center text-[13px] font-bold text-ink"
            >
              상세보기
            </button>
            {selectedMarker.type !== 'truck' && (
              <button
                type="button"
                onClick={() => navigate('/waiting/register')}
                className="flex flex-2 items-center justify-center gap-1.5 rounded-[14px] bg-cta p-3 text-center text-sm font-extrabold tracking-[-0.3px] text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]"
              >
                웨이팅 걸기
                {selectedMarker.wait > 0 && (
                  <span className="rounded-full bg-alert px-1.75 py-0.5 text-[11px] font-extrabold text-white">
                    {selectedMarker.wait}팀
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Booth list overlay */}
      {listOpen && (
        <>
          <div
            className="absolute inset-0 z-20 bg-[rgba(0,0,0,0.4)]"
            style={{ animation: 'festi-fade-in 0.18s ease both' }}
            onClick={() => setListOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl bg-surface shadow-[0_-8px_32px_rgba(15,42,51,0.18)]"
            style={{
              animation:
                'festi-sheet-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
              height: '72vh',
            }}
          >
            <div className="pt-2.5">
              <button
                type="button"
                onClick={() => setListOpen(false)}
                className="mx-auto block h-1 w-9 rounded-full bg-ink-20"
                aria-label="닫기"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 px-4 pt-3 pb-2">
              {(
                [
                  { id: 'day', label: '주간', color: FESTI_TOKENS.pop },
                  { id: 'night', label: '야간', color: FESTI_TOKENS.alert },
                  { id: 'truck', label: '푸드트럭', color: FESTI_TOKENS.sun },
                ] as const
              ).map((tab) => {
                const on = listTab === tab.id
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => {
                      setListTab(tab.id)
                      setListCatFilter(null)
                    }}
                    className={`rounded-full border px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                      on
                        ? 'border-transparent text-white'
                        : 'border-border bg-surface-alt text-ink-60'
                    }`}
                    style={on ? { background: tab.color } : undefined}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Category filter chips */}
            {listCategories.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none]">
                <button
                  type="button"
                  onClick={() => setListCatFilter(null)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold tracking-[-0.2px] ${
                    listCatFilter === null
                      ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                      : 'border-border bg-surface-alt text-ink-60'
                  }`}
                >
                  전체
                </button>
                {listCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setListCatFilter(cat)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold tracking-[-0.2px] ${
                      listCatFilter === cat
                        ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                        : 'border-border bg-surface-alt text-ink-60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-27.5">
              {listMarkers.length === 0 ? (
                <div className="py-10 text-center text-sm text-ink-40">
                  부스가 없습니다
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {listMarkers.map((m) => {
                    const ws = waitStatus(m.wait)
                    const pinColor = typeColor(m.type)
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setListOpen(false)
                          setSelectedId(m.id)
                        }}
                        className="flex items-center gap-3 py-3.5 text-left"
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                          style={{ background: pinColor }}
                        >
                          {m.id}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                              {m.name}
                            </span>
                            {m.hot && (
                              <span className="rounded bg-alert px-1.25 py-px text-[8px] font-extrabold tracking-[0.3px] text-white">
                                HOT
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-60">
                            {m.cat}
                          </div>
                        </div>
                        {m.type !== 'truck' && (
                          <div className="flex items-center gap-1">
                            <span
                              className="size-1.5 rounded-full"
                              style={{ background: ws.color }}
                            />
                            <span
                              className="text-[13px] font-extrabold"
                              style={{ color: ws.color }}
                            >
                              {ws.label}
                            </span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
                          setSelectedId(m.id)
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
        @keyframes festi-sheet-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes festi-sheet-out {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        @keyframes festi-pulse {
          0%   { transform: scale(0.7); opacity: 0.55; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
