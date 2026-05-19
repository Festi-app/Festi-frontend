import { ZONES, NIGHT_ZONES } from '../../data/zones'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
  type TruckTime,
} from '../../stores/useTruckPlacementStore'
import {
  useBoothSectionStore,
  type PermDay,
  type PermTime,
  type BoothMapMode,
} from '../../stores/useBoothSectionStore'
import { FESTIV_TOKENS, I, Pill } from '../../tokens'
import { cn } from '../../lib/cn'
import { type OrgAccount, CATEGORY_COLORS } from './boothShared'

const ALL_ZONES = [...ZONES, ...NIGHT_ZONES]

// ── Mode tab bar ─────────────────────────────────────────────────────────────

function ModeTabs({
  active,
  onChange,
}: {
  active: BoothMapMode
  onChange: (m: BoothMapMode) => void
}) {
  const modes: BoothMapMode[] = ['주간', '야간', '푸드트럭']
  return (
    <div className="flex gap-1 border-b border-border px-4 py-3">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            'flex-1 rounded-xl py-1.5 text-[12px] font-bold transition-colors',
            active === m ? 'bg-cta text-white' : 'bg-surface-alt text-ink-60'
          )}
        >
          {m}
        </button>
      ))}
    </div>
  )
}

// ── Day/Night permission content ─────────────────────────────────────────────

