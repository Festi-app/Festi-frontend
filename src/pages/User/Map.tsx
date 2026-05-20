import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DAY_GRADIENT,
  FESTIV_TOKENS,
  I,
  NIGHT_GRADIENT,
  Pill,
} from '../../tokens'
import { StatGrid } from '../../components/User/StatGrid'
import { BoothDetailContent } from './Detail'
import {
  DAY_BOOTHS,
  NIGHT_BOOTHS,
  TRUCK_BOOTHS,
  TRUCK_BOOTH_MENUS,
  DAY_BOOTH_MENUS,
  NIGHT_BOOTH_MENUS,
} from '../../data/booths'
import { MAP_MARKERS } from '../../data/markers'
import soongsilDayMap from '../../assets/soongsil-day-map.png'
import soongsilNightMap from '../../assets/soongsil-night-map.png'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import { FestiTabBar } from '../../components/User/Navbar'
import { ZONES, NIGHT_ZONES } from '../../data/zones'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES]
import { useDayNightStore } from '../../stores/useDayNightStore'
import {
  useBoothSectionStore,
  type BoothCategory,
  type PermDay,
  type PermTime,
} from '../../stores/useBoothSectionStore'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'

type MobileMapView = 'day' | 'night' | 'truck'

const BOOTH_CATEGORY_THEMES: Record<
  BoothCategory,
  { color: string; soft: string }
> = {
  정보: { color: FESTIV_TOKENS.mint, soft: FESTIV_TOKENS.mintSoft },
  체험: { color: FESTIV_TOKENS.grape, soft: FESTIV_TOKENS.grapeSoft },
  마켓: { color: FESTIV_TOKENS.sun, soft: FESTIV_TOKENS.sunSoft },
  활동: { color: FESTIV_TOKENS.pop, soft: FESTIV_TOKENS.popSoft },
}

const BOOTH_CATEGORIES = Object.keys(BOOTH_CATEGORY_THEMES) as BoothCategory[]

function MapSheet({
  children,
  sheetDragY,
  sheetDismissing,
  expanded,
  expandable = true,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleExpand,
}: {
  children: React.ReactNode
  sheetDragY: number
  sheetDismissing: boolean
  expanded: boolean
  expandable?: boolean
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
  onDismiss: () => void
  onToggleExpand: () => void
}) {
  return (
    <div
      className={`absolute flex flex-col bg-surface ${
        expanded
          ? 'inset-x-0 bottom-0 z-40 h-[70%] rounded-t-3xl shadow-[0_-8px_32px_rgba(15,42,51,0.18)]'
          : 'inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border px-4.5 pt-2.5 pb-25 shadow-[0_-8px_32px_rgba(15,42,51,0.18)]'
      }`}
      style={{
        animation:
          sheetDragY > 0
            ? 'none'
            : sheetDismissing
              ? 'festi-sheet-out 0.22s ease both'
              : 'festi-sheet-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => e.stopPropagation()}
    >
      {expanded ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex size-8 items-center justify-center rounded-full bg-surface-alt text-ink"
          >
            <div className="size-4">{I.chev(undefined, 'l')}</div>
          </button>
        </div>
      ) : (
        <div className="mx-auto mb-3 flex h-5 w-full items-center justify-center">
          {expandable ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="h-full w-full flex items-center justify-center"
              aria-label="펼쳐서 상세보기"
            >
              <div className="h-1 w-9 rounded-full bg-ink-20" />
            </button>
          ) : (
            <div className="h-1 w-9 rounded-full bg-ink-20 opacity-30" />
          )}
        </div>
      )}
      <div className={expanded ? 'min-h-0 flex-1' : ''}>{children}</div>
    </div>
  )
}

function BoothPinHeader({
  color,
  badgeText,
  badgeFontSize = 'text-[13px]',
  pill,
  pill2,
  name,
  sub,
}: {
  color: string
  badgeText: React.ReactNode
  badgeFontSize?: string
  pill: { color: string; ink: string; content: React.ReactNode }
  pill2?: { color: string; ink: string; content: React.ReactNode }
  name: string
  sub?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-full ${badgeFontSize} font-extrabold text-white`}
        style={{
          background: color,
          boxShadow: `inset 0 0 0 3px #fff, 0 4px 12px ${color}66`,
        }}
      >
        {badgeText}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          <Pill color={pill.color} ink={pill.ink}>
            {pill.content}
          </Pill>
          {pill2 && (
            <Pill color={pill2.color} ink={pill2.ink}>
              {pill2.content}
            </Pill>
          )}
        </div>
        <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
          {name}
        </div>
        {sub && (
          <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

function WaitingActions({
  onWaiting,
  disabled,
  waitBadge,
}: {
  onWaiting?: () => void
  disabled?: boolean
  waitBadge?: number
}) {
  if (!onWaiting) return null
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onWaiting}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-[20px] bg-cta px-5 py-4 text-left shadow-[0_8px_22px_rgba(0,198,224,0.4)] disabled:opacity-40"
      >
        <div>
          <div className="text-[17px] font-extrabold tracking-[-0.4px] text-cta-ink">
            웨이팅 걸기
          </div>
          {waitBadge !== undefined && (
            <div className="text-[11px] font-semibold text-cta-ink/70">
              현재 {waitBadge === 0 ? '없음' : `${waitBadge}팀`} 대기
            </div>
          )}
        </div>
        <div className="size-4.5">{I.chev('#fff', 'r')}</div>
      </button>
    </div>
  )
}

