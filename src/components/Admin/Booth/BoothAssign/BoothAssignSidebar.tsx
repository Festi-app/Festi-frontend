import { type TruckTime } from '../../../../stores/useTruckPlacementStore'
import {
  type BoothPermission,
  type PermDay,
  type BoothMapMode,
} from '../../../../stores/useBoothSectionStore'

import { type OrgAccount } from '../boothShared'
import { DayNightContent } from './DayNightContent'
import { ModeTabs } from './ModeTabs'
import { TruckContent } from './FoodTruckContent'

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
  permissions,
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
  permissions: BoothPermission[]
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
          permissions={permissions}
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