function DayNightContent({
  orgs,
  selectedDay,
  onDayChange,
  activeMode,
}: {
  orgs: OrgAccount[]
  selectedDay: PermDay
  onDayChange: (d: PermDay) => void
  activeMode: BoothMapMode
}) {
  const { permissions, removePermission } = useBoothSectionStore()
  const time: PermTime = activeMode === '야간' ? '야간' : '주간'

  const slotOrgs = orgs.filter((o) =>
    o.applications.some(
      (a) => a.day === selectedDay && a.time === time
    )
  )

  return (
    <>
      {/* Day selector */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          일자 선택
        </div>
        <div className="flex gap-1">
          {([1, 2, 3] as PermDay[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDayChange(d)}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                selectedDay === d
                  ? 'bg-cta text-white'
                  : 'bg-surface-alt text-ink-60'
              )}
            >
              {d}일차
            </button>
          ))}
        </div>
      </div>

      {/* Slot orgs */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          {selectedDay}일차 {time} 신청 ({slotOrgs.length}개)
        </div>
        {slotOrgs.length === 0 ? (
          <div className="py-2 text-center text-[11px] text-ink-40">
            신청 부스 없음
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {slotOrgs.map((org) => {
              const assigned = permissions
                .filter(
                  (p) =>
                    p.orgId === org.id &&
                    p.day === selectedDay &&
                    p.time === time
                )
                .reduce((sum, p) => sum + p.sections.length, 0)
              return (
                <div
                  key={org.id}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={{
                    background: assigned > 0 ? `${org.color}15` : undefined,
                  }}
                >
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: org.color }}
                  />
                  <span className="flex-1 truncate text-[12px] font-bold text-ink">
                    {org.name}
                  </span>
                  {assigned > 0 ? (
                    <Pill color={`${org.color}22`} ink={org.color}>
                      {assigned}칸
                    </Pill>
                  ) : (
                    <span className="text-[10px] text-ink-40">미배정</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Permission list */}
      <div className="flex-1 overflow-y-auto p-4">
        {permissions.length === 0 ? (
          <div className="py-8 text-center text-[12px] text-ink-40">
            아직 권한이 부여된 부스가 없어요
            <br />
            구역을 드래그해보세요
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              배정 목록 ({permissions.length}건)
            </div>
            {permissions.map((p) => {
              const zone = ALL_ZONES.find((z) => z.id === p.zoneId)!
              const showCategory = p.time === '주간'
              return (
                <div key={p.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-0.5 size-2.5 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-bold text-ink">
                          {p.orgName}
                        </span>
                        {showCategory && (
                          <span
                            className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white"
                            style={{ background: CATEGORY_COLORS[p.category] }}
                          >
                            {p.category}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-60">
                        {zone?.id ?? p.zoneId} · {p.day}일차 {p.time} ·{' '}
                        {p.sections.length}개 섹션
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePermission(p.id)}
                      className="ml-1 mt-0.5 shrink-0"
                    >
                      <div className="size-4">
                        {I.trash(FESTIV_TOKENS.ink40)}
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ── FoodTruck content ─────────────────────────────────────────────────────────

function TruckContent({
  truckDay,
  onTruckDayChange,
  truckTime,
  onTruckTimeChange,
  selectedTruckZone,
  selectedTruckSlot,
  onTruckZoneSelect,
}: {
  truckDay: number
  onTruckDayChange: (d: number) => void
  truckTime: TruckTime
  onTruckTimeChange: (t: TruckTime) => void
  selectedTruckZone: string | null
  selectedTruckSlot: number | null
  onTruckZoneSelect: (id: string | null) => void
}) {
  const {
    trucks,
    assignments: truckAssignments,
    slotCounts: truckSlotCounts,
    setAssignment,
    removeAssignment,
  } = useTruckPlacementStore()

  function assignKey(day: number, time: TruckTime, zoneId: string, slot: number) {
    return `${day}:${time}:${zoneId}:${slot}`
  }

  function assignedTruck(zoneId: string, slot: number) {
    const id = truckAssignments[assignKey(truckDay, truckTime, zoneId, slot)]
    return trucks.find((t) => t.id === id) ?? null
  }

  function assignedTruckIds() {
    return new Set(
      Object.entries(truckAssignments)
        .filter(([k]) => k.startsWith(`${truckDay}:${truckTime}:`))
        .map(([, id]) => id)
    )
  }

  const selected = {
    zone: selectedTruckZone,
    slot: selectedTruckSlot,
  }

  return (
    <>
      {/* Day selector */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          일자 선택
        </div>
        <div className="mb-3 flex gap-1">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                onTruckDayChange(d)
                onTruckZoneSelect(null)
              }}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                truckDay === d ? 'bg-cta text-white' : 'bg-surface-alt text-ink-60'
              )}
            >
              {d}일차
            </button>
          ))}
        </div>
        <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          시간 선택
        </div>
        <div className="flex gap-1">
          {(['주간', '야간'] as TruckTime[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onTruckTimeChange(t)
                onTruckZoneSelect(null)
              }}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                truckTime === t ? 'bg-cta text-white' : 'bg-surface-alt text-ink-60'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Zone list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          구역 목록
        </div>
        <div className="flex flex-col gap-2">
          {TRUCK_ZONES.map((zone) => {
            const count = truckSlotCounts[zone.id] ?? zone.slotCount
            const filledCount = Array.from({ length: count }, (_, i) =>
              Boolean(truckAssignments[assignKey(truckDay, truckTime, zone.id, i)])
            ).filter(Boolean).length
            const isSelected = selected.zone === zone.id

            return (
              <div
                key={zone.id}
                className={cn(
                  'rounded-xl border p-3',
                  isSelected ? 'border-cta bg-surface-alt' : 'border-border'
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    onTruckZoneSelect(isSelected ? null : zone.id)
                  }
                  className="flex w-full items-center gap-2 text-left"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: zone.color }}
                  />
                  <div className="flex-1">
                    <div className="text-[13px] font-extrabold text-ink">
                      {zone.id}
                    </div>
                    <div className="text-[11px] text-ink-60">{zone.name}</div>
                  </div>
                  <div className="text-[11px] font-bold text-ink-40">
                    {filledCount}/{count}
                  </div>
                </button>

                {/* Slot pills */}
                {isSelected && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.from({ length: count }, (_, i) => {
                      const truck = assignedTruck(zone.id, i)
                      const isSlotSelected = selected.slot === i
                      return (
                        <div
                          key={i}
                          className={cn(
                            'rounded-lg px-2 py-1 text-[10px] font-extrabold',
                            isSlotSelected
                              ? 'bg-cta text-white'
                              : truck
                                ? 'bg-ink/10 text-ink'
                                : 'border border-border bg-surface text-ink-40'
                          )}
                        >
                          #{i + 1}
                          {truck ? ` · ${truck.name}` : ''}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Truck assignment panel */}
        {selected.zone !== null && selected.slot !== null && (
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              {selected.zone} #{selected.slot + 1} 업체 배정
            </div>
            <div className="flex flex-col gap-1">
              {trucks.map((truck) => {
                const current =
                  assignedTruck(selected.zone!, selected.slot!)?.id === truck.id
                const already = assignedTruckIds().has(truck.id) && !current
                return (
                  <button
                    key={truck.id}
                    type="button"
                    disabled={already}
                    onClick={() =>
                      setAssignment(
                        assignKey(truckDay, truckTime, selected.zone!, selected.slot!),
                        truck.id
                      )
                    }
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px]',
                      current
                        ? 'bg-cta/10 text-cta'
                        : already
                          ? 'cursor-not-allowed opacity-35 text-ink'
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
                removeAssignment(
                  assignKey(truckDay, truckTime, selected.zone!, selected.slot!)
                )
              }
              className="mt-2 w-full rounded-xl border border-border py-2 text-[12px] font-bold text-alert"
            >
              배정 해제
            </button>
          </div>
        )}

        {selected.zone !== null && selected.slot === null && (
          <p className="mt-4 text-center text-[11px] text-ink-40">
            지도에서 슬롯을 클릭하세요
          </p>
        )}
      </div>
    </>
  )
}

// ── Main sidebar ─────────────────────────────────────────────────────────────

export function BoothAssignSidebar({
  orgs,
  selectedDay,
  onDayChange,
  onBack,
  activeMode,
  onModeChange,
  selectedTruckZone,
  selectedTruckSlot,
  onTruckZoneSelect,
  truckTime,
  onTruckTimeChange,
  truckDay,
  onTruckDayChange,
}: {
  orgs: OrgAccount[]
  selectedDay: PermDay
  onDayChange: (d: PermDay) => void
  onBack: () => void
  activeMode: BoothMapMode
  onModeChange: (m: BoothMapMode) => void
  selectedTruckZone: string | null
  selectedTruckSlot: number | null
  onTruckZoneSelect: (id: string | null) => void
  truckTime: TruckTime
  onTruckTimeChange: (t: TruckTime) => void
  truckDay: number
  onTruckDayChange: (d: number) => void
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-ink-60"
        >
          ← 구역 설정으로
        </button>
        <div className="text-[15px] font-extrabold text-ink">권한 부여</div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          {activeMode !== '푸드트럭'
            ? '구역을 드래그해 선택 후 배정하세요'
            : '지도에서 슬롯을 클릭해 업체를 배정하세요'}
        </div>
      </div>

      {/* Mode tabs */}
      <ModeTabs active={activeMode} onChange={onModeChange} />

      {/* Content */}
      {activeMode !== '푸드트럭' ? (
        <DayNightContent
          orgs={orgs}
          selectedDay={selectedDay}
          onDayChange={onDayChange}
          activeMode={activeMode}
        />
      ) : (
        <TruckContent
          truckDay={truckDay}
          onTruckDayChange={onTruckDayChange}
          truckTime={truckTime}
          onTruckTimeChange={onTruckTimeChange}
          selectedTruckZone={selectedTruckZone}
          selectedTruckSlot={selectedTruckSlot}
          onTruckZoneSelect={onTruckZoneSelect}
        />
      )}
    </aside>
  )
}
