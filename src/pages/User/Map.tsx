import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { waitingRegisterUrl } from '../../constants/routes'

import { useLocations } from '../../features/Map/hooks/useLocations'
import { useBooth } from '../../features/Booth/hooks/useBooth'
import { useBoothMenus } from '../../features/Booth/hooks/useBoothMenus'
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
import { MapZoomControls } from '../../components/User/Map/MapZoomControls'
import {
  MapTopHeader,
  type MapView,
} from '../../components/User/Map/MapTopHeader'
import { MapLegend } from '../../components/User/Map/MapLegend'
import { MapBoothListOverlay } from '../../components/User/Map/MapBoothListOverlay'
import { MapSearchOverlay } from '../../components/User/Map/MapSearchOverlay'
import { MapZoomableLayer } from '../../components/User/Map/MapZoomableLayer'
import { MapDayNightZones } from '../../components/User/Map/MapDayNightZones'
import { MapTruckZones } from '../../components/User/Map/MapTruckZones'
import { MapDayNightSheet } from '../../components/User/Map/MapDayNightSheet'
import { MapTruckSheet } from '../../components/User/Map/MapTruckSheet'
import { MapMarkerSheet } from '../../components/User/Map/MapMarkerSheet'
import {
  useMapGesture,
  MIN_SCALE,
} from '../../features/Map/hooks/useMapGesture'
import { useSheetDrag } from '../../features/Map/hooks/useSheetDrag'
import { ZONES, NIGHT_ZONES } from '../../data/zones'
import { useDayNightStore } from '../../stores/useDayNightStore'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'
import { useMyWaitings } from '../../features/Waiting/hooks/useMyWaitings'
import { deleteWaiting } from '../../features/Waiting/apis/deleteWaiting'
import { waitingKeys } from '../../features/Waiting/hooks/useMyWaitings'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { useFestival } from '../../features/Festival/hooks/useFestival'

type UserMapView = MapView

