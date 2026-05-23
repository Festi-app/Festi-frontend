import { useMemo, useState } from 'react'
import { tabBarPb, tabBarPbTall } from '../../lib/safeArea'
import { useNavigate, useLocation } from 'react-router-dom'
import { FESTIV_TOKENS } from '../../tokens'
import { waitingRegisterUrl } from '../../constants/routes'
import { StatGrid } from '../../components/User/StatGrid'

import { useLocations } from '../../features/Map/hooks/useLocations'
import type { GetLocationsResponseDto } from '../../features/Map/types/LocationsResponseDto'
import type {
  BoothSummary,
  BoothType as ApiBoothType,
} from '../../types/common'
import soongsilDayMap from '../../assets/soongsil-day-map.png'
import soongsilNightMap from '../../assets/soongsil-night-map.png'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { CancelToast } from '../../components/User/CancelToast'
import { MapSheet } from '../../components/User/Map/MapSheet'
import { BoothPinHeader } from '../../components/User/Map/BoothPinHeader'
import { WaitingActions } from '../../components/User/Map/WaitingActions'
import { MapZoomControls } from '../../components/User/Map/MapZoomControls'
import {
  MapTopHeader,
  type MapView,
} from '../../components/User/Map/MapTopHeader'
import { MapLegend } from '../../components/User/Map/MapLegend'
import { MapBoothListOverlay } from '../../components/User/Map/MapBoothListOverlay'
import { MapSearchOverlay } from '../../components/User/Map/MapSearchOverlay'
import {
  useMapGesture,
  MIN_SCALE,
} from '../../features/Map/hooks/useMapGesture'
import { useSheetDrag } from '../../features/Map/hooks/useSheetDrag'
import { ZONES, NIGHT_ZONES, getZoneName } from '../../data/zones'
import { useDayNightStore } from '../../stores/useDayNightStore'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'
import { useWaitingStore } from '../../stores/useWaitingStore'
import { BoothDetailContent } from '../../components/User/BoothDetailContent'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

type UserMapView = MapView

const FESTIVAL_DAY_DATES: Record<string, string> = {
  '1일차': '2026-05-22',
  '2일차': '2026-05-23',
  '3일차': '2026-05-24',
}

const MAPVIEW_TO_API_TYPE: Record<string, ApiBoothType> = {
  day: 'DAY',
  night: 'NIGHT',
  truck: 'FOOD_TRUCK',
}

const API_CAT_TO_KR: Record<string, string> = {
  ACTIVITY: '활동',
  INFO: '정보',
  MARKET: '마켓',
  EXPERIENCE: '체험',
  PROMOTION: '프로모션',
  ALCOHOL: '주류',
}

const CAT_COLOR_MAP: Record<string, string> = {
  ACTIVITY: FESTIV_TOKENS.pop,
  INFO: FESTIV_TOKENS.mint,
  MARKET: FESTIV_TOKENS.sun,
  EXPERIENCE: FESTIV_TOKENS.grape,
  PROMOTION: FESTIV_TOKENS.coral,
  ALCOHOL: FESTIV_TOKENS.alert,
}

// ── Screen: Map ───────────────────────────────────────────────────────────────

