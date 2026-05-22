import { useState } from 'react'
import { ZONES, NIGHT_ZONES } from '../../../../data/zones'
import { TRUCK_ZONES } from '../../../../stores/useTruckPlacementStore'
import { useBoothSectionStore } from '../../../../stores/useBoothSectionStore'
import { useTruckPlacementStore } from '../../../../stores/useTruckPlacementStore'
import { AdminModal } from '../../AdminModal'
import { I } from '../../../../tokens'
import { cn } from '../../../../lib/cn'
import { GroupHeader } from './GroupHeader'
import { ZoneRow } from './ZoneRow'

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

  const [draftDivisions, setDraftDivisions] = useState<Record<string, number>>(
    () => ({ ...zoneDivisions })
  )
  const [draftTruckSlots, setDraftTruckSlots] = useState<
    Record<string, number>
  >(() => ({ ...truckSlotCounts }))
  const [showConfirm, setShowConfirm] = useState(false)

  const allZones = [...ZONES, ...NIGHT_ZONES]

  function changeDayNight(zoneId: string, delta: number) {
    const zone = allZones.find((z) => z.id === zoneId)
    setDraftDivisions((prev) => {
      const current = prev[zoneId] ?? zone?.defaultCount ?? 1
      const next = Math.max(1, current + delta)
      if (next === current) return prev
      return { ...prev, [zoneId]: next }
    })
  }

  function changeTruck(zoneId: string, delta: number) {
    const zone = TRUCK_ZONES.find((z) => z.id === zoneId)
    setDraftTruckSlots((prev) => {
      const current = prev[zoneId] ?? zone?.slotCount ?? 1
      const next = Math.max(1, Math.min(8, current + delta))
      if (next === current) return prev
      return { ...prev, [zoneId]: next }
    })
  }

  function applyAndSave() {
    const newDivisions: Record<string, number> = {}
    for (const zone of allZones) {
      const current = zoneDivisions[zone.id] ?? zone.defaultCount
      const next = draftDivisions[zone.id] ?? zone.defaultCount
      newDivisions[zone.id] = next
      if (next < current) clearPermissionsForZoneBeyond(zone.id, next)
    }
    setZoneDivisions(() => newDivisions)

    for (const zone of TRUCK_ZONES) {
      const current = truckSlotCounts[zone.id] ?? zone.slotCount
      const next = draftTruckSlots[zone.id] ?? zone.slotCount
      setTruckSlotCount(zone.id, next)
      if (next < current) cleanupZoneSlots(zone.id, next)
    }

    onSave()
  }

  function handleSave() {
    const hasDecrease =
      allZones.some((zone) => {
        const current = zoneDivisions[zone.id] ?? zone.defaultCount
        const next = draftDivisions[zone.id] ?? zone.defaultCount
        return next < current
      }) ||
      TRUCK_ZONES.some((zone) => {
        const current = truckSlotCounts[zone.id] ?? zone.slotCount
        const next = draftTruckSlots[zone.id] ?? zone.slotCount
        return next < current
      })

    if (permissions.length > 0 && hasDecrease) {
      setShowConfirm(true)
    } else {
      applyAndSave()
    }
  }

  const dayTotal = ZONES.reduce(
    (s, z) => s + (draftDivisions[z.id] ?? z.defaultCount),
    0
  )
  const nightTotal = NIGHT_ZONES.reduce(
    (s, z) => s + (draftDivisions[z.id] ?? z.defaultCount),
    0
  )
  const truckTotal = TRUCK_ZONES.reduce(
    (s, z) => s + (draftTruckSlots[z.id] ?? z.slotCount),
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
            섹션 수를 줄이면 저장 시 기존 배정 권한이 초기화될 수 있어요
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
                value={draftDivisions[zone.id] ?? zone.defaultCount}
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
                value={draftDivisions[zone.id] ?? zone.defaultCount}
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
                value={draftTruckSlots[zone.id] ?? zone.slotCount}
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
          onClick={handleSave}
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
        open={showConfirm}
        variant="warning"
        title="기존 배정 권한이 변경될 수 있어요"
        body="섹션 수를 줄인 구역의 기존 배정 권한 일부가 삭제돼요. 계속 진행하시겠어요?"
        confirmLabel="저장하기"
        cancelLabel="취소"
        onConfirm={() => {
          setShowConfirm(false)
          applyAndSave()
        }}
        onClose={() => setShowConfirm(false)}
      />
    </aside>
  )
}