const _d = new Date()
const todayStr = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`

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

export function UserMap({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDay, setIsDay } = useDayNightStore()
  const { zoneRotations } = useTruckPlacementStore()
  const queryClient = useQueryClient()
  const { data: waitings = [] } = useMyWaitings()
  const { mutate: cancelWaitingMutate } = useMutation({
    mutationFn: deleteWaiting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.all })
    },
  })

  const { data: festival } = useFestival()
  const { data: festivalDaysList = [] } = useFestivalDays()

  // festival start/end로 전체 일차 라벨 생성
  const totalDays = useMemo(() => {
    if (festival?.startDate && festival?.endDate) {
      const s = new Date(festival.startDate + 'T00:00:00')
      const e = new Date(festival.endDate + 'T00:00:00')
      return Math.round((e.getTime() - s.getTime()) / 86400000) + 1
    }
    return festivalDaysList.length || 1
  }, [festival?.startDate, festival?.endDate, festivalDaysList.length])

  const dayLabels = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => `${i + 1}일차`),
    [totalDays]
  )

  // 오늘 날짜가 몇 일차인지 계산
  const todayIndex = useMemo(() => {
    if (!festival?.startDate)
      return festivalDaysList.findIndex((d) => d.day === todayStr)
    const s = new Date(festival.startDate + 'T00:00:00')
    const t = new Date(todayStr + 'T00:00:00')
    const diff = Math.round((t.getTime() - s.getTime()) / 86400000)
    return diff >= 0 && diff < totalDays ? diff : -1
  }, [festival?.startDate, totalDays, festivalDaysList])

  // 라이브 중일 때만 dot 표시 — 미리보기/종료 시 빈 문자열
  const todayDayLabel = todayIndex >= 0 ? `${todayIndex + 1}일차` : ''
  const defaultDayLabel = todayDayLabel || (dayLabels[0] ?? '1일차')
  const [userSelectedDay, setUserSelectedDay] = useState<string | null>(null)
  const selectedFestivalDay = userSelectedDay ?? defaultDayLabel
  const setSelectedFestivalDay = setUserSelectedDay
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

  const selectedDayIndex = dayLabels.indexOf(selectedFestivalDay)
  // festivalDay DB에 해당 날짜 없으면 '' → useLocations disabled → 빈 상태
  const currentApiDay = useMemo(() => {
    if (!festival?.startDate)
      return festivalDaysList[selectedDayIndex]?.day ?? ''
    const s = new Date(festival.startDate + 'T00:00:00')
    s.setDate(s.getDate() + selectedDayIndex)
    return `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}-${String(s.getDate()).padStart(2, '0')}`
  }, [festival?.startDate, selectedDayIndex, festivalDaysList])
  const { data: locations = [] } = useLocations({
    day: currentApiDay,
    type: MAPVIEW_TO_API_TYPE[mapView],
  })
  const { data: dayListLocations = [] } = useLocations({
    day: currentApiDay,
    type: 'DAY',
  })
  const { data: nightListLocations = [] } = useLocations({
    day: currentApiDay,
    type: 'NIGHT',
  })
  const { data: truckListLocations = [] } = useLocations({
    day: currentApiDay,
    type: 'FOOD_TRUCK',
  })

  const zoneLabelToId = useMemo(() => {
    const map: Record<string, string> = {}
    for (const z of [...ZONES, ...NIGHT_ZONES]) {
      map[z.name] = z.id
      map[`${z.id} ${z.name}`] = z.id
    }
    for (const z of TRUCK_ZONES) {
      map[z.name] = z.id
    }
    return map
  }, [])

  const locationsByZone = useMemo(() => {
    const map: Record<string, GetLocationsResponseDto[]> = {}
    for (const loc of locations) {
      const zoneId = zoneLabelToId[loc.zoneLabel] ?? loc.zoneLabel
      if (!map[zoneId]) map[zoneId] = []
      map[zoneId].push(loc)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.index - b.index)
    }
    return map
  }, [locations, zoneLabelToId])

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
    ? ([...ZONES, ...NIGHT_ZONES].find(
        (zone) => zone.id === selectedBoothCell.zoneId
      ) ?? null)
    : null

  const linkedBooth = useMemo((): BoothSummary | null => {
    if (!selectedBoothCell) return null
    const zoneLocations = locationsByZone[selectedBoothCell.zoneId] ?? []
    const loc = zoneLocations.find((l) => l.index === selectedBoothCell.slot)
    return loc?.boothSummary ?? null
  }, [selectedBoothCell, locationsByZone])

  const linkedTruckBooth = useMemo((): BoothSummary | null => {
    if (!selectedSection) return null
    const zoneLocations = locationsByZone[selectedSection.zoneId] ?? []
    const loc = zoneLocations.find((l) => l.index === selectedSection.slot)
    return loc?.boothSummary ?? null
  }, [selectedSection, locationsByZone])

  const activeBoothId: string | null = useMemo(() => {
    if (linkedBooth) return linkedBooth.id
    if (linkedTruckBooth) return linkedTruckBooth.id
    if (selectedUserTruck) return selectedUserTruck.id
    return selectedId
  }, [linkedBooth, linkedTruckBooth, selectedUserTruck, selectedId])

  const { data: boothDetail } = useBooth(activeBoothId)
  const { data: boothMenus = [] } = useBoothMenus(activeBoothId)

  const allMarkers = useMemo(
    () =>
      locations
        .filter((l) => l.boothSummary !== null)
        .map((l) => ({
          id: l.boothSummary!.id,
          name: l.boothSummary!.name,
          zoneId: l.zoneLabel,
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

  const toMarkers = (locs: typeof dayListLocations, type: string) =>
    locs
      .filter((l) => l.boothSummary !== null)
      .map((l) => ({
        id: l.boothSummary!.id,
        name: l.boothSummary!.name,
        zoneId: zoneLabelToId[l.zoneLabel] ?? l.zoneLabel,
        type,
        category:
          API_CAT_TO_KR[l.boothSummary!.category] ?? l.boothSummary!.category,
        sections: [l.index],
      }))

  const listMarkersBase =
    listTab === 'day'
      ? toMarkers(dayListLocations, 'day')
      : listTab === 'night'
        ? toMarkers(nightListLocations, 'night')
        : toMarkers(truckListLocations, 'truck')
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

  const sheetHandlers = {
    sheetDragY,
    sheetDismissing,
    sheetExpanded,
    onSheetTouchStart: handleSheetTouchStart,
    onSheetTouchMove: handleSheetTouchMove,
    onSheetTouchEnd: handleSheetTouchEnd,
    onDismiss: dismissSheet,
    onToggleExpand: () => setSheetExpanded((v) => !v),
  }

  const waitingProps = {
    onWaiting: (id: string | number) => navigate(waitingRegisterUrl(id)),
    onAlreadyWaiting: (id: string) => setCancelBoothId(id),
    isAlreadyWaiting: (id: string) =>
      waitings.some(
        (w) =>
          w.boothSummary?.id === id &&
          (w.status === 'WAITING' || w.status === 'CALLED')
      ),
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden overscroll-none bg-[#E8F4F5] font-festi dark:bg-[#0B1A1F]"
    >
      <MapZoomableLayer
        scale={scale}
        offset={offset}
        isPinching={isPinching}
        activeMapAspect={activeMapAspect}
        activeMapImage={activeMapImage}
        dark={dark}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSheetExpanded(false)
          if (
            selectedId !== null ||
            selectedSection !== null ||
            selectedBoothCell !== null
          )
            dismissSheet()
        }}
      >
        {mapView !== 'truck' && (
          <MapDayNightZones
            activeBoothZones={activeBoothZones}
            locationsByZone={locationsByZone}
            selectedBoothCell={selectedBoothCell}
            onSelectCell={(zoneId, slot, hasBooth) => {
              setSelectedBoothCell({ zoneId, slot })
              setSelectedId(null)
              setSelectedSection(null)
              setSheetExpanded(false)
              setSheetExpandable(hasBooth)
              setListOpen(false)
            }}
          />
        )}
        {mapView === 'truck' && (
          <MapTruckZones
            zoneRotations={zoneRotations}
            locationsByZone={locationsByZone}
            selectedSection={selectedSection}
            onSelectSection={(zoneId, slot, hasTruck) => {
              setSelectedSection({ zoneId, slot })
              setSelectedId(null)
              setSelectedBoothCell(null)
              setSheetExpanded(false)
              setSheetExpandable(hasTruck)
              setListOpen(false)
            }}
          />
        )}
      </MapZoomableLayer>

      <MapZoomControls
        onZoomIn={() => zoom(0.5)}
        onZoomOut={() => zoom(-0.5)}
        canZoomOut={scale > MIN_SCALE}
      />

      <MapTopHeader
        mapView={mapView}
        selectedFestivalDay={selectedFestivalDay}
        currentDayLabel={todayDayLabel}
        dayLabels={dayLabels}
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

      {selectedId === null &&
        selectedSection === null &&
        selectedBoothCell === null &&
        mapView === 'day' &&
        !listOpen && <MapLegend />}

      {(selectedUserTruck !== null ||
        selectedSection !== null ||
        (sheetDismissing && selectedId === null)) && (
        <MapTruckSheet
          dark={dark}
          selectedSection={selectedSection}
          linkedTruckBooth={linkedTruckBooth}
          selectedUserTruck={selectedUserTruck}
          locationsByZone={locationsByZone}
          boothDetail={boothDetail}
          boothMenus={boothMenus}
          {...sheetHandlers}
        />
      )}

      {(selectedBoothCell !== null || sheetDismissing) && selectedBoothZone && (
        <MapDayNightSheet
          dark={dark}
          mapView={mapView}
          selectedBoothCell={selectedBoothCell}
          selectedBoothZone={selectedBoothZone}
          linkedBooth={linkedBooth}
          boothDetail={boothDetail}
          boothMenus={boothMenus}
          {...sheetHandlers}
          {...waitingProps}
        />
      )}

      {(selectedId !== null || sheetDismissing) && selectedMarker && (
        <MapMarkerSheet
          dark={dark}
          selectedMarker={selectedMarker}
          boothDetail={boothDetail}
          boothMenus={boothMenus}
          {...sheetHandlers}
          {...waitingProps}
        />
      )}

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
            ? waitings.find(
                (w) =>
                  w.boothSummary?.id === cancelBoothId &&
                  (w.status === 'WAITING' || w.status === 'CALLED')
              )
            : null
        return (
          <ConfirmModal
            open={cancelBoothId != null}
            title="웨이팅을 취소할까요?"
            body={
              cancelTarget ? (
                <>
                  {cancelTarget.boothSummary?.name ?? '—'}
                  <br />
                  취소 후에는 다시 등록해야 합니다.
                </>
              ) : (
                '취소 후에는 다시 등록해야 합니다.'
              )
            }
            confirmLabel="취소하기"
            onConfirm={() => {
              if (cancelTarget) cancelWaitingMutate(cancelTarget.id)
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
