import { useState } from 'react'
import { ZONES, NIGHT_ZONES } from '../../data/zones'
import { TRUCK_ZONES } from '../../stores/useTruckPlacementStore'
import { useBoothSectionStore } from '../../stores/useBoothSectionStore'
import { useTruckPlacementStore } from '../../stores/useTruckPlacementStore'
import { AdminModal } from './AdminModal'
import { I } from '../../tokens'
import { cn } from '../../lib/cn'

function ZoneRow({
  id,
  label,
  color,
  value,
  onDecrement,
  onIncrement,
}: {
  id: string
  label: string
  color: string
  value: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
      <div className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="w-5 shrink-0 text-[11px] font-extrabold text-ink-40">{id}</span>
      <span className="flex-1 truncate text-[12px] font-bold text-ink">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-sm leading-none text-ink-60"
        >
          −
        </button>
        <span className="w-7 text-center text-[13px] font-extrabold text-ink">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-sm leading-none text-ink-60"
        >
          +
        </button>
      </div>
    </div>
  )
}

function GroupHeader({ title, total, unit }: { title: string; total: number; unit: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-40">
        {title}
      </span>
      <div className="flex-1 border-t border-border" />
      <span className="text-[10px] text-ink-40">
        총 {total}{unit}
      </span>
    </div>
  )
}

export function BoothConfigureSidebar({ onSave }: { onSave: () => void }) {
  const {
    zoneDivisions,
    setZoneDivisions,
    permissions,
    clearPermissionsForZoneBeyond,
  } = useBoothSectionStore()
  const {
    slotCounts: truckSlotCounts,
    setSlotCount: setTruckSlotCount,
    cleanupZoneSlots,
  } = useTruckPlacementStore()

  const [pendingChange, setPendingChange] = useState<(() => void) | null>(null)

  function safeChange(action: () => void) {
    if (permissions.length > 0) {
      setPendingChange(() => action)
    } else {
      action()
    }
  }

  function changeDayNight(zoneId: string, delta: number) {
    const current = zoneDivisions[zoneId] ?? 1
    const next = Math.max(1, current + delta)
    if (next === current) return
    safeChange(() => {
      setZoneDivisions((prev) => ({ ...prev, [zoneId]: next }))
      if (next < current) clearPermissionsForZoneBeyond(zoneId, next)
    })
  }

  function changeTruck(zoneId: string, delta: number) {
    const current = truckSlotCounts[zoneId] ?? 1
    const next = Math.max(1, Math.min(8, current + delta))
    if (next === current) return
    safeChange(() => {
      setTruckSlotCount(zoneId, next)
      if (next < current) cleanupZoneSlots(zoneId, next)
    })
  }

  const dayTotal = ZONES.reduce(
    (s, z) => s + (zoneDivisions[z.id] ?? z.defaultCount),
    0
  )
  const nightTotal = NIGHT_ZONES.reduce(
    (s, z) => s + (zoneDivisions[z.id] ?? z.defaultCount),
    0
  )
  const truckTotal = TRUCK_ZONES.reduce(
    (s, z) => s + (truckSlotCounts[z.id] ?? z.slotCount),
    0
  )

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="text-[15px] font-extrabold text-ink">구역 설정</div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          주간·야간·푸드트럭 섹션 수를 한번에 설정하세요
        </div>
        {permissions.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-alert/8 px-2.5 py-1.5 text-[10px] font-semibold text-alert">
            <span>⚠</span>
            섹션 수 변경 시 기존 배정 권한이 초기화될 수 있어요
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* 주간 */}
        <div className="mb-5">
          <GroupHeader title="주간 구역" total={dayTotal} unit="섹션" />
          <div className="flex flex-col gap-1.5">
            {ZONES.map((zone) => (
              <ZoneRow
                key={zone.id}
                id={zone.id}
                label={zone.name}
                color={zone.color}
                value={zoneDivisions[zone.id] ?? zone.defaultCount}
                onDecrement={() => changeDayNight(zone.id, -1)}
                onIncrement={() => changeDayNight(zone.id, 1)}
              />
            ))}
          </div>
        </div>

        {/* 야간 */}
        <div className="mb-5">
          <GroupHeader title="야간 구역" total={nightTotal} unit="섹션" />
          <div className="flex flex-col gap-1.5">
            {NIGHT_ZONES.map((zone) => (
              <ZoneRow
                key={zone.id}
                id={zone.id}
                label={zone.name}
                color={zone.color}
                value={zoneDivisions[zone.id] ?? zone.defaultCount}
                onDecrement={() => changeDayNight(zone.id, -1)}
                onIncrement={() => changeDayNight(zone.id, 1)}
              />
            ))}
          </div>
        </div>

        {/* 푸드트럭 */}
        <div>
          <GroupHeader title="푸드트럭" total={truckTotal} unit="슬롯" />
          <div className="flex flex-col gap-1.5">
            {TRUCK_ZONES.map((zone) => (
              <ZoneRow
                key={zone.id}
                id={zone.id}
                label={zone.name}
                color={zone.color}
                value={truckSlotCounts[zone.id] ?? zone.slotCount}
                onDecrement={() => changeTruck(zone.id, -1)}
                onIncrement={() => changeTruck(zone.id, 1)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={onSave}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-extrabold text-white',
            'bg-coral'
          )}
        >
          <div className="size-4">{I.check('#fff')}</div>
          저장 · 권한 부여 단계로
        </button>
      </div>

      <AdminModal
        open={pendingChange !== null}
        variant="warning"
        title="기존 배정 권한이 변경될 수 있어요"
        body="섹션 수를 변경하면 이미 배정된 권한 중 일부가 삭제될 수 있어요. 계속 진행하시겠어요?"
        confirmLabel="변경하기"
        cancelLabel="취소"
        onConfirm={() => {
          pendingChange?.()
          setPendingChange(null)
        }}
        onClose={() => setPendingChange(null)}
      />
    </aside>
  )
}