export function UserMap({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDay, setIsDay } = useDayNightStore()
  const { zoneRotations } = useTruckPlacementStore()
  const { waitings, cancelWaiting } = useWaitingStore()
  const [selectedFestivalDay, setSelectedFestivalDay] = useState('2일차')
  const CURRENT_DAY_LABEL = '2일차'
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false)
  const [mapView, setMapView] = useState<UserMapView>(isDay ? 'day' : 'night')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<{
    zoneId: string
    slot: number
  } | null>(null)
  const [selectedBoothCell, setSelectedBoothCell] = useState<{
    zoneId: string
    slot: number
  } | null>(null)
  const [selectedUserTruck, setSelectedUserTruck] =
    useState<BoothSummary | null>(null)
  const [listOpen, setListOpen] = useState(() => {
    const s = location.state as { openList?: boolean } | null
    return s?.openList ?? false
  })
  const [listTab, setListTab] = useState<'day' | 'night' | 'truck'>(() => {
    const s = location.state as { tab?: 'day' | 'night' | 'truck' } | null
    return s?.tab ?? 'night'
  })
  const [listCatFilter, setListCatFilter] = useState<string | null>(null)
  const [cancelBoothId, setCancelBoothId] = useState<string | null>(null)
  const [showCancelToast, setShowCancelToast] = useState(false)

  const currentApiDay =
    FESTIVAL_DAY_DATES[selectedFestivalDay] ?? FESTIVAL_DAY_DATES['2일차']
  const { data: locations = [] } = useLocations({
    day: currentApiDay,
    type: MAPVIEW_TO_API_TYPE[mapView],
  })

  const locationsByZone = useMemo(() => {
    const map: Record<string, GetLocationsResponseDto[]> = {}
    for (const loc of locations) {
      const zoneChar = loc.zoneLabel.charAt(0)
      if (!map[zoneChar]) map[zoneChar] = []
      map[zoneChar].push(loc)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.index - b.index)
    }
    return map
  }, [locations])

  const activeMapRatio =
    mapView === 'day'
      ? 998 / 1072
      : mapView === 'night'
        ? 846 / 1430
        : 590 / 822

  const {
    containerRef,
    scale,
    setScale,
    offset,
    setOffset,
    isPinching,
    pendingPanRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoom,
  } = useMapGesture({ activeMapRatio })

  const {
    sheetDismissing,
    setSheetDismissing,
    sheetDragY,
    sheetExpanded,
    setSheetExpanded,
    setSheetExpandable,
    dismissSheet,
    handleSheetTouchStart,
    handleSheetTouchMove,
    handleSheetTouchEnd,
  } = useSheetDrag({
    onDismissed: () => {
      setSelectedId(null)
      setSelectedSection(null)
      setSelectedBoothCell(null)
      setSelectedUserTruck(null)
    },
  })

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
  const activeBoothZones =
    mapView === 'day' ? ZONES : mapView === 'night' ? NIGHT_ZONES : []

  const selectedBoothZone = selectedBoothCell
    ? (ALL_BOOTH_ZONES.find((zone) => zone.id === selectedBoothCell.zoneId) ??
      null)
    : null

  const linkedBooth = useMemo((): BoothSummary | null => {
    if (!selectedBoothCell) return null
    const zoneLocations = locationsByZone[selectedBoothCell.zoneId] ?? []
    const loc = zoneLocations.find((l) => l.index === selectedBoothCell.slot)
    return loc?.boothSummary ?? null
  }, [selectedBoothCell, locationsByZone])

  const linkedMenus: never[] = []

  const linkedTruckBooth = useMemo((): BoothSummary | null => {
    if (!selectedSection) return null
    const zoneLocations = locationsByZone[selectedSection.zoneId] ?? []
    const loc = zoneLocations.find((l) => l.index === selectedSection.slot)
    return loc?.boothSummary ?? null
  }, [selectedSection, locationsByZone])

  const linkedTruckMenus: never[] = []

  const allMarkers = useMemo(
    () =>
      locations
        .filter((l) => l.boothSummary !== null)
        .map((l) => ({
          id: l.boothSummary!.id,
          name: l.boothSummary!.name,
          zoneId: l.zoneLabel.charAt(0),
          type: mapView,
          category:
            API_CAT_TO_KR[l.boothSummary!.category] ?? l.boothSummary!.category,
          sections: [l.index],
        })),
    [locations, mapView]
  )

  const selectedMarker =
    selectedId !== null
      ? (allMarkers.find((m) => m.id === selectedId) ?? null)
      : null

  const listMarkersBase = allMarkers.filter((m) => {
    if (listTab === 'day') return m.type === 'day'
    if (listTab === 'night') return m.type === 'night'
    return m.type === 'truck'
  })

  const listMarkers = listCatFilter
    ? listMarkersBase.filter((m) => m.category === listCatFilter)
    : listMarkersBase

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allMarkers
    return allMarkers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        String(m.id).includes(q) ||
        (m.category ?? '').toLowerCase().includes(q)
    )
  }, [searchQuery, allMarkers])

  function changeMapView(next: UserMapView) {
    setMapView(next)
    if (next === 'day') setIsDay(true)
    if (next === 'night') setIsDay(false)
    setSelectedId(null)
    setSelectedSection(null)
    setSelectedBoothCell(null)
    setSheetExpanded(false)
    setListOpen(false)
  }

  function selectBoothOnMap(
    booth: { zoneId?: string; sections?: number[]; id: string | number },
    boothType: 'day' | 'night' | 'truck'
  ) {
    const zoneId = booth.zoneId
    const slot = booth.sections?.[0] ?? 0

    setListOpen(false)
    setSheetExpanded(false)
    setSelectedId(null)
    setSelectedUserTruck(null)

    if (boothType === 'truck') {
      setSelectedSection(zoneId ? { zoneId, slot } : null)
      setSelectedBoothCell(null)
      setSheetExpandable(true)
    } else {
      setSelectedBoothCell(zoneId ? { zoneId, slot } : null)
      setSelectedSection(null)
      setSheetExpandable(true)
    }

    if (boothType === 'day') setIsDay(true)
    if (boothType === 'night') setIsDay(false)

    const el = containerRef.current
    if (el && zoneId) {
      const targetZones =
        boothType === 'day'
          ? ZONES
          : boothType === 'night'
            ? NIGHT_ZONES
            : TRUCK_ZONES
      const zone = targetZones.find((z) => z.id === zoneId)
      if (zone) {
        const cw = el.clientWidth
        const ch = el.clientHeight
        const ratio =
          boothType === 'day'
            ? 998 / 1072
            : boothType === 'night'
              ? 846 / 1430
              : 590 / 822
        const imgH = cw * ratio
        const zoneLeft = parseFloat(zone.left) / 100
        const zoneTop = parseFloat(zone.top) / 100
        const zoneW = parseFloat(zone.width) / 100
        const zoneH = parseFloat(zone.height) / 100
        const zx = (zoneLeft + zoneW / 2) * cw
        const zy = (ch - imgH) / 2 + (zoneTop + zoneH / 2) * imgH
        const targetScale = 2
        const maxX = Math.max(0, ((targetScale - 1) * cw) / 2)
        const maxY = Math.max(0, (imgH * targetScale) / 2 - ch * 0.2)
        const clampedX = Math.max(
          -maxX,
          Math.min(maxX, (cw / 2 - zx) * targetScale)
        )
        const clampedY = Math.max(
          -maxY,
          Math.min(maxY, (ch / 2 - zy) * targetScale)
        )

        if (boothType !== mapView) {
          pendingPanRef.current = {
            x: clampedX,
            y: clampedY,
            scale: targetScale,
          }
        } else {
          setScale(targetScale)
          setOffset({ x: clampedX, y: clampedY })
        }
      }
    }

    setMapView(boothType)
  }

  function openList() {
    if (listOpen) {
      setListOpen(false)
      return
    }
    setSelectedId(null)
    setSelectedSection(null)
    setSelectedBoothCell(null)
    setSelectedUserTruck(null)
    setSheetExpanded(false)
    setSheetDismissing(false)
    setListTab(
      mapView === 'truck' ? 'truck' : mapView === 'day' ? 'day' : 'night'
    )
    setListCatFilter(null)
    setListOpen(true)
  }

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

          {/* 주간/야간 부스 섹션 */}
          {mapView !== 'truck' &&
            activeBoothZones.map((zone) => {
              const zoneLocations = locationsByZone[zone.id] ?? []
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
                  {zoneLocations.map((loc, gi) => {
                    const booth = loc.boothSummary
                    const isLast = gi === zoneLocations.length - 1
                    const isSelected =
                      selectedBoothCell?.zoneId === zone.id &&
                      selectedBoothCell.slot === loc.index
                    const slotColor = booth
                      ? (CAT_COLOR_MAP[booth.category] ?? zone.color)
                      : 'transparent'
                    return (
                      <button
                        key={loc.index}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBoothCell({
                            zoneId: zone.id,
                            slot: loc.index,
                          })
                          setSelectedId(null)
                          setSelectedSection(null)
                          setSheetExpanded(false)
                          setSheetExpandable(!!booth)
                          setListOpen(false)
                        }}
                        className="relative flex min-h-0 min-w-0 select-none items-center justify-center overflow-hidden text-[7px] font-extrabold transition-[background,box-shadow,opacity]"
                        style={{
                          flex: 1,
                          background: slotColor,
                          color: FESTIV_TOKENS.ink,
                          boxShadow: isSelected
                            ? 'inset 0 0 0 2px rgba(255,255,255,0.95), 0 0 0 1px rgba(20,26,31,0.2)'
                            : undefined,
                          ...(isLast
                            ? {}
                            : zone.dir === 'row'
                              ? {
                                  borderRight:
                                    '1.5px solid rgba(20,26,31,0.22)',
                                }
                              : {
                                  borderBottom:
                                    '1.5px solid rgba(20,26,31,0.22)',
                                }),
                        }}
                      >
                        {loc.index + 1}
                      </button>
                    )
                  })}
                </div>
              )
            })}

          {/* 푸드트럭 구역 오버레이 */}
          {mapView === 'truck' &&
            TRUCK_ZONES.map((zone) => {
              const zoneLocations = locationsByZone[zone.id] ?? []
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
                  {zoneLocations.map((loc, idx) => {
                    const truck = loc.boothSummary
                    const isSelected =
                      selectedSection?.zoneId === zone.id &&
                      selectedSection.slot === loc.index
                    const isLast = idx === zoneLocations.length - 1
                    return (
                      <button
                        key={loc.index}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSection({
                            zoneId: zone.id,
                            slot: loc.index,
                          })
                          setSelectedId(null)
                          setSelectedBoothCell(null)
                          setSheetExpanded(false)
                          setSheetExpandable(!!truck)
                          setListOpen(false)
                        }}
                        className="flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[7px] font-extrabold"
                        style={{
                          background: isSelected
                            ? zone.color
                            : truck
                              ? zone.color + 'CC'
                              : 'transparent',
                          color: FESTIV_TOKENS.ink,
                          boxShadow: isSelected
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
                        {truck ? truck.name.slice(0, 3) : null}
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
      <MapZoomControls
        onZoomIn={() => zoom(0.5)}
        onZoomOut={() => zoom(-0.5)}
        canZoomOut={scale > MIN_SCALE}
      />

      {/* Top header */}
      <MapTopHeader
        mapView={mapView}
        selectedFestivalDay={selectedFestivalDay}
        currentDayLabel={CURRENT_DAY_LABEL}
        dayDropdownOpen={dayDropdownOpen}
        onSearchOpen={() => setSearchOpen(true)}
        onOpenList={openList}
        onChangeMapView={changeMapView}
        onToggleDayDropdown={() => setDayDropdownOpen((v) => !v)}
        onSelectDay={(d) => {
          setSelectedFestivalDay(d)
          setDayDropdownOpen(false)
        }}
      />

      {/* 주간 부스 유형 범례 */}
      {selectedId === null &&
        selectedSection === null &&
        selectedBoothCell === null &&
        mapView === 'day' &&
        !listOpen && <MapLegend />}

      {/* Bottom sheet - selected user truck */}
      {(selectedUserTruck !== null ||
        (sheetDismissing &&
          selectedId === null &&
          selectedSection === null &&
          selectedBoothCell === null)) &&
        selectedUserTruck &&
        (() => {
          const truckZoneColor =
            TRUCK_ZONES.find((z) => {
              const zoneLocations = locationsByZone[z.id] ?? []
              return zoneLocations.some(
                (l) => l.boothSummary?.id === selectedUserTruck.id
              )
            })?.color ?? FESTIV_TOKENS.sun
          const truckArea = getZoneName(undefined, 'truck')
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
                    color={truckZoneColor}
                    badgeText={selectedUserTruck.name.slice(0, 1)}
                    badgeFontSize="text-[15px]"
                    pill={{
                      color: FESTIV_TOKENS.sunSoft ?? '#FFF5D6',
                      ink: FESTIV_TOKENS.sun,
                      content: '푸드트럭',
                    }}
                    name={selectedUserTruck.name}
                    sub={undefined}
                  />
                  <StatGrid
                    className="mt-3"
                    stats={[
                      { label: '운영 날짜', value: '전일 운영' },
                      { label: '운영 시간', value: '' },
                    ]}
                  />
                </>
              )}
              {sheetExpanded && (
                <div className="relative h-full overflow-hidden">
                  <div
                    className="h-full overflow-y-auto overscroll-none px-5 pt-4"
                    style={{ paddingBottom: tabBarPb }}
                  >
                    <BoothDetailContent
                      type="truck"
                      name={selectedUserTruck.name}
                      area={truckArea}
                      circleColor={truckZoneColor}
                      menus={linkedTruckMenus}
                    />
                  </div>
                </div>
              )}
            </MapSheet>
          )
        })()}

      {/* Bottom sheet - selected zone section (truck) */}
      {(selectedSection !== null || (sheetDismissing && selectedId === null)) &&
        (() => {
          const zone = TRUCK_ZONES.find((z) => z.id === selectedSection?.zoneId)
          if (!zone && !sheetDismissing) return null
          return (
            <MapSheet
              sheetDragY={sheetDragY}
              sheetDismissing={sheetDismissing}
              expanded={sheetExpanded}
              expandable={!!linkedTruckBooth}
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
                      {linkedTruckBooth ? (
                        <BoothDetailContent
                          dark={dark}
                          type="truck"
                          name={linkedTruckBooth.name}
                          sections={
                            selectedSection ? [selectedSection.slot] : undefined
                          }
                          area={zone.name}
                          circleColor={zone.color}
                        />
                      ) : (
                        <div className="mt-3 rounded-xl bg-surface-alt px-4 py-3 text-center text-[12px] text-ink-40">
                          이 섹션에 배정된 푸드트럭이 없어요
                        </div>
                      )}
                    </>
                  )}
                  {sheetExpanded && linkedTruckBooth && (
                    <div className="relative h-full overflow-hidden">
                      <div
                        className="h-full overflow-y-auto overscroll-none px-5 pt-4"
                        style={{ paddingBottom: tabBarPb }}
                      >
                        <BoothDetailContent
                          dark={dark}
                          type="truck"
                          name={linkedTruckBooth.name}
                          sections={
                            selectedSection ? [selectedSection.slot] : undefined
                          }
                          area={zone.name}
                          menus={linkedTruckMenus}
                          circleColor={zone.color}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </MapSheet>
          )
        })()}

      {/* Bottom sheet - selected booth section */}
      {(selectedBoothCell !== null || sheetDismissing) && selectedBoothZone && (
        <MapSheet
          sheetDragY={sheetDragY}
          sheetDismissing={sheetDismissing}
          expanded={sheetExpanded}
          expandable={!!linkedBooth}
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onDismiss={dismissSheet}
          onToggleExpand={() => setSheetExpanded((v) => !v)}
        >
          {!sheetExpanded && (
            <>
              {linkedBooth ? (
                <BoothDetailContent
                  dark={dark}
                  type={mapView === 'night' ? 'night' : 'day'}
                  name={linkedBooth.name}
                  sections={
                    selectedBoothCell ? [selectedBoothCell.slot] : undefined
                  }
                  category={
                    API_CAT_TO_KR[linkedBooth.category] ?? linkedBooth.category
                  }
                  area={selectedBoothZone.name}
                  circleColor={selectedBoothZone.color}
                />
              ) : (
                <div className="my-3 rounded-xl bg-surface-alt px-4 py-3 text-center text-[12px] text-ink-40">
                  이 섹션에 배정된 부스가 없어요
                </div>
              )}
              {mapView === 'night' && linkedBooth && (
                <WaitingActions
                  onWaiting={() =>
                    navigate(
                      waitingRegisterUrl(linkedBooth.id as unknown as number)
                    )
                  }
                  onAlreadyWaiting={() => setCancelBoothId(linkedBooth.id)}
                  alreadyWaiting={waitings.some(
                    (w) => String(w.boothId) === linkedBooth.id
                  )}
                />
              )}
            </>
          )}
          {sheetExpanded && linkedBooth && (
            <div className="relative h-full overflow-hidden">
              <div
                className="h-full overflow-y-auto overscroll-none px-5 pt-4"
                style={{
                  paddingBottom:
                    mapView === 'night' && linkedBooth
                      ? tabBarPbTall
                      : tabBarPb,
                }}
              >
                <BoothDetailContent
                  dark={dark}
                  type={mapView === 'night' ? 'night' : 'day'}
                  name={linkedBooth.name}
                  sections={
                    selectedBoothCell ? [selectedBoothCell.slot] : undefined
                  }
                  category={
                    API_CAT_TO_KR[linkedBooth.category] ?? linkedBooth.category
                  }
                  area={selectedBoothZone.name}
                  menus={linkedMenus}
                  circleColor={selectedBoothZone.color}
                />
              </div>
              {mapView === 'night' && linkedBooth && (
                <WaitingActions
                  sticky
                  onWaiting={() =>
                    navigate(
                      waitingRegisterUrl(linkedBooth.id as unknown as number)
                    )
                  }
                  onAlreadyWaiting={() => setCancelBoothId(linkedBooth.id)}
                  alreadyWaiting={waitings.some(
                    (w) => String(w.boothId) === linkedBooth.id
                  )}
                />
              )}
            </div>
          )}
        </MapSheet>
      )}

      {/* Bottom sheet - selected booth (from search/list) */}
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
          {!sheetExpanded && (
            <>
              <BoothDetailContent
                dark={dark}
                type={selectedMarker.type}
                name={selectedMarker.name}
                sections={selectedMarker.sections}
                category={selectedMarker.category}
                area={
                  (selectedMarker.type === 'truck'
                    ? TRUCK_ZONES
                    : ALL_BOOTH_ZONES
                  ).find((z) => z.id === selectedMarker.zoneId)?.name
                }
                circleColor={
                  (selectedMarker.type === 'truck'
                    ? TRUCK_ZONES
                    : ALL_BOOTH_ZONES
                  ).find((z) => z.id === selectedMarker.zoneId)?.color
                }
              />
              {selectedMarker.type === 'night' && (
                <WaitingActions
                  onWaiting={() =>
                    navigate(
                      waitingRegisterUrl(selectedMarker.id as unknown as number)
                    )
                  }
                  onAlreadyWaiting={() =>
                    setCancelBoothId(String(selectedMarker.id))
                  }
                  alreadyWaiting={waitings.some(
                    (w) => String(w.boothId) === String(selectedMarker.id)
                  )}
                />
              )}
            </>
          )}

          {sheetExpanded && (
            <div className="relative h-full overflow-hidden">
              <div
                className="h-full overflow-y-auto overscroll-none px-5 pt-4"
                style={{
                  paddingBottom:
                    selectedMarker.type === 'night' ? tabBarPbTall : tabBarPb,
                }}
              >
                <BoothDetailContent
                  dark={dark}
                  type={selectedMarker.type}
                  name={selectedMarker.name}
                  sections={selectedMarker.sections}
                  category={selectedMarker.category}
                  area={
                    (selectedMarker.type === 'truck'
                      ? TRUCK_ZONES
                      : ALL_BOOTH_ZONES
                    ).find((z) => z.id === selectedMarker.zoneId)?.name
                  }
                  circleColor={
                    (selectedMarker.type === 'truck'
                      ? TRUCK_ZONES
                      : ALL_BOOTH_ZONES
                    ).find((z) => z.id === selectedMarker.zoneId)?.color
                  }
                  menus={[]}
                />
              </div>
              {selectedMarker.type === 'night' && (
                <WaitingActions
                  sticky
                  onWaiting={() =>
                    navigate(
                      waitingRegisterUrl(selectedMarker.id as unknown as number)
                    )
                  }
                  onAlreadyWaiting={() =>
                    setCancelBoothId(String(selectedMarker.id))
                  }
                  alreadyWaiting={waitings.some(
                    (w) => String(w.boothId) === String(selectedMarker.id)
                  )}
                />
              )}
            </div>
          )}
        </MapSheet>
      )}

      {/* Booth list overlay */}
      {listOpen && (
        <MapBoothListOverlay
          listTab={listTab}
          listCatFilter={listCatFilter}
          listMarkers={
            listMarkers as unknown as Parameters<
              typeof MapBoothListOverlay
            >[0]['listMarkers']
          }
          onClose={() => setListOpen(false)}
          onChangeTab={setListTab}
          onChangeCatFilter={setListCatFilter}
          onSelectBooth={
            selectBoothOnMap as Parameters<
              typeof MapBoothListOverlay
            >[0]['onSelectBooth']
          }
        />
      )}

      {/* Search overlay */}
      {searchOpen && (
        <MapSearchOverlay
          searchQuery={searchQuery}
          searchResults={
            searchResults as unknown as Parameters<
              typeof MapSearchOverlay
            >[0]['searchResults']
          }
          onChangeQuery={setSearchQuery}
          onClose={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
          onSelectResult={(m) => {
            setSearchOpen(false)
            setSearchQuery('')
            setSelectedId(String(m.id))
            setSelectedSection(null)
            setSelectedBoothCell(null)
            setSheetExpanded(false)
          }}
        />
      )}

      {(() => {
        const cancelTarget =
          cancelBoothId != null
            ? waitings.find((w) => String(w.boothId) === cancelBoothId)
            : null
        return (
          <ConfirmModal
            open={cancelBoothId != null}
            title="웨이팅을 취소할까요?"
            body={
              cancelTarget ? (
                <>
                  {cancelTarget.boothName} · {cancelTarget.waitNo}번
                  <br />
                  취소 후에는 다시 등록해야 합니다.
                </>
              ) : (
                '취소 후에는 다시 등록해야 합니다.'
              )
            }
            confirmLabel="취소하기"
            onConfirm={() => {
              if (cancelBoothId != null) cancelWaiting(Number(cancelBoothId))
              setCancelBoothId(null)
              setShowCancelToast(true)
              setTimeout(() => setShowCancelToast(false), 2000)
            }}
            onClose={() => setCancelBoothId(null)}
          />
        )
      })()}

      <CancelToast show={showCancelToast} />

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
