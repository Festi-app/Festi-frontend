import { useState, useRef, useEffect, useMemo } from 'react'
import { FESTIV_TOKENS, I } from '../../tokens'
import { ZONES, NIGHT_ZONES } from '../../data/zones'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { BoothConfigureSidebar } from '../../components/Admin/Booth/BoothConfigure/BoothConfigureSidebar'
import { BoothAssignSidebar } from '../../components/Admin/Booth/BoothAssign/BoothAssignSidebar'
import { type OrgAccount } from '../../components/Admin/Booth/boothShared'
import { cn } from '../../lib/cn'
import soongsilDayMap from '../../assets/soongsil-day-map.png'
import soongsilNightMap from '../../assets/soongsil-night-map.png'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
  type TruckTime,
} from '../../stores/useTruckPlacementStore'
import {
  useBoothSectionStore,
  type PermDay,
  type PermTime,
  type BoothCategory,
  type BoothMapMode,
  type BoothPermission,
} from '../../stores/useBoothSectionStore'
import { AdminModal } from '../../components/Admin/AdminModal'
import { AdminToast } from '../../components/Admin/AdminToast'
import { BoothPermissionModal } from '../../components/Admin/Booth/BoothPermissionModal'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { useBooths } from '../../features/Booth/hooks/useBooths'
import { useLocations } from '../../features/Map/hooks/useLocations'
import { useAssignBooth } from '../../features/Map/hooks/useAssignBooth'
import { useCreateLocationSlots } from '../../features/Map/hooks/useCreateLocationSlots'
import type { GetLocationsResponseDto } from '../../features/Map/types/LocationsResponseDto'
import type { BoothType } from '../../types/common'

const ORG_COLORS = [
  FESTIV_TOKENS.coral,
  FESTIV_TOKENS.mint,
  FESTIV_TOKENS.sun,
  FESTIV_TOKENS.grape,
  FESTIV_TOKENS.pop,
  FESTIV_TOKENS.rose,
  FESTIV_TOKENS.leaf,
]

const CAT_COLOR: Record<string, string> = {
  정보: FESTIV_TOKENS.mint,
  체험: FESTIV_TOKENS.grape,
  마켓: FESTIV_TOKENS.sun,
  활동: FESTIV_TOKENS.pop,
}

function slotCountsByZone(locations: GetLocationsResponseDto[]) {
  return locations.reduce<Record<string, number>>((counts, location) => {
    const zoneId = locationZoneId(location.zoneLabel)
    counts[zoneId] = Math.max(counts[zoneId] ?? 0, location.index)
    return counts
  }, {})
}

function locationZoneId(zoneLabel: string) {
  const zones = [...NIGHT_ZONES, ...ZONES, ...TRUCK_ZONES]
  return (
    zones.find(
      (zone) => zoneLabel === zone.id || zoneLabel.startsWith(`${zone.id} `)
    )?.id ?? zoneLabel
  )
}

function toLocalCategory(category?: string): BoothCategory {
  switch (category) {
    case 'INFO':
      return '정보'
    case 'EXPERIENCE':
      return '체험'
    case 'MARKET':
      return '마켓'
    case 'ACTIVITY':
    case 'ALCOHOL':
    default:
      return '활동'
  }
}

function groupBorder(idx: number, sections: number[], dir: 'row' | 'column') {
  const sorted = [...sections].sort((a, b) => a - b)
  const isFirst = sorted[0] === idx
  const isLast = sorted[sorted.length - 1] === idx
  const c = 'rgba(255,255,255,0.72)'
  const w = '2px'
  const parts: string[] = []
  if (dir === 'row') {
    parts.push(`inset 0 ${w} 0 0 ${c}`, `inset 0 -${w} 0 0 ${c}`)
    if (isFirst) parts.push(`inset ${w} 0 0 0 ${c}`)
    if (isLast) parts.push(`inset -${w} 0 0 0 ${c}`)
  } else {
    parts.push(`inset ${w} 0 0 0 ${c}`, `inset -${w} 0 0 0 ${c}`)
    if (isFirst) parts.push(`inset 0 ${w} 0 0 ${c}`)
    if (isLast) parts.push(`inset 0 -${w} 0 0 ${c}`)
  }
  return parts.join(', ')
}

