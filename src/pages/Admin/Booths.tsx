import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FESTI_TOKENS, I } from '../../tokens'
import { ZONES, NIGHT_ZONES } from '../../data/zones'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { BoothPermissionModal } from '../../components/Admin/BoothPermissionModal'
import { BoothConfigureSidebar } from '../../components/Admin/BoothConfigureSidebar'
import { BoothAssignSidebar } from '../../components/Admin/BoothAssignSidebar'
import {
  type OrgAccount,
  CATEGORY_COLORS,
} from '../../components/Admin/boothShared'
import { cn } from '../../lib/cn'
import soongsilDayMap from '../../assets/soongsil-day-map.png'
import soongsilNightMap from '../../assets/soongsil-night-map.png'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import { useBoothAdminStore } from '../../stores/useBoothAdminStore'
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
} from '../../stores/useBoothSectionStore'

type BoothMapMode = '주간' | '야간' | '푸드트럭'

// ── Org constants ─────────────────────────────────────────────────────────────

const ORG_LIST: OrgAccount[] = [
  {
    id: 'org1',
    name: '컴퓨터학부',
    type: '동아리',
    color: FESTI_TOKENS.coral,
    applications: [
      { day: 1, time: '주간' },
      { day: 2, time: '야간' },
    ],
  },
  {
    id: 'org2',
    name: '경영대학생회',
    type: '학생회',
    color: FESTI_TOKENS.mint,
    applications: [
      { day: 1, time: '주간' },
      { day: 1, time: '야간' },
      { day: 3, time: '주간' },
    ],
  },
  {
    id: 'org3',
    name: '사범대학생회',
    type: '학생회',
    color: FESTI_TOKENS.sun,
    applications: [
      { day: 2, time: '주간' },
      { day: 3, time: '야간' },
    ],
  },
  {
    id: 'org4',
    name: '의약학부',
    type: '동아리',
    color: FESTI_TOKENS.grape,
    applications: [
      { day: 1, time: '야간' },
      { day: 2, time: '주간' },
    ],
  },
  {
    id: 'org5',
    name: '법과대학생회',
    type: '학생회',
    color: FESTI_TOKENS.rose,
    applications: [
      { day: 2, time: '주간' },
      { day: 2, time: '야간' },
      { day: 3, time: '주간' },
    ],
  },
  {
    id: 'org6',
    name: '글로벌통상학과',
    type: '동아리',
    color: FESTI_TOKENS.leaf,
    applications: [
      { day: 3, time: '주간' },
      { day: 3, time: '야간' },
    ],
  },
  {
    id: 'org7',
    name: '미디어학부',
    type: '동아리',
    color: FESTI_TOKENS.pop,
    applications: [
      { day: 1, time: '주간' },
      { day: 3, time: '야간' },
    ],
  },
]

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
  const storeAccounts = useBoothAdminStore((s) => s.accounts)
  const setBoothLocation = useBoothAdminStore((s) => s.setBoothLocation)

  // Merge hardcoded ORG_LIST with pending/approved booth admin accounts
  const allOrgs: OrgAccount[] = [
    ...ORG_LIST,
    ...storeAccounts
      .filter((a) => a.status !== 'rejected')
      .map((a) => ({
        id: a.id,
        name: a.orgName,
        type: (a.orgType === '동아리/소모임'
          ? '동아리'
          : '학생회') as OrgAccount['type'],
        color: FESTI_TOKENS.mint,
        applications: ([1, 2, 3] as PermDay[]).flatMap((d) =>
          a.operatingTimes.map((t) => ({ day: d, time: t as PermTime }))
        ),
        dayCategory: (a.dayCategory as BoothCategory) || undefined,
      })),
  ]

  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<'configure' | 'assign'>(
    searchParams.get('step') === 'assign' ? 'assign' : 'configure'
  )
  const {
    permissions,
    addPermission,
    removePermission,
    zoneDivisions,
    setZoneDivisions,
  } = useBoothSectionStore()
  const {
    trucks,
    assignments: truckAssignments,
    slotCounts: truckSlotCounts,
    zoneRotations: truckZoneRotations,
    setSlotCount: setTruckSlotCount,
    setAssignment: setTruckAssignment,
    removeAssignment: removeTruckAssignment,
    cleanupZoneSlots: cleanupTruckZoneSlots,
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
  const [selectedTime, setSelectedTime] = useState<PermTime>('주간')
  const [truckTime, setTruckTime] = useState<TruckTime>('야간')
  const [selectedTruckZone, setSelectedTruckZone] = useState<string | null>(
    null
  )
  const [selectedTruckSlot, setSelectedTruckSlot] = useState<number | null>(
    null
  )
  const [notice, setNotice] = useState('구역별 섹션 개수를 설정하고 저장하세요')

  function truckAssignKey(time: TruckTime, zoneId: string, slot: number) {
    return `${time}:${zoneId}:${slot}`
  }

  function assignedTruck(zoneId: string, slot: number) {
    const id = truckAssignments[truckAssignKey(truckTime, zoneId, slot)]
    return trucks.find((truck) => truck.id === id) ?? null
  }

  function assignedTruckIds() {
    return new Set(
      Object.entries(truckAssignments)
        .filter(([key]) => key.startsWith(`${truckTime}:`))
        .map(([, truckId]) => truckId)
    )
  }

  function changeTruckSlotCount(zoneId: string, delta: number) {
    const current = truckSlotCounts[zoneId] ?? 1
    const next = Math.max(1, Math.min(8, current + delta))
    if (next === current) return
    setTruckSlotCount(zoneId, next)
    if (next < current) {
      cleanupTruckZoneSlots(zoneId, next)
      if (
        selectedTruckZone === zoneId &&
        selectedTruckSlot !== null &&
        selectedTruckSlot >= next
      ) {
        setSelectedTruckSlot(null)
      }
    }
  }

  function handleMapMouseUp() {
    if (
      step === 'assign' &&
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
          !permissions.some(
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
    const zone = [...ZONES, ...NIGHT_ZONES].find(
      (z) => z.id === assignModal.zoneId
    )
    const zoneLabel = zone
      ? `${zone.name} (${assignModal.sections.map((s) => s + 1).join(', ')}번)`
      : assignModal.zoneId
    addPermission({
      id: String(Date.now()),
      zoneId: assignModal.zoneId,
      sections: assignModal.sections,
      orgId,
      orgName: org.name,
      color: CATEGORY_COLORS[category],
      category,
      day: selectedDay,
      time: selectedTime,
    })
    // If this org is a registered booth admin account, write location back to store
    if (storeAccounts.some((a) => a.id === orgId)) {
      setBoothLocation(orgId, selectedTime as '주간' | '야간', zoneLabel)
    }
    setAssignModal(null)
    setNotice(`${org.name}에 권한을 부여했어요`)
  }

  return (
    <AdminShell active="booths">
      <AdminTopBar
        title="부스 배치"
        sub={`${mapMode} · ${mapMode === '푸드트럭' ? '푸드트럭 섹션 설정' : step === 'configure' ? '구역 설정' : '권한 부여'} · ${notice}`}
        right={
          mapMode === '푸드트럭' ? (
            <AdminBtn
              primary
              icon={I.check('#fff')}
              onClick={() => setNotice('푸드트럭 배치를 저장했어요')}
            >
              푸드트럭 배치 저장
            </AdminBtn>
          ) : step === 'configure' ? (
            <AdminBtn
              primary
              icon={I.check('#fff')}
              onClick={() => {
                setStep('assign')
                setNotice('지도에서 구역을 드래그해 권한을 부여하세요')
              }}
            >
              저장 · 권한 부여
            </AdminBtn>
          ) : (
            <>
              <AdminBtn
                icon={I.edit(FESTI_TOKENS.ink60)}
                onClick={() => {
                  setStep('configure')
                  setNotice('구역별 섹션 개수를 설정하고 저장하세요')
                }}
              >
                구역 재설정
              </AdminBtn>
              <AdminBtn
                primary
                icon={I.check('#fff')}
                onClick={() => setNotice('권한 설정을 저장했어요')}
              >
                저장
              </AdminBtn>
            </>
          )
        }
      />

      <div className="flex min-h-0 flex-1">
        {mapMode === '푸드트럭' ? (
          <>
            <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
              <div className="border-b border-border px-5 py-4">
                <div className="text-[15px] font-extrabold text-ink">
                  푸드트럭 섹션
                </div>
                <div className="mt-0.5 text-[11px] text-ink-60">
                  구역별 섹션 수와 회전값을 설정하세요
                </div>
                <div className="mt-3 flex gap-1">
                  {(['주간', '야간'] as TruckTime[]).map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setTruckTime(time)
                        setSelectedTruckZone(null)
                        setSelectedTruckSlot(null)
                      }}
                      className={cn(
                        'flex-1 rounded-lg py-1.5 text-[12px] font-bold',
                        truckTime === time
                          ? 'bg-cta text-white'
                          : 'bg-surface-alt text-ink-60'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {TRUCK_ZONES.map((zone) => {
                  const count = truckSlotCounts[zone.id] ?? zone.slotCount
                  const filled = Array.from(
                    { length: count },
                    (_, index) =>
                      !!truckAssignments[
                        truckAssignKey(truckTime, zone.id, index)
                      ]
                  )
                  const selected = selectedTruckZone === zone.id
                  return (
                    <div
                      key={zone.id}
                      className={cn(
                        'mb-2 rounded-xl border p-3',
                        selected
                          ? 'border-cta bg-surface-alt'
                          : 'border-border bg-surface'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTruckZone(zone.id)
                          setSelectedTruckSlot(null)
                        }}
                        className="flex w-full items-center gap-2 text-left"
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: zone.color }}
                        />
                        <div className="flex-1">
                          <div className="text-[13px] font-extrabold text-ink">
                            {zone.label}
                          </div>
                          <div className="text-[11px] text-ink-60">
                            {zone.name}
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-ink-40">
                          {filled.filter(Boolean).length}/{count}
                        </div>
                      </button>

                      <div className="mt-3 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-12 text-[11px] text-ink-60">
                            섹션 수
                          </span>
                          <button
                            type="button"
                            onClick={() => changeTruckSlotCount(zone.id, -1)}
                            className="flex size-6 items-center justify-center rounded-lg border border-border text-ink-60"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-extrabold text-ink">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeTruckSlotCount(zone.id, 1)}
                            className="flex size-6 items-center justify-center rounded-lg border border-border text-ink-60"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {selectedTruckZone && selectedTruckSlot !== null && (
                <div className="border-t border-border p-4">
                  <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
                    업체 배정
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {trucks.map((truck) => {
                      const current =
                        assignedTruck(selectedTruckZone, selectedTruckSlot)
                          ?.id === truck.id
                      const already =
                        assignedTruckIds().has(truck.id) && !current
                      return (
                        <button
                          type="button"
                          key={truck.id}
                          disabled={already}
                          onClick={() =>
                            setTruckAssignment(
                              truckAssignKey(
                                truckTime,
                                selectedTruckZone,
                                selectedTruckSlot
                              ),
                              truck.id
                            )
                          }
                          className={cn(
                            'mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px]',
                            current
                              ? 'bg-cta/10 text-cta'
                              : already
                                ? 'cursor-not-allowed opacity-35'
                                : 'text-ink hover:bg-surface-alt'
                          )}
                        >
                          <span className="flex-1 truncate font-bold">
                            {truck.name}
                          </span>
                          {current && <div className="size-3">{I.check()}</div>}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeTruckAssignment(
                        truckAssignKey(
                          truckTime,
                          selectedTruckZone,
                          selectedTruckSlot
                        )
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-border py-2 text-xs font-bold text-alert"
                  >
                    현재 슬롯 배정 해제
                  </button>
                </div>
              )}
            </aside>

            <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#E8F4F5]">
              <div className="absolute top-3 left-3 z-10 flex gap-1">
                {(['주간', '야간', '푸드트럭'] as BoothMapMode[]).map(
                  (mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setMapMode(mode)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[12px] font-bold shadow-sm transition-colors',
                        mapMode === mode
                          ? 'bg-cta text-white'
                          : 'bg-surface/85 text-ink backdrop-blur-sm'
                      )}
                    >
                      {mode}
                    </button>
                  )
                )}
              </div>
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
                  const count = truckSlotCounts[zone.id] ?? zone.slotCount
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
                                background: truck ? '#2E363C' : 'transparent',
                                color: truck ? '#fff' : FESTI_TOKENS.ink,
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
                              {truck ? truck.name.slice(0, 3) : index + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </main>
          </>
        ) : (
          <>
            {step === 'configure' ? (
              <BoothConfigureSidebar
                zoneDivisions={zoneDivisions}
                setZoneDivisions={setZoneDivisions}
                mapMode={mapMode}
                onSave={() => {
                  setStep('assign')
                  setNotice('지도에서 구역을 드래그해 권한을 부여하세요')
                }}
              />
            ) : (
              <BoothAssignSidebar
                orgs={allOrgs}
                permissions={permissions}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                onDayChange={setSelectedDay}
                onTimeChange={setSelectedTime}
                onRemovePermission={removePermission}
                onBack={() => {
                  setStep('configure')
                  setNotice('구역별 섹션 개수를 설정하고 저장하세요')
                }}
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

              {/* Wrapper = exact image aspect ratio. h-full fills main, width auto-calculated. */}
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
                  const divisions = zoneDivisions[zone.id]
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
                        // in assign step idx == absolute zone number offset (0-based)
                        const perm = permissions.find(
                          (p) =>
                            p.zoneId === zone.id && p.sections.includes(idx)
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
                        // keep scaled while modal is open for this zone's selected sections
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
                        // hide internal dividers inside the selection — outer border handles it
                        const dividerStyle =
                          isLast || isScaled
                            ? {}
                            : zone.dir === 'row'
                              ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                              : {
                                  borderBottom: '1px solid rgba(20,26,31,0.18)',
                                }

                        return (
                          <div
                            key={idx}
                            className={cn(
                              'relative flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[9px] font-extrabold',
                              'transition-[background,box-shadow] duration-100',
                              'text-ink',
                              !isScaled &&
                                step === 'assign' &&
                                'hover:ring-[2.5px] hover:ring-inset hover:ring-white/90',
                              step === 'assign'
                                ? 'cursor-crosshair'
                                : 'cursor-default'
                            )}
                            style={{
                              background: perm
                                ? perm.color
                                : isScaled
                                  ? 'rgba(0,0,0,0.22)'
                                  : 'transparent',
                              boxShadow:
                                isScaled && selLo !== null && selHi !== null
                                  ? selectionShadow(idx, selLo, selHi, zone.dir)
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
                            {idx + 1}
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
                      {zone.name}
                    </div>
                  </div>
                ))}

                {/* ── Assign hint banner ── */}
                {step === 'assign' && (
                  <div
                    className="absolute bottom-6 left-6 rounded-[14px] border px-4 py-2.5 text-[12px] font-semibold text-ink-60 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] backdrop-blur-xl"
                    style={{
                      background: `${FESTI_TOKENS.coral}18`,
                      borderColor: `${FESTI_TOKENS.coral}44`,
                    }}
                  >
                    <span className="text-ink">구역을 드래그</span>해 선택 후
                    동아리/학생회를 배정하세요
                  </div>
                )}
              </div>
              {/* end map wrapper */}
            </main>
          </>
        )}
      </div>

      {/* ── Permission modal ── */}
      {assignModal && (
        <BoothPermissionModal
          zoneId={assignModal.zoneId}
          sections={assignModal.sections}
          day={selectedDay}
          time={selectedTime}
          orgs={allOrgs}
          permissions={permissions}
          onClose={() => setAssignModal(null)}
          onAssign={handlePermissionAssign}
        />
      )}
    </AdminShell>
  )
}
