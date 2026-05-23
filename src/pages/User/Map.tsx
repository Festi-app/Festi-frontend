import { useMemo, useState } from 'react'
import { tabBarPb, tabBarPbTall } from '../../lib/safeArea'
import { useNavigate, useLocation } from 'react-router-dom'
import { FESTIV_TOKENS } from '../../tokens'
import { waitingRegisterUrl } from '../../constants/routes'
import { StatGrid } from '../../components/User/StatGrid'

import {
  DAY_BOOTHS,
  NIGHT_BOOTHS,
  TRUCK_BOOTHS,
  TRUCK_BOOTH_MENUS,
  DAY_BOOTH_MENUS,
  NIGHT_BOOTH_MENUS,
} from '../../data/booths'
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
  useBoothSectionStore,
  type PermDay,
  type PermTime,
} from '../../stores/useBoothSectionStore'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'
import { useWaitingStore } from '../../stores/useWaitingStore'
import { BoothDetailContent } from '../../components/User/BoothDetailContent'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

type UserMapView = MapView

// ── Screen: Map ───────────────────────────────────────────────────────────────

export function UserMap({ dark = false }: { dark?: boolean }) {
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
  const { waitings, cancelWaiting } = useWaitingStore()
  const [selectedFestivalDay, setSelectedFestivalDay] = useState('2일차')
  const CURRENT_DAY_LABEL = '2일차'
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false)
  const [mapView, setMapView] = useState<UserMapView>(isDay ? 'day' : 'night')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
  const [selectedUserTruck, setSelectedUserTruck] = useState<
    (typeof TRUCK_BOOTHS)[0] | null
  >(null)
  const [listOpen, setListOpen] = useState(() => {
    const s = location.state as { openList?: boolean } | null
    return s?.openList ?? false
  })
  const [listTab, setListTab] = useState<'day' | 'night' | 'truck'>(() => {
    const s = location.state as { tab?: 'day' | 'night' | 'truck' } | null
    return s?.tab ?? 'night'
  })
  const [listCatFilter, setListCatFilter] = useState<string | null>(null)
  const [cancelBoothId, setCancelBoothId] = useState<number | null>(null)
  const [showCancelToast, setShowCancelToast] = useState(false)

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
      setSelectedBoothPermId(null)
      setSelectedBoothCell(null)
      setSelectedUserTruck(null)
    },
  })

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

  function changeMapView(next: UserMapView) {
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

  function selectBoothOnMap(
    booth: { zoneId?: string; sections?: number[]; id: number },
    boothType: 'day' | 'night' | 'truck'
  ) {
    const zoneId = booth.zoneId
    const slot = booth.sections?.[0] ?? 0

    // 선택 상태 초기화 및 설정
    setListOpen(false)
    setSheetExpanded(false)
    setSelectedId(null)
    setSelectedUserTruck(null)

    if (boothType === 'truck') {
      setSelectedSection(zoneId ? { zoneId, slot } : null)
      setSelectedBoothCell(null)
      setSelectedBoothPermId(null)
      setSheetExpandable(true)
    } else {
      const time: PermTime = boothType === 'night' ? '야간' : '주간'
      const perm = boothPermissions.find(
        (p) =>
          p.zoneId === zoneId &&
          p.day === selectedDayNumber &&
          p.time === time &&
          (booth.sections?.some((s) => p.sections.includes(s)) ?? false)
      )
      setSelectedBoothCell(zoneId ? { zoneId, slot } : null)
      setSelectedBoothPermId(perm?.id ?? null)
      setSelectedSection(null)
      setSheetExpandable(true)
    }

    if (boothType === 'day') setIsDay(true)
    if (boothType === 'night') setIsDay(false)

    // 지도 패닝 계산
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

  // 구역 오버레이용 데이터 (핀 마커 대신 구역 박스로 표시)
  const truckTime = isDay ? '주간' : '야간'
  const allMarkers = useMemo(
    () => [
      ...DAY_BOOTHS.map((b) => ({ ...b, type: b.type })),
      ...NIGHT_BOOTHS.map((b) => ({ ...b, type: b.type })),
      ...TRUCK_BOOTHS.map((b) => ({ ...b, type: 'truck' as const })),
    ],
    []
  )

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
                  {(() => {
                    // 연속된 같은 perm 섹션을 하나의 그룹으로 묶기
                    type Group = {
                      perm: (typeof boothPermissions)[number] | undefined
                      sections: number[]
                    }
                    const groups: Group[] = []
                    for (let idx = 0; idx < divisions; idx++) {
                      const perm = boothPermissions.find(
                        (p) =>
                          p.zoneId === zone.id &&
                          p.day === selectedDayNumber &&
                          p.time === activeBoothTime &&
                          p.sections.includes(idx)
                      )
                      const last = groups[groups.length - 1]
                      if (last && perm != null && last.perm?.id === perm.id) {
                        last.sections.push(idx)
                      } else {
                        groups.push({ perm, sections: [idx] })
                      }
                    }
                    return groups.map((group, gi) => {
                      const { perm, sections } = group
                      const isLast = gi === groups.length - 1
                      const selected =
                        perm != null &&
                        selectedBoothCellPerm != null &&
                        perm.id === selectedBoothCellPerm.id &&
                        selectedBoothCell?.zoneId === zone.id
                      return (
                        <button
                          key={sections[0]}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBoothCell({
                              zoneId: zone.id,
                              slot: sections[0],
                            })
                            setSelectedBoothPermId(perm?.id ?? null)
                            setSelectedId(null)
                            setSelectedSection(null)
                            setSheetExpanded(false)
                            setSheetExpandable(!!perm)
                            setListOpen(false)
                          }}
                          className="relative flex min-h-0 min-w-0 select-none items-center justify-center overflow-hidden text-[7px] font-extrabold transition-[background,box-shadow,opacity]"
                          style={{
                            flex: sections.length,
                            background: perm ? perm.color : 'transparent',
                            color: FESTIV_TOKENS.ink,
                            boxShadow: selected
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
                          {perm
                            ? sections.length > 1
                              ? `#${sections[0] + 1}-${sections[sections.length - 1] + 1}`
                              : `${sections[0] + 1}`
                            : null}
                        </button>
                      )
                    })
                  })()}
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
                      (linkedTruckBooth?.zoneId === zone.id
                        ? (linkedTruckBooth.sections?.includes(idx) ?? false)
                        : selectedSection.slot === idx)
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
                        className="flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[7px] font-extrabold"
                        style={{
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
        selectedBoothPermId === null &&
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
          const truckArea =
            truckAreaFromStore ?? getZoneName(selectedUserTruck.zoneId, 'truck')
          const truckZoneColor =
            TRUCK_ZONES.find((z) => z.id === selectedUserTruck.zoneId)?.color ??
            FESTIV_TOKENS.sun
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
                    sub={selectedUserTruck.description}
                  />
                  <StatGrid
                    className="mt-3"
                    stats={[
                      { label: '운영 날짜', value: '전일 운영' },
                      {
                        label: '운영 시간',
                        value: selectedUserTruck.operatingHours ?? '',
                      },
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
                      id={selectedUserTruck.id}
                      sections={selectedUserTruck.sections}
                      operatingHours={selectedUserTruck.operatingHours}
                      description={selectedUserTruck.description}
                      area={truckArea}
                      circleColor={truckZoneColor}
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
                      {linkedTruckBooth ? (
                        <BoothDetailContent
                          dark={dark}
                          type="truck"
                          name={truck?.name ?? linkedTruckBooth.name}
                          id={linkedTruckBooth.id}
                          sections={linkedTruckBooth.sections}
                          operatingHours={linkedTruckBooth.operatingHours}
                          description={linkedTruckBooth.description}
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
                          name={truck?.name ?? linkedTruckBooth.name}
                          id={linkedTruckBooth.id}
                          sections={linkedTruckBooth.sections}
                          operatingHours={linkedTruckBooth.operatingHours}
                          description={linkedTruckBooth.description}
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
              {linkedBooth ? (
                <BoothDetailContent
                  dark={dark}
                  type={activeBoothTime === '야간' ? 'night' : 'day'}
                  name={linkedBooth.name}
                  id={linkedBooth.id}
                  sections={linkedBooth.sections}
                  category={linkedBooth.category}
                  operatingHours={linkedBooth.operatingHours}
                  days={linkedBooth.days}
                  description={linkedBooth.description}
                  area={selectedBoothZone.name}
                  circleColor={selectedBoothZone.color}
                />
              ) : selectedBoothCellPerm ? (
                <BoothDetailContent
                  dark={dark}
                  type={activeBoothTime === '야간' ? 'night' : 'day'}
                  name={selectedBoothCellPerm.orgName}
                  id={selectedBoothCellPerm.boothId}
                  sections={selectedBoothCellPerm.sections}
                  category={selectedBoothCellPerm.category}
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
                  onWaiting={() => navigate(waitingRegisterUrl(linkedBooth.id))}
                  onAlreadyWaiting={() => setCancelBoothId(linkedBooth.id)}
                  waitBadge={linkedBooth.wait}
                  alreadyWaiting={waitings.some(
                    (w) => w.boothId === linkedBooth.id
                  )}
                />
              )}
            </>
          )}
          {sheetExpanded && (selectedBoothCellPerm || linkedBooth) && (
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
                {linkedBooth ? (
                  <BoothDetailContent
                    dark={dark}
                    type={activeBoothTime === '야간' ? 'night' : 'day'}
                    name={linkedBooth.name}
                    id={linkedBooth.id}
                    sections={linkedBooth.sections}
                    category={linkedBooth.category}
                    operatingHours={linkedBooth.operatingHours}
                    days={linkedBooth.days}
                    description={linkedBooth.description}
                    area={selectedBoothZone.name}
                    menus={linkedMenus}
                    circleColor={selectedBoothZone.color}
                  />
                ) : selectedBoothCellPerm ? (
                  <BoothDetailContent
                    dark={dark}
                    type={activeBoothTime === '야간' ? 'night' : 'day'}
                    name={selectedBoothCellPerm.orgName}
                    id={selectedBoothCellPerm.boothId}
                    sections={selectedBoothCellPerm.sections}
                    category={selectedBoothCellPerm.category}
                    area={selectedBoothZone.name}
                    circleColor={selectedBoothZone.color}
                  />
                ) : null}
              </div>
              {mapView === 'night' && linkedBooth && (
                <WaitingActions
                  sticky
                  onWaiting={() => navigate(waitingRegisterUrl(linkedBooth.id))}
                  onAlreadyWaiting={() => setCancelBoothId(linkedBooth.id)}
                  waitBadge={linkedBooth.wait}
                  alreadyWaiting={waitings.some(
                    (w) => w.boothId === linkedBooth.id
                  )}
                />
              )}
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
              <BoothDetailContent
                dark={dark}
                type={selectedMarker.type}
                id={selectedMarker.id}
                sections={selectedMarker.sections}
                name={selectedMarker.name}
                category={selectedMarker.category}
                operatingHours={selectedMarker.operatingHours}
                days={selectedMarker.days}
                description={selectedMarker.description}
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
                    navigate(waitingRegisterUrl(selectedMarker.id))
                  }
                  onAlreadyWaiting={() => setCancelBoothId(selectedMarker.id)}
                  waitBadge={selectedMarker.wait}
                  alreadyWaiting={waitings.some(
                    (w) => w.boothId === selectedMarker.id
                  )}
                />
              )}
            </>
          )}

          {/* ── 확장: 상세 ── */}
          {sheetExpanded && (
            <div className="relative h-full overflow-hidden">
              {/* 스크롤 바디 */}
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
                  id={selectedMarker.id}
                  sections={selectedMarker.sections}
                  name={selectedMarker.name}
                  category={selectedMarker.category}
                  operatingHours={selectedMarker.operatingHours}
                  days={selectedMarker.days}
                  description={selectedMarker.description}
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
                  menus={
                    selectedMarker.type === 'night'
                      ? NIGHT_BOOTH_MENUS.filter(
                          (m) => m.boothId === selectedMarker.id
                        )
                      : selectedMarker.type === 'truck'
                        ? TRUCK_BOOTH_MENUS.filter(
                            (m) => m.boothId === selectedMarker.id
                          )
                        : DAY_BOOTH_MENUS.filter(
                            (m) => m.boothId === selectedMarker.id
                          )
                  }
                />
              </div>
              {/* 스티키 CTA - 야간만 */}
              {selectedMarker.type === 'night' && (
                <WaitingActions
                  sticky
                  onWaiting={() =>
                    navigate(waitingRegisterUrl(selectedMarker.id))
                  }
                  onAlreadyWaiting={() => setCancelBoothId(selectedMarker.id)}
                  waitBadge={selectedMarker.wait}
                  alreadyWaiting={waitings.some(
                    (w) => w.boothId === selectedMarker.id
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
          listMarkers={listMarkers}
          onClose={() => setListOpen(false)}
          onChangeTab={setListTab}
          onChangeCatFilter={setListCatFilter}
          onSelectBooth={selectBoothOnMap}
        />
      )}

      {/* Search overlay */}
      {searchOpen && (
        <MapSearchOverlay
          searchQuery={searchQuery}
          searchResults={searchResults}
          onChangeQuery={setSearchQuery}
          onClose={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
          onSelectResult={(m) => {
            setSearchOpen(false)
            setSearchQuery('')
            setSelectedId(m.id)
            setSelectedSection(null)
            setSelectedBoothCell(null)
            setSelectedBoothPermId(null)
            setSheetExpanded(false)
          }}
        />
      )}

      {(() => {
        const cancelTarget =
          cancelBoothId != null
            ? waitings.find((w) => w.boothId === cancelBoothId)
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
              if (cancelBoothId != null) cancelWaiting(cancelBoothId)
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