function selectionShadow(
  idx: number,
  lo: number,
  hi: number,
  dir: 'row' | 'column'
) {
  const w = '3px'
  const c = 'rgba(255,255,255,0.95)'
  const parts: string[] = []
  if (dir === 'row') {
    parts.push(`inset 0 ${w} 0 0 ${c}`, `inset 0 -${w} 0 0 ${c}`)
    if (idx === lo) parts.push(`inset ${w} 0 0 0 ${c}`)
    if (idx === hi) parts.push(`inset -${w} 0 0 0 ${c}`)
  } else {
    parts.push(`inset ${w} 0 0 0 ${c}`, `inset -${w} 0 0 0 ${c}`)
    if (idx === lo) parts.push(`inset 0 ${w} 0 0 ${c}`)
    if (idx === hi) parts.push(`inset 0 -${w} 0 0 ${c}`)
  }
  return parts.join(', ')
}

// ── AdminBooths ───────────────────────────────────────────────────────────────

export function AdminBooths() {
  const { data: festivalDays = [] } = useFestivalDays()
  const { data: booths = [] } = useBooths()
  const createLocationSlots = useCreateLocationSlots()
  const assignBooth = useAssignBooth()

  const allOrgs: OrgAccount[] = booths.map((booth, idx) => ({
    id: booth.id,
    name: booth.name,
    type: '동아리' as const,
    color: ORG_COLORS[idx % ORG_COLORS.length],
    applications: ([1, 2, 3] as PermDay[]).flatMap((d) =>
      booth.type === 'FOOD_TRUCK'
        ? []
        : [
            {
              day: d,
              time: (booth.type === 'NIGHT' ? '야간' : '주간') as PermTime,
            },
          ]
    ),
  }))

  const {
    permissions,
    addPermission,
    zoneDivisions,
    setZoneDivisions,
    markModeConfigured,
    configuredModes,
  } = useBoothSectionStore()

  const allConfigured = (['주간', '야간', '푸드트럭'] as BoothMapMode[]).every(
    (m) => configuredModes.includes(m)
  )
  const [stepOverride, setStep] = useState<'configure' | 'assign' | null>(
    allConfigured ? 'assign' : null
  )
  const {
    trucks,
    assignments: truckAssignments,
    slotCounts: truckSlotCounts,
    setSlotCount: setTruckSlotCount,
    zoneRotations: truckZoneRotations,
  } = useTruckPlacementStore()
  const [mapMode, setMapMode] = useState<BoothMapMode>('주간')
  const activeZones = mapMode === '주간' ? ZONES : NIGHT_ZONES
  const [dragState, setDragState] = useState<{
    zoneId: string | null
    startIdx: number | null
    currentIdx: number | null
    active: boolean
  }>({ zoneId: null, startIdx: null, currentIdx: null, active: false })
  const dragStateRef = useRef(dragState)
  useEffect(() => {
    dragStateRef.current = dragState
  })
  const [assignModal, setAssignModal] = useState<{
    zoneId: string
    sections: number[]
  } | null>(null)
  const [selectedDay, setSelectedDay] = useState<PermDay>(1)
  const selectedTime: PermTime = mapMode === '야간' ? '야간' : '주간'

  const modeToType: Record<BoothMapMode, BoothType> = {
    주간: 'DAY',
    야간: 'NIGHT',
    푸드트럭: 'FOOD_TRUCK',
  }
  const currentFestivalDay = festivalDays[selectedDay - 1]
  const { data: locations = [] } = useLocations({
    day: currentFestivalDay?.day ?? '',
    type: modeToType[mapMode],
  })
  const initialFestivalDay = festivalDays[0]?.day ?? ''
  const {
    data: configuredDayLocations = [],
    isSuccess: hasLoadedDayLocations,
  } = useLocations({
    day: initialFestivalDay,
    type: 'DAY',
  })
  const {
    data: configuredNightLocations = [],
    isSuccess: hasLoadedNightLocations,
  } = useLocations({
    day: initialFestivalDay,
    type: 'NIGHT',
  })
  const {
    data: configuredTruckLocations = [],
    isSuccess: hasLoadedTruckLocations,
  } = useLocations({
    day: initialFestivalDay,
    type: 'FOOD_TRUCK',
  })
  const hasLoadedConfiguredLocations =
    hasLoadedDayLocations && hasLoadedNightLocations && hasLoadedTruckLocations
  const hasExistingSlots =
    hasLoadedConfiguredLocations &&
    [
      configuredDayLocations,
      configuredNightLocations,
      configuredTruckLocations,
    ].some((modeLocations) => modeLocations.length > 0)
  const step = stepOverride ?? (hasExistingSlots ? 'assign' : 'configure')
  const hasInitializedSlots = useRef(false)
  const [truckDay, setTruckDay] = useState(1)
  const [truckTime, setTruckTime] = useState<TruckTime>('야간')
  const [selectedTruckZone, setSelectedTruckZone] = useState<string | null>(
    null
  )
  const [selectedTruckSlot, setSelectedTruckSlot] = useState<number | null>(
    null
  )
  const [showConfigureBlockModal, setShowConfigureBlockModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [notice, setNotice] = useState('구역별 섹션 개수를 설정하고 저장하세요')
  const [draftDivisions, setDraftDivisions] = useState<Record<string, number>>(
    {}
  )
  const [draftTruckSlots, setDraftTruckSlots] = useState<
    Record<string, number>
  >({})
  const displayedNotice =
    stepOverride === null && hasExistingSlots
      ? '기존 슬롯을 불러왔어요. 지도에서 권한을 부여하세요'
      : notice
  const serverPermissions = useMemo<BoothPermission[]>(
    () =>
      locations
        .filter((location) => location.boothSummary)
        .map((location) => {
          const booth = location.boothSummary!
          const org = allOrgs.find((candidate) => candidate.id === booth.id)
          return {
            id: `location-${location.id}`,
            zoneId: locationZoneId(location.zoneLabel),
            sections: [location.index - 1],
            orgId: booth.id,
            orgName: booth.name,
            color: org?.color ?? FESTIV_TOKENS.coral,
            category: toLocalCategory(booth.category),
            day: selectedDay,
            time: selectedTime,
          }
        }),
    [allOrgs, locations, selectedDay, selectedTime]
  )
  const displayPermissions = useMemo<BoothPermission[]>(() => {
    const occupiedSections = new Set(
      serverPermissions.flatMap((permission) =>
        permission.sections.map((section) => `${permission.zoneId}:${section}`)
      )
    )
    const localPermissions = permissions
      .filter(
        (permission) =>
          permission.day === selectedDay && permission.time === selectedTime
      )
      .map((permission) => ({
        ...permission,
        sections: permission.sections.filter(
          (section) => !occupiedSections.has(`${permission.zoneId}:${section}`)
        ),
      }))
      .filter((permission) => permission.sections.length > 0)

    return [...serverPermissions, ...localPermissions]
  }, [permissions, selectedDay, selectedTime, serverPermissions])

  useEffect(() => {
    if (
      hasInitializedSlots.current ||
      !initialFestivalDay ||
      !hasLoadedConfiguredLocations
    ) {
      return
    }
    hasInitializedSlots.current = true

    const configuredLocations = [
      { mode: '주간' as const, locations: configuredDayLocations },
      { mode: '야간' as const, locations: configuredNightLocations },
      { mode: '푸드트럭' as const, locations: configuredTruckLocations },
    ]

    configuredLocations.forEach(({ mode, locations: modeLocations }) => {
      if (modeLocations.length > 0) markModeConfigured(mode)
    })

    setZoneDivisions((previous) => ({
      ...previous,
      ...slotCountsByZone(configuredDayLocations),
      ...slotCountsByZone(configuredNightLocations),
    }))
    Object.entries(slotCountsByZone(configuredTruckLocations)).forEach(
      ([zoneId, count]) => setTruckSlotCount(zoneId, count)
    )
  }, [
    configuredDayLocations,
    configuredNightLocations,
    configuredTruckLocations,
    hasLoadedConfiguredLocations,
    initialFestivalDay,
    markModeConfigured,
    setTruckSlotCount,
    setZoneDivisions,
  ])

  function tryEnterConfigure() {
    if (displayPermissions.length > 0) {
      setShowConfigureBlockModal(true)
    } else {
      setStep('configure')
      setNotice('구역별 섹션 개수를 설정하고 저장하세요')
    }
  }

  async function handleConfigureSave() {
    const { zoneDivisions } = useBoothSectionStore.getState()
    const { slotCounts: truckCounts } = useTruckPlacementStore.getState()

    setNotice('슬롯 생성 중...')

    await Promise.all(
      festivalDays.flatMap((fd) => [
        createLocationSlots.mutateAsync({
          festivalDayId: fd.id,
          type: 'DAY',
          zones: ZONES.map((z) => ({
            zoneLabel: z.id,
            count: zoneDivisions[z.id] ?? z.defaultCount,
          })),
        }),
        createLocationSlots.mutateAsync({
          festivalDayId: fd.id,
          type: 'NIGHT',
          zones: NIGHT_ZONES.map((z) => ({
            zoneLabel: z.id,
            count: zoneDivisions[z.id] ?? z.defaultCount,
          })),
        }),
        createLocationSlots.mutateAsync({
          festivalDayId: fd.id,
          type: 'FOOD_TRUCK',
          zones: TRUCK_ZONES.map((z) => ({
            zoneLabel: z.id,
            count: truckCounts[z.id] ?? z.slotCount,
          })),
        }),
      ])
    )

    markModeConfigured('주간')
    markModeConfigured('야간')
    markModeConfigured('푸드트럭')
    setStep('assign')
    setNotice('지도에서 구역을 드래그해 권한을 부여하세요')
  }

  function truckAssignKey(
    day: number,
    time: TruckTime,
    zoneId: string,
    slot: number
  ) {
    return `${day}:${time}:${zoneId}:${slot}`
  }

  function assignedTruck(zoneId: string, slot: number) {
    const id =
      truckAssignments[truckAssignKey(truckDay, truckTime, zoneId, slot)]
    return trucks.find((truck) => truck.id === id) ?? null
  }

  function handleMapMouseUp() {
    if (
      step === 'assign' &&
      mapMode !== '푸드트럭' &&
      dragState.active &&
      dragState.zoneId &&
      dragState.startIdx !== null &&
      dragState.currentIdx !== null
    ) {
      const lo = Math.min(dragState.startIdx, dragState.currentIdx)
      const hi = Math.max(dragState.startIdx, dragState.currentIdx)
      const zoneId = dragState.zoneId
      const sections = Array.from(
        { length: hi - lo + 1 },
        (_, i) => lo + i
      ).filter(
        (idx) =>
          !displayPermissions.some(
            (p) => p.zoneId === zoneId && p.sections.includes(idx)
          )
      )
      if (sections.length > 0) setAssignModal({ zoneId, sections })
    }
    setDragState({
      zoneId: null,
      startIdx: null,
      currentIdx: null,
      active: false,
    })
  }

  function handlePermissionAssign(orgId: string, category: BoothCategory) {
    if (!assignModal) return
    const org = allOrgs.find((o) => o.id === orgId)!

    addPermission({
      id: String(Date.now()),
      zoneId: assignModal.zoneId,
      sections: assignModal.sections,
      orgId,
      orgName: org.name,
      color: org.color,
      category,
      day: selectedDay,
      time: selectedTime,
    })

    assignModal.sections.forEach((sectionIdx) => {
      const loc = locations.find(
        (l) =>
          locationZoneId(l.zoneLabel) === assignModal.zoneId &&
          l.index === sectionIdx + 1
      )
      if (loc) {
        assignBooth.mutate({
          locationId: String(loc.id),
          body: { boothId: orgId },
        })
      }
    })

    setAssignModal(null)
    setToast(`${org.name}에 권한을 부여했어요`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AdminShell active="booths">
      <AdminTopBar
        title="부스 배치"
        sub={`${step === 'configure' ? '구역 설정' : `${mapMode} · 권한 부여`} · ${displayedNotice}`}
        right={
          step === 'assign' ? (
            <AdminBtn
              icon={I.edit(FESTIV_TOKENS.ink60)}
              onClick={tryEnterConfigure}
            >
              구역 재설정
            </AdminBtn>
          ) : undefined
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* ── Sidebar ── */}
        {step === 'configure' ? (
          <BoothConfigureSidebar
            onSave={handleConfigureSave}
            onDraftChange={(d, t) => {
              setDraftDivisions(d)
              setDraftTruckSlots(t)
            }}
          />
        ) : (
          <BoothAssignSidebar
            orgs={allOrgs}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            onBack={tryEnterConfigure}
            activeMode={mapMode}
            onModeChange={setMapMode}
            selectedTruckZone={selectedTruckZone}
            selectedTruckSlot={selectedTruckSlot}
            onTruckZoneSelect={(id) => {
              setSelectedTruckZone(id)
              setSelectedTruckSlot(null)
            }}
            truckTime={truckTime}
            onTruckTimeChange={(t) => {
              setTruckTime(t)
              setSelectedTruckZone(null)
              setSelectedTruckSlot(null)
            }}
            truckDay={truckDay}
            onTruckDayChange={(d) => {
              setTruckDay(d)
              setSelectedTruckZone(null)
              setSelectedTruckSlot(null)
            }}
            permissions={displayPermissions}
          />
        )}

        {/* ── Map ── */}
        <main
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#E8F4F5] dark:bg-[#0B1A1F]"
          onMouseUp={handleMapMouseUp}
          onMouseLeave={handleMapMouseUp}
        >
          {/* Map mode toggle */}
          <div className="absolute top-3 left-3 z-10 flex gap-1">
            {(['주간', '야간', '푸드트럭'] as BoothMapMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMapMode(m)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[12px] font-bold shadow-sm transition-colors',
                  mapMode === m
                    ? 'bg-cta text-white'
                    : 'bg-surface/85 text-ink backdrop-blur-sm'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {mapMode === '푸드트럭' ? (
            /* ── Truck map ── */
            <div
              className="relative h-full min-h-0"
              style={{ aspectRatio: '822 / 590', maxWidth: '100%' }}
            >
              <img
                src={soongsilTruckMap}
                alt=""
                className="h-full w-full"
                draggable={false}
              />
              {TRUCK_ZONES.map((zone) => {
                const count =
                  step === 'configure'
                    ? (draftTruckSlots[zone.id] ??
                      truckSlotCounts[zone.id] ??
                      zone.slotCount)
                    : (truckSlotCounts[zone.id] ?? zone.slotCount)
                const rotate = truckZoneRotations[zone.id] ?? zone.rotate
                return (
                  <div
                    key={zone.id}
                    className="absolute"
                    style={{
                      left: zone.left,
                      top: zone.top,
                      width: zone.width,
                      height: zone.height,
                      transform: `rotate(${rotate}deg)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <div
                      className={cn(
                        'flex h-full overflow-hidden rounded-sm border border-[rgba(20,26,31,0.22)] shadow-[0_6px_16px_rgba(0,0,0,0.18)]',
                        zone.dir === 'row' ? 'flex-row' : 'flex-col'
                      )}
                      style={{ background: zone.color }}
                    >
                      {Array.from({ length: count }, (_, index) => {
                        const truck = assignedTruck(zone.id, index)
                        const selected =
                          selectedTruckZone === zone.id &&
                          selectedTruckSlot === index
                        const isLast = index === count - 1
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedTruckZone(zone.id)
                              setSelectedTruckSlot(index)
                            }}
                            className={cn(
                              'flex min-h-0 min-w-0 flex-1 items-center justify-center text-[8px] font-extrabold transition-[background,box-shadow]',
                              selected
                                ? 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.95)]'
                                : 'hover:brightness-110'
                            )}
                            style={{
                              background: truck
                                ? zone.color
                                : 'rgba(0,0,0,0.15)',
                              color: FESTIV_TOKENS.ink,
                              ...(isLast
                                ? {}
                                : zone.dir === 'row'
                                  ? {
                                      borderRight:
                                        '1px solid rgba(20,26,31,0.18)',
                                    }
                                  : {
                                      borderBottom:
                                        '1px solid rgba(20,26,31,0.18)',
                                    }),
                            }}
                          >
                            {truck ? (
                              truck.name.slice(0, 3)
                            ) : (
                              <span style={{ color: '#141A1F' }}>
                                #{index + 1}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* ── Day / Night map ── */
            <div
              className={cn('relative h-full min-h-0 transition-transform')}
              style={{
                aspectRatio: mapMode === '주간' ? '1072 / 998' : '1430 / 846',
                maxWidth: '100%',
              }}
            >
              <img
                src={mapMode === '주간' ? soongsilDayMap : soongsilNightMap}
                alt=""
                className="h-full w-full dark:brightness-[0.6] dark:saturate-[0.8]"
              />

              {/* ── Zone overlays ── */}
              {activeZones.map((zone) => {
                const divisions =
                  step === 'configure'
                    ? (draftDivisions[zone.id] ?? zoneDivisions[zone.id])
                    : zoneDivisions[zone.id]
                return (
                  <div
                    key={zone.id}
                    className="absolute z-4 flex rounded-sm"
                    style={{
                      left: zone.left,
                      top: zone.top,
                      width: zone.width,
                      height: zone.height,
                      flexDirection: zone.dir,
                      background: zone.color,
                      border: `1.5px solid rgba(20,26,31,0.22)`,
                    }}
                  >
                    {Array.from({ length: divisions }, (_, idx) => {
                      const perm = displayPermissions.find(
                        (p) => p.zoneId === zone.id && p.sections.includes(idx)
                      )
                      const si = dragState.startIdx
                      const ci = dragState.currentIdx
                      const inDrag =
                        step === 'assign' &&
                        dragState.active &&
                        dragState.zoneId === zone.id &&
                        si !== null &&
                        ci !== null &&
                        idx >= Math.min(si, ci) &&
                        idx <= Math.max(si, ci)
                      const isModalSelected =
                        assignModal !== null &&
                        assignModal.zoneId === zone.id &&
                        assignModal.sections.includes(idx)
                      const isScaled = inDrag || isModalSelected

                      let selLo: number | null = null
                      let selHi: number | null = null
                      if (inDrag && si !== null && ci !== null) {
                        selLo = Math.min(si, ci)
                        selHi = Math.max(si, ci)
                      } else if (isModalSelected && assignModal) {
                        selLo = Math.min(...assignModal.sections)
                        selHi = Math.max(...assignModal.sections)
                      }

                      const isLast = idx === divisions - 1
                      const nextPerm = displayPermissions.find(
                        (p) =>
                          p.zoneId === zone.id && p.sections.includes(idx + 1)
                      )
                      const sameGroup =
                        !!perm && !!nextPerm && perm.id === nextPerm.id
                      const dividerStyle =
                        isLast || isScaled || sameGroup
                          ? {}
                          : zone.dir === 'row'
                            ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                            : { borderBottom: '1px solid rgba(20,26,31,0.18)' }

                      return (
                        <div
                          key={idx}
                          className={cn(
                            'relative flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[9px] font-extrabold',
                            'transition-[background,box-shadow] duration-100',
                            !isScaled &&
                              step === 'assign' &&
                              'hover:ring-[2.5px] hover:ring-inset hover:ring-white/90',
                            step === 'assign'
                              ? 'cursor-crosshair'
                              : 'cursor-default'
                          )}
                          style={{
                            background: perm
                              ? (CAT_COLOR[perm.category] ?? perm.color)
                              : isScaled
                                ? 'rgba(0,0,0,0.22)'
                                : 'rgba(0,0,0,0.15)',
                            boxShadow:
                              isScaled && selLo !== null && selHi !== null
                                ? selectionShadow(idx, selLo, selHi, zone.dir)
                                : perm && !isScaled
                                  ? groupBorder(idx, perm.sections, zone.dir)
                                  : undefined,
                            ...dividerStyle,
                          }}
                          onMouseDown={
                            step === 'assign'
                              ? (e) => {
                                  e.preventDefault()
                                  setDragState({
                                    zoneId: zone.id,
                                    startIdx: idx,
                                    currentIdx: idx,
                                    active: true,
                                  })
                                }
                              : undefined
                          }
                          onMouseEnter={
                            step === 'assign'
                              ? () => {
                                  if (
                                    dragStateRef.current.active &&
                                    dragStateRef.current.zoneId === zone.id
                                  ) {
                                    setDragState((prev) => ({
                                      ...prev,
                                      currentIdx: idx,
                                    }))
                                  }
                                }
                              : undefined
                          }
                        >
                          <span style={{ color: '#141A1F' }}>
                            {mapMode === '야간' ? 'N' : 'D'}
                            {idx + 1}
                          </span>
                          {perm && (
                            <div className="absolute bottom-0.5 right-0.5 size-1 rounded-full bg-white/70" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {/* ── Zone labels ── */}
              {activeZones.map((zone) => (
                <div
                  key={`label-${zone.id}`}
                  className="pointer-events-none absolute z-5"
                  style={{ left: zone.left, top: `calc(${zone.top} - 16px)` }}
                >
                  <div
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.25 py-px text-[9px] font-extrabold text-ink"
                    style={{ background: `${zone.color}EE` }}
                  >
                    <span className="inline-block size-1.25 rounded-full bg-ink opacity-40" />
                    {zone.id}
                  </div>
                </div>
              ))}

              {/* ── Assign hint banner ── */}
              {step === 'assign' && (
                <div
                  className="absolute bottom-6 left-6 rounded-[14px] border px-4 py-2.5 text-[12px] font-semibold text-ink-60 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] backdrop-blur-xl"
                  style={{
                    background: `${FESTIV_TOKENS.coral}18`,
                    borderColor: `${FESTIV_TOKENS.coral}44`,
                  }}
                >
                  <span className="text-ink">구역을 드래그</span>해 선택 후
                  동아리/학생회를 배정하세요
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {toast && <AdminToast message={toast} />}

      {/* ── Configure block modal ── */}
      <AdminModal
        open={showConfigureBlockModal}
        variant="warning"
        title="일자별 권한을 모두 제거해야 해요"
        body="슬롯 구역 설정을 변경하려면 모든 일자의 배정 권한을 먼저 삭제해야 해요. 권한 부여 화면에서 배정을 모두 제거한 후 다시 시도하세요."
        confirmLabel="확인"
        onClose={() => setShowConfigureBlockModal(false)}
      />

      {/* ── Permission modal ── */}
      {assignModal && (
        <BoothPermissionModal
          zoneId={assignModal.zoneId}
          sections={assignModal.sections}
          day={selectedDay}
          time={selectedTime}
          orgs={allOrgs}
          permissions={displayPermissions}
          onClose={() => setAssignModal(null)}
          onAssign={handlePermissionAssign}
        />
      )}
    </AdminShell>
  )
}
