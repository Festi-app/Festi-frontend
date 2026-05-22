import { cn } from '../../../../lib/cn'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
  type TruckTime,
} from '../../../../stores/useTruckPlacementStore'
import { I } from '../../../../tokens'

export function TruckContent({
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

  function assignKey(
    day: number,
    time: TruckTime,
    zoneId: string,
    slot: number
  ) {
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
                truckDay === d
                  ? 'bg-cta text-white'
                  : 'bg-surface-alt text-ink-60'
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
                truckTime === t
                  ? 'bg-cta text-white'
                  : 'bg-surface-alt text-ink-60'
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
              Boolean(
                truckAssignments[assignKey(truckDay, truckTime, zone.id, i)]
              )
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
                  onClick={() => onTruckZoneSelect(isSelected ? null : zone.id)}
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
                        assignKey(
                          truckDay,
                          truckTime,
                          selected.zone!,
                          selected.slot!
                        ),
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