// ── Screen: Map ───────────────────────────────────────────────────────────────

export function MobileMap({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDay, setIsDay } = useDayNightStore()
  const {
    assignments,
    slotCounts,
    zoneRotations,
    trucks: storeTrucks,
  } = useTruckPlacementStore()
  const { permissions: boothPermissions, zoneDivisions } =
    useBoothSectionStore()
  const [selectedFestivalDay, setSelectedFestivalDay] = useState('2일차')
  const CURRENT_DAY_LABEL = '2일차'
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false)
  const [mapView, setMapView] = useState<MobileMapView>(isDay ? 'day' : 'night')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [selectedSection, setSelectedSection] = useState<{
    zoneId: string
    slot: number
  } | null>(null)
  const [selectedBoothPermId, setSelectedBoothPermId] = useState<string | null>(
    null
  )
  const [selectedBoothCell, setSelectedBoothCell] = useState<{
    zoneId: string
    slot: number
  } | null>(null)
  const [sheetDismissing, setSheetDismissing] = useState(false)
  const [sheetDragY, setSheetDragY] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [sheetExpandable, setSheetExpandable] = useState(true)
  const [listOpen, setListOpen] = useState(() => {
    const s = location.state as { openList?: boolean } | null
    return s?.openList ?? false
  })
  const [listTab, setListTab] = useState<'day' | 'night' | 'truck'>(() => {
    const s = location.state as { tab?: 'day' | 'night' | 'truck' } | null
    return s?.tab ?? 'night'
  })
  const [selectedUserTruck, setSelectedUserTruck] = useState<
    (typeof TRUCK_BOOTHS)[0] | null
  >(null)
  const [listCatFilter, setListCatFilter] = useState<string | null>(null)
  const lastTouchDist = useRef<number | null>(null)
  const lastOffset = useRef({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const sheetDragStart = useRef<number | null>(null)
  const rawSheetDragRef = useRef(0)
  // 데스크탑에서 테스트하기 위해 추가한 마우스 드래그 ref
  const mouseDragStart = useRef<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const MIN_SCALE = 1
  const MAX_SCALE = 3.5
  const selectedDayNumber = Number(selectedFestivalDay[0]) as PermDay
  const activeMapImage =
    mapView === 'day'
      ? soongsilDayMap
      : mapView === 'night'
        ? soongsilNightMap
        : soongsilTruckMap
  const activeMapAspect =
    mapView === 'day'
      ? '1072 / 998'
      : mapView === 'night'
        ? '1430 / 846'
        : '822 / 590'
  const activeMapRatio =
    mapView === 'day'
      ? 998 / 1072
      : mapView === 'night'
        ? 846 / 1430
        : 590 / 822
  const activeBoothZones =
    mapView === 'day' ? ZONES : mapView === 'night' ? NIGHT_ZONES : []
  const activeBoothTime: PermTime = mapView === 'night' ? '야간' : '주간'
  const selectedBoothPerm = selectedBoothPermId
    ? (boothPermissions.find((p) => p.id === selectedBoothPermId) ?? null)
    : null
  const selectedBoothZone = selectedBoothCell
    ? (ALL_BOOTH_ZONES.find((zone) => zone.id === selectedBoothCell.zoneId) ??
      null)
    : null
  const selectedBoothCellPerm = selectedBoothCell
    ? (boothPermissions.find(
        (p) =>
          p.zoneId === selectedBoothCell.zoneId &&
          p.day === selectedDayNumber &&
          p.time === activeBoothTime &&
          p.sections.includes(selectedBoothCell.slot)
      ) ?? null)
    : selectedBoothPerm

  const linkedBooth = useMemo(() => {
    if (!selectedBoothCell) return null
    return (
      (activeBoothTime === '야간' ? NIGHT_BOOTHS : DAY_BOOTHS).find(
        (b) =>
          b.zoneId === selectedBoothCell.zoneId &&
          b.sections?.includes(selectedBoothCell.slot)
      ) ?? null
    )
  }, [selectedBoothCell, activeBoothTime])

  const linkedMenus = useMemo(() => {
    if (!linkedBooth) return []
    return (
      activeBoothTime === '야간' ? NIGHT_BOOTH_MENUS : DAY_BOOTH_MENUS
    ).filter((m) => m.boothId === linkedBooth.id)
  }, [linkedBooth, activeBoothTime])

  const linkedTruckBooth = useMemo(() => {
    if (!selectedSection) return null
    return (
      TRUCK_BOOTHS.find(
        (b) =>
          b.zoneId === selectedSection.zoneId &&
          b.sections?.includes(selectedSection.slot)
      ) ?? null
    )
  }, [selectedSection])

  const linkedTruckMenus = useMemo(
    () =>
      linkedTruckBooth
        ? TRUCK_BOOTH_MENUS.filter((m) => m.boothId === linkedTruckBooth.id)
        : [],
    [linkedTruckBooth]
  )

  function changeMapView(next: MobileMapView) {
    setMapView(next)
    if (next === 'day') setIsDay(true)
    if (next === 'night') setIsDay(false)
    setSelectedId(null)
    setSelectedSection(null)
    setSelectedBoothPermId(null)
    setSelectedBoothCell(null)
    setSheetExpanded(false)
    setListOpen(false)
  }

  // 진입 및 지도 변경 시 이미지가 화면 세로를 최대한 채우는 스케일로 시작
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const imageH = el.clientWidth * activeMapRatio
    setScale(Math.min(MAX_SCALE, el.clientHeight / imageH))
    setOffset({ x: 0, y: 0 })
  }, [activeMapRatio])

  function clampOffset(x: number, y: number, s: number) {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const cw = el.clientWidth
    const ch = el.clientHeight
    const imageH = cw * activeMapRatio

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
    setSheetExpanded(false)
    setSheetDismissing(true)
    setTimeout(() => {
      setSelectedId(null)
      setSelectedSection(null)
      setSelectedBoothPermId(null)
      setSelectedBoothCell(null)
      setSelectedUserTruck(null)
      setSheetDismissing(false)
      setSheetDragY(0)
    }, 220)
  }

  function handleSheetTouchStart(e: TouchEvent) {
    e.stopPropagation()
    sheetDragStart.current = e.touches[0].clientY
    rawSheetDragRef.current = 0
  }

  function handleSheetTouchMove(e: TouchEvent) {
    e.stopPropagation()
    if (sheetDragStart.current === null) return
    const dy = e.touches[0].clientY - sheetDragStart.current
    rawSheetDragRef.current = dy
    if (dy > 0) setSheetDragY(dy)
  }

  function handleSheetTouchEnd(e: TouchEvent) {
    e.stopPropagation()
    const dy = rawSheetDragRef.current
    rawSheetDragRef.current = 0
    if (dy > 60) {
      if (sheetExpanded) {
        setSheetExpanded(false)
      } else {
        dismissSheet()
      }
      setSheetDragY(0)
    } else if (dy < -60 && !sheetExpanded && sheetExpandable) {
      setSheetExpanded(true)
      setSheetDragY(0)
    } else {
      setSheetDragY(0)
    }
    sheetDragStart.current = null
  }

  function openList() {
    if (listOpen) {
      setListOpen(false)
      return
    }
    setSelectedId(null)
    setSelectedSection(null)
    setSelectedBoothCell(null)
    setSelectedBoothPermId(null)
    setSelectedUserTruck(null)
    setSheetExpanded(false)
    setSheetDismissing(false)
    setListTab(
      mapView === 'truck' ? 'truck' : mapView === 'day' ? 'day' : 'night'
    )
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

  // 구역 오버레이용 데이터 (핀 마커 대신 구역 박스로 표시)
  const truckTime = isDay ? '주간' : '야간'
  const allMarkers = useMemo(() => [...MAP_MARKERS], [])

  const selectedMarker =
    selectedId !== null
      ? (allMarkers.find((m) => m.id === selectedId) ?? null)
      : null

  const listMarkersBase = allMarkers.filter((m) => {
    if (listTab === 'day') return m.type === 'day' || m.type === 'special'
    if (listTab === 'night') return m.type === 'night'
    return m.type === 'truck'
  })

  const listMarkers = listCatFilter
    ? listMarkersBase.filter((m) => m.cat === listCatFilter)
    : listMarkersBase

  const typeColor = (type: string) =>
    type === 'truck'
      ? FESTIV_TOKENS.sun
      : type === 'night'
        ? FESTIV_TOKENS.alert
        : type === 'special'
          ? FESTIV_TOKENS.grape
          : FESTIV_TOKENS.pop

  const typePillColors = (type: string): { bg: string; ink: string } => {
    if (type === 'truck')
      return { bg: FESTIV_TOKENS.sunSoft ?? '#FFF5D6', ink: FESTIV_TOKENS.sun }
    if (type === 'night')
      return { bg: FESTIV_TOKENS.alertSoft, ink: FESTIV_TOKENS.alert }
    if (type === 'special')
      return {
        bg: FESTIV_TOKENS.grapeSoft ?? '#EDE7F8',
        ink: FESTIV_TOKENS.grape,
      }
    return { bg: FESTIV_TOKENS.popSoft ?? '#E6FBF5', ink: FESTIV_TOKENS.pop }
  }

  const typeLabel = (type: string) => {
    if (type === 'truck') return '푸드트럭'
    if (type === 'night') return '야간'
    if (type === 'special') return '안내'
    return '주간'
  }

  const waitStatus = (w: number) => {
    if (w === 0) return { color: FESTIV_TOKENS.pop, label: '바로 입장' }
    if (w <= 2) return { color: FESTIV_TOKENS.pop, label: `${w}팀` }
    return { color: FESTIV_TOKENS.alert, label: `${w}팀` }
  }

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allMarkers
    return allMarkers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        String(m.id).includes(q) ||
        m.cat.toLowerCase().includes(q)
    )
  }, [searchQuery, allMarkers])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden overscroll-none bg-[#E8F4F5] font-festi dark:bg-[#0B1A1F]"
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
          setSheetExpanded(false)
          if (
            selectedId !== null ||
            selectedSection !== null ||
            selectedBoothPermId !== null ||
            selectedBoothCell !== null
          )
            dismissSheet()
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
            aspectRatio: activeMapAspect,
          }}
        >
          {/* Map image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${activeMapImage})`,
              backgroundSize: '100% 100%',
              ...(dark
                ? {}
                : { filter: 'brightness(1.05) saturate(0.6)', opacity: 0.75 }),
            }}
          />
          {/* 엣지 페이드 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[8%] bg-[linear-gradient(180deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(180deg,#0B1A1F_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%] bg-[linear-gradient(0deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(0deg,#0B1A1F_0%,transparent_100%)]" />
          {!dark && (
            <div className="pointer-events-none absolute inset-0 bg-[rgba(232,244,245,0.18)]" />
          )}

          {/* 관리자 페이지에서 설정한 주간/야간 부스 섹션 */}
          {mapView !== 'truck' &&
            activeBoothZones.map((zone) => {
              const divisions = zoneDivisions[zone.id] ?? zone.defaultCount
              return (
                <div
                  key={zone.id}
                  className="absolute z-2 flex rounded-sm"
                  style={{
                    left: zone.left,
                    top: zone.top,
                    width: zone.width,
                    height: zone.height,
                    flexDirection: zone.dir,
                    background: zone.color,
                    border: '1.5px solid rgba(20,26,31,0.22)',
                  }}
                >
                  {Array.from({ length: divisions }, (_, idx) => {
                    const perm = boothPermissions.find(
                      (p) =>
                        p.zoneId === zone.id &&
                        p.day === selectedDayNumber &&
                        p.time === activeBoothTime &&
                        p.sections.includes(idx)
                    )
                    const selected =
                      selectedBoothCell?.zoneId === zone.id &&
                      selectedBoothCell.slot === idx
                    const isLast = idx === divisions - 1
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBoothCell({ zoneId: zone.id, slot: idx })
                          setSelectedBoothPermId(perm?.id ?? null)
                          setSelectedId(null)
                          setSelectedSection(null)
                          setSheetExpanded(false)
                          setSheetExpandable(!!perm)
                          setListOpen(false)
                        }}
                        className="relative flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[7px] font-extrabold transition-[background,box-shadow,opacity]"
                        style={{
                          background: perm ? perm.color : 'transparent',
                          color: FESTIV_TOKENS.ink,
                          boxShadow: selected
                            ? 'inset 0 0 0 2px rgba(255,255,255,0.95), 0 0 0 1px rgba(20,26,31,0.2)'
                            : undefined,
                          ...(isLast
                            ? {}
                            : zone.dir === 'row'
                              ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                              : {
                                  borderBottom: '1px solid rgba(20,26,31,0.18)',
                                }),
                        }}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              )
            })}

          {/* 푸드트럭 구역 오버레이 — 관리자가 설정한 섹션 그대로 표시 */}
          {mapView === 'truck' &&
            TRUCK_ZONES.map((zone) => {
              const count = slotCounts[zone.id] ?? zone.slotCount
              const rotate = zoneRotations[zone.id] ?? zone.rotate
              return (
                <div
                  key={zone.id}
                  className="absolute flex"
                  style={{
                    left: zone.left,
                    top: zone.top,
                    width: zone.width,
                    height: zone.height,
                    flexDirection: zone.dir === 'row' ? 'row' : 'column',
                    background: zone.color,
                    border: `1.5px solid rgba(20,26,31,0.22)`,
                    borderRadius: '2px',
                    transform: `rotate(${rotate}deg)`,
                    transformOrigin: 'center',
                    zIndex: 2,
                  }}
                >
                  {Array.from({ length: count }, (_, idx) => {
                    const truckId =
                      assignments[`${truckTime}:${zone.id}:${idx}`]
                    const truck = truckId
                      ? storeTrucks.find((t) => t.id === truckId)
                      : null
                    const selSlot =
                      selectedSection?.zoneId === zone.id &&
                      selectedSection?.slot === idx
                    const isLast = idx === count - 1
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSection({ zoneId: zone.id, slot: idx })
                          setSelectedId(null)
                          setSelectedBoothCell(null)
                          setSelectedBoothPermId(null)
                          setSheetExpanded(false)
                          setSheetExpandable(!!truck)
                          setListOpen(false)
                        }}
                        className="flex min-h-0 min-w-0 flex-1 select-none items-center justify-center font-extrabold"
                        style={{
                          fontSize: '7px',
                          background: selSlot
                            ? zone.color
                            : truck
                              ? zone.color + 'CC'
                              : 'transparent',
                          color: FESTIV_TOKENS.ink,
                          boxShadow: selSlot
                            ? 'inset 0 0 0 2px rgba(255,255,255,0.9)'
                            : undefined,
                          ...(isLast
                            ? {}
                            : zone.dir === 'row'
                              ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                              : {
                                  borderBottom: '1px solid rgba(20,26,31,0.18)',
                                }),
                        }}
                      >
                        {truck ? truck.name.slice(0, 3) : idx + 1}
                      </button>
                    )
                  })}
                </div>
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
      <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0)_100%)] px-4 pt-5 pb-2 dark:bg-[linear-gradient(180deg,rgba(11,26,31,0.97)_0%,rgba(11,26,31,0)_100%)]">
        <div className="mb-2 flex items-center gap-2.5">
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
              {
                id: 'day',
                label: '주간',
                ico: I.sun,
                grad: DAY_GRADIENT,
              },
              {
                id: 'night',
                label: '야간',
                ico: I.moon,
                grad: NIGHT_GRADIENT,
              },
              {
                id: 'truck',
                label: '푸드트럭',
                ico: I.truck,
                grad: FESTIV_TOKENS.sun,
              },
            ].map((o) => {
              const on = o.id === mapView
              return (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => changeMapView(o.id as MobileMapView)}
                  className={`flex items-center gap-1.25 rounded-full px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                    on ? 'text-white' : 'text-ink-60'
                  }`}
                  style={on ? { background: o.grad } : undefined}
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
              className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-white/80 px-3 py-2 text-[13px] font-bold tracking-[-0.2px] text-ink shadow-[0_1px_8px_rgba(20,26,31,0.10)] backdrop-blur-sm dark:border-white/30 dark:bg-white/15 dark:text-white"
            >
              {selectedFestivalDay}
              {selectedFestivalDay === CURRENT_DAY_LABEL && (
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: FESTIV_TOKENS.pop }}
                />
              )}
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
              <div className="absolute left-0 top-full z-50 mt-1.5 min-w-24 overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_4px_20px_rgba(20,26,31,0.15)] dark:bg-[#13262D]">
                {['1일차', '2일차', '3일차'].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setSelectedFestivalDay(d)
                      setDayDropdownOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-bold tracking-[-0.2px] ${
                      selectedFestivalDay === d ? 'text-ink' : 'text-ink-60'
                    }`}
                  >
                    {d}
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          d === CURRENT_DAY_LABEL
                            ? FESTIV_TOKENS.pop
                            : 'transparent',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 주간 부스 유형 범례 */}
      {selectedId === null &&
        selectedSection === null &&
        selectedBoothPermId === null &&
        selectedBoothCell === null &&
        mapView === 'day' &&
        !listOpen && (
          <div className="absolute inset-x-0 bottom-25 z-10 flex justify-center px-4">
            <div className="flex items-center gap-3 rounded-full bg-white/65 px-3 py-1.5 text-ink-80 shadow-[0_1px_6px_rgba(20,26,31,0.08)] backdrop-blur-sm dark:bg-[#13262D]/65">
              {BOOTH_CATEGORIES.map((category) => {
                const theme = BOOTH_CATEGORY_THEMES[category]
                return (
                  <div
                    key={category}
                    className="flex items-center gap-1 text-[11px] font-bold tracking-[-0.2px]"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: theme.color }}
                    />
                    {category}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* Bottom sheet - selected user truck */}
      {(selectedUserTruck !== null ||
        (sheetDismissing &&
          selectedId === null &&
          selectedSection === null &&
          selectedBoothCell === null)) &&
        selectedUserTruck &&
        (() => {
          const truckZoneEntry = Object.entries(assignments).find(
            ([key, id]) =>
              key.startsWith(truckTime + ':') &&
              id === String(selectedUserTruck.id)
          )
          const truckAreaFromStore = truckZoneEntry
            ? (() => {
                const [, zoneId, slotStr] = truckZoneEntry[0].split(':')
                const zone = TRUCK_ZONES.find((z) => z.id === zoneId)
                return zone
                  ? `${zone.name} ${Number(slotStr) + 1}번`
                  : undefined
              })()
            : undefined
          const truckArea = truckAreaFromStore ?? selectedUserTruck.section
          return (
            <MapSheet
              sheetDragY={sheetDragY}
              sheetDismissing={sheetDismissing}
              expanded={sheetExpanded}
              onTouchStart={handleSheetTouchStart}
              onTouchMove={handleSheetTouchMove}
              onTouchEnd={handleSheetTouchEnd}
              onDismiss={dismissSheet}
              onToggleExpand={() => setSheetExpanded((v) => !v)}
            >
              {!sheetExpanded && (
                <>
                  <BoothPinHeader
                    color={FESTIV_TOKENS.sun}
                    badgeText={selectedUserTruck.id}
                    badgeFontSize="text-[15px]"
                    pill={{
                      color: FESTIV_TOKENS.sunSoft ?? '#FFF5D6',
                      ink: FESTIV_TOKENS.sun,
                      content: '푸드트럭',
                    }}
                    pill2={
                      truckArea
                        ? {
                            color: '#F1F7F8',
                            ink: '#2E363C',
                            content: truckArea,
                          }
                        : undefined
                    }
                    name={selectedUserTruck.name}
                    sub={selectedUserTruck.desc}
                  />
                  <StatGrid
                    className="mt-3"
                    stats={[
                      { label: '운영 날짜', value: '전일 운영' },
                      { label: '운영 시간', value: selectedUserTruck.hours },
                    ]}
                  />
                </>
              )}
              {sheetExpanded && (
                <div className="relative h-full overflow-hidden">
                  <div className="h-full overflow-y-auto overscroll-none px-5 pt-4 pb-27.5">
                    <BoothDetailContent
                      type="truck"
                      name={selectedUserTruck.name}
                      id={selectedUserTruck.id}
                      hours={selectedUserTruck.hours}
                      desc={selectedUserTruck.desc}
                      area={truckArea}
                      menus={TRUCK_BOOTH_MENUS.filter(
                        (m) => m.boothId === selectedUserTruck.id
                      )}
                    />
                  </div>
                </div>
              )}
            </MapSheet>
          )
        })()}

      {/* Bottom sheet - selected zone section */}
      {(selectedSection !== null || (sheetDismissing && selectedId === null)) &&
        (() => {
          const zone = TRUCK_ZONES.find((z) => z.id === selectedSection?.zoneId)
          const truckId = selectedSection
            ? assignments[
                `${truckTime}:${selectedSection.zoneId}:${selectedSection.slot}`
              ]
            : null
          const truck = truckId
            ? storeTrucks.find((t) => t.id === truckId)
            : null
          if (!zone && !sheetDismissing) return null
          return (
            <MapSheet
              sheetDragY={sheetDragY}
              sheetDismissing={sheetDismissing}
              expanded={sheetExpanded}
              expandable={!!(truck || linkedTruckBooth)}
              onTouchStart={handleSheetTouchStart}
              onTouchMove={handleSheetTouchMove}
              onTouchEnd={handleSheetTouchEnd}
              onDismiss={dismissSheet}
              onToggleExpand={() =>
                sheetExpanded ? setSheetExpanded(false) : setSheetExpanded(true)
              }
            >
              {zone && (
                <>
                  {!sheetExpanded && (
                    <>
                      <BoothPinHeader
                        color={zone.color}
                        badgeText={
                          selectedSection ? selectedSection.slot + 1 : '—'
                        }
                        pill={{
                          color: zone.color + '22',
                          ink: zone.color,
                          content: `푸드트럭 · ${zone.name}`,
                        }}
                        name={
                          truck?.name ??
                          linkedTruckBooth?.name ??
                          '비어있는 섹션'
                        }
                      />
                      {!truck && !linkedTruckBooth && (
                        <div className="mt-3 rounded-xl bg-surface-alt px-4 py-3 text-center text-[12px] text-ink-40">
                          이 섹션에 배정된 푸드트럭이 없어요
                        </div>
                      )}
                    </>
                  )}
                  {sheetExpanded && linkedTruckBooth && (
                    <div className="relative h-full overflow-hidden">
                      <div className="h-full overflow-y-auto overscroll-none px-5 pt-4 pb-27.5">
                        <BoothDetailContent
                          type="truck"
                          name={truck?.name ?? linkedTruckBooth.name}
                          id={linkedTruckBooth.id}
                          hours={linkedTruckBooth.hours}
                          desc={linkedTruckBooth.desc}
                          area={zone.name}
                          menus={linkedTruckMenus}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </MapSheet>
          )
        })()}

      {/* Bottom sheet - selected admin booth section */}
      {(selectedBoothCell !== null || sheetDismissing) && selectedBoothZone && (
        <MapSheet
          sheetDragY={sheetDragY}
          sheetDismissing={sheetDismissing}
          expanded={sheetExpanded}
          expandable={!!(selectedBoothCellPerm || linkedBooth)}
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onDismiss={dismissSheet}
          onToggleExpand={() => setSheetExpanded((v) => !v)}
        >
          {!sheetExpanded && (
            <>
              <BoothPinHeader
                color={selectedBoothCellPerm?.color ?? selectedBoothZone.color}
                badgeText={selectedBoothCell ? selectedBoothCell.slot + 1 : '—'}
                pill={{
                  color:
                    (selectedBoothCellPerm?.color ?? selectedBoothZone.color) +
                    '22',
                  ink: selectedBoothCellPerm?.color ?? selectedBoothZone.color,
                  content: `${selectedDayNumber}일차 · ${activeBoothTime} · ${selectedBoothZone.name}`,
                }}
                name={
                  selectedBoothCellPerm?.orgName ??
                  linkedBooth?.name ??
                  '비어있는 섹션'
                }
                sub={
                  selectedBoothCellPerm ? (
                    <>
                      {selectedBoothCell
                        ? `${selectedBoothCell.slot + 1}번 섹션`
                        : '섹션'}
                      {` · ${selectedBoothCellPerm.category}`}
                    </>
                  ) : linkedBooth ? (
                    <>
                      {selectedBoothCell
                        ? `${selectedBoothCell.slot + 1}번 섹션`
                        : '섹션'}
                    </>
                  ) : undefined
                }
              />
              {!selectedBoothCellPerm && !linkedBooth && (
                <div className="mt-3 rounded-xl bg-surface-alt px-4 py-3 text-center text-[12px] text-ink-40">
                  이 섹션에 배정된 부스가 없어요
                </div>
              )}
              <WaitingActions
                onWaiting={
                  mapView === 'night' && selectedBoothCellPerm
                    ? () =>
                        navigate(
                          `/waiting/register?id=${selectedBoothCellPerm.id}`
                        )
                    : undefined
                }
                disabled={!selectedBoothCellPerm}
              />
            </>
          )}
          {sheetExpanded && (selectedBoothCellPerm || linkedBooth) && (
            <div className="relative h-full overflow-hidden">
              <div className="h-full overflow-y-auto overscroll-none px-5 pt-4 pb-27.5">
                {linkedBooth ? (
                  <BoothDetailContent
                    type={activeBoothTime === '야간' ? 'night' : 'day'}
                    name={linkedBooth.name}
                    id={linkedBooth.id}
                    cat={linkedBooth.cat}
                    hours={linkedBooth.hours}
                    desc={linkedBooth.desc}
                    area={selectedBoothZone.name}
                    menus={linkedMenus}
                  />
                ) : selectedBoothCellPerm ? (
                  <div className="pt-4 text-center text-[13px] text-ink-40">
                    <div className="mb-1 text-[15px] font-bold text-ink">
                      {selectedBoothCellPerm.orgName}
                    </div>
                    <div>
                      {selectedBoothCellPerm.category} ·{' '}
                      {selectedBoothZone.name}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </MapSheet>
      )}

      {/* Bottom sheet - selected booth */}
      {(selectedId !== null || sheetDismissing) && selectedMarker && (
        <MapSheet
          sheetDragY={sheetDragY}
          sheetDismissing={sheetDismissing}
          expanded={sheetExpanded}
          expandable
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onDismiss={dismissSheet}
          onToggleExpand={() => setSheetExpanded((v) => !v)}
        >
          {/* ── 미확장: 컴팩트 카드 ── */}
          {!sheetExpanded && (
            <>
              <>
                <BoothPinHeader
                  color={typeColor(selectedMarker.type)}
                  badgeText={selectedMarker.id}
                  badgeFontSize="text-[15px]"
                  pill={{
                    color: typePillColors(selectedMarker.type).bg,
                    ink: typePillColors(selectedMarker.type).ink,
                    content: typeLabel(selectedMarker.type),
                  }}
                  pill2={{
                    color:
                      BOOTH_CATEGORY_THEMES[selectedMarker.cat as BoothCategory]
                        ?.soft ?? '#F1F7F8',
                    ink: '#141A1F',
                    content: selectedMarker.cat,
                  }}
                  name={selectedMarker.name}
                  sub={selectedMarker.desc}
                />
                <StatGrid
                  className="mt-3"
                  stats={[
                    { label: '운영 날짜', value: '전일 운영' },
                    { label: '운영 시간', value: selectedMarker.hours ?? '—' },
                  ]}
                />
                {selectedMarker.type === 'night' && (
                  <WaitingActions
                    onWaiting={() =>
                      navigate(`/waiting/register?id=${selectedMarker.id}`)
                    }
                    waitBadge={selectedMarker.wait}
                  />
                )}
              </>
            </>
          )}

          {/* ── 확장: 상세 페이지 레이아웃 ── */}
          {sheetExpanded && (
            <div className="relative h-full overflow-hidden">
              {/* 스크롤 바디 */}
              <div
                className={`h-full overflow-y-auto overscroll-none px-5 pt-4 ${selectedMarker.type === 'night' ? 'pb-44' : 'pb-28'}`}
              >
                <BoothDetailContent
                  dark={dark}
                  name={selectedMarker.name}
                  cat={selectedMarker.cat}
                  id={selectedMarker.id}
                  wait={selectedMarker.wait}
                  type={selectedMarker.type}
                  hours={selectedMarker.hours}
                  desc={selectedMarker.desc}
                  menus={
                    selectedMarker.type === 'night'
                      ? NIGHT_BOOTH_MENUS.filter(
                          (m) => m.boothId === selectedMarker.id
                        )
                      : DAY_BOOTH_MENUS.filter(
                          (m) => m.boothId === selectedMarker.id
                        )
                  }
                  catPill={
                    selectedMarker.type !== 'night' &&
                    BOOTH_CATEGORY_THEMES[selectedMarker.cat as BoothCategory]
                      ? {
                          color:
                            BOOTH_CATEGORY_THEMES[
                              selectedMarker.cat as BoothCategory
                            ].soft,
                          ink: '#141A1F',
                        }
                      : undefined
                  }
                />
              </div>

              {/* 스티키 CTA - 야간만 */}
              {selectedMarker.type === 'night' && (
                <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,var(--color-surface)_35%)] px-5 pt-3 pb-24">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/waiting/register?id=${selectedMarker.id}`)
                    }
                    className="flex w-full items-center justify-between rounded-[20px] bg-cta px-5 py-4 text-left shadow-[0_8px_22px_rgba(0,198,224,0.4)]"
                  >
                    <div>
                      <div className="text-[17px] font-extrabold tracking-[-0.4px] text-cta-ink">
                        웨이팅 걸기
                      </div>
                      <div className="text-[11px] font-semibold text-cta-ink/70">
                        현재 {selectedMarker.wait}팀 대기
                      </div>
                    </div>
                    <div className="size-4.5">{I.chev('#fff', 'r')}</div>
                  </button>
                </div>
              )}
            </div>
          )}
        </MapSheet>
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
                  { id: 'day', label: '주간', color: FESTIV_TOKENS.pop },
                  { id: 'night', label: '야간', color: FESTIV_TOKENS.alert },
                  { id: 'truck', label: '푸드트럭', color: FESTIV_TOKENS.sun },
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

            {/* Category filter chips — 주간만, 고정 4종 */}
            {listTab === 'day' && (
              <div className="px-4 pb-2.5">
                <div className="inline-flex items-center gap-0.5 rounded-full bg-white/65 px-1.5 py-1.5 shadow-[0_1px_6px_rgba(20,26,31,0.08)] backdrop-blur-sm dark:bg-[#13262D]/65">
                  <button
                    type="button"
                    onClick={() => setListCatFilter(null)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-[-0.2px] transition-colors ${
                      listCatFilter === null
                        ? 'bg-ink text-white dark:bg-white dark:text-ink'
                        : 'text-ink-60'
                    }`}
                  >
                    전체
                  </button>
                  {BOOTH_CATEGORIES.map((cat) => {
                    const theme = BOOTH_CATEGORY_THEMES[cat]
                    const active = listCatFilter === cat
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setListCatFilter(cat)}
                        className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-[-0.2px] transition-colors"
                        style={
                          active
                            ? { background: theme.color, color: '#141A1F' }
                            : { color: '#5E676D' }
                        }
                      >
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{ background: theme.color }}
                        />
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* List */}
            <div className="relative min-h-0 flex-1">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-[linear-gradient(180deg,transparent_0%,var(--color-surface)_100%)]" />
              <div className="h-full overflow-y-auto overscroll-none px-4 pb-27.5">
                {listTab === 'truck' ? (
                  <div className="flex flex-col divide-y divide-border">
                    {TRUCK_BOOTHS.map((truck) => (
                      <button
                        key={truck.id}
                        type="button"
                        onClick={() => {
                          setListOpen(false)
                          setSelectedUserTruck(truck)
                          setSelectedId(null)
                          setSelectedSection(null)
                          setSelectedBoothCell(null)
                          setSelectedBoothPermId(null)
                          setSheetExpanded(false)
                        }}
                        className="flex w-full items-center gap-3 py-3.5 text-left"
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                          style={{ background: FESTIV_TOKENS.sun }}
                        >
                          {truck.id}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                            {truck.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-60">
                            {truck.hours}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : listMarkers.length === 0 ? (
                  <div className="py-10 text-center text-sm text-ink-40">
                    부스가 없습니다
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-border">
                    {listMarkers.map((m) => {
                      const pinColor = typeColor(m.type)
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setListOpen(false)
                            setSelectedId(m.id)
                            setSelectedSection(null)
                            setSelectedBoothCell(null)
                            setSelectedBoothPermId(null)
                            setSheetExpanded(false)
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
                            <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                              {m.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-ink-60">
                              {m.cat}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
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

            <div className="mt-3 max-h-72 overflow-y-auto overscroll-none">
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
                          setSelectedSection(null)
                          setSelectedBoothCell(null)
                          setSelectedBoothPermId(null)
                          setSheetExpanded(false)
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
