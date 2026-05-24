import type { TouchEventHandler } from 'react'
import type { BoothSummary } from '../../../types/common'
import type { GetBoothResponseDto } from '../../../features/Booth/types/GetBoothResponseDto'
import type { MenuResponseDto } from '../../../features/Booth/types/MenuResponseDto'
import type { GetLocationsResponseDto } from '../../../features/Map/types/LocationsResponseDto'
import { TRUCK_ZONES } from '../../../stores/useTruckPlacementStore'
import { getZoneName } from '../../../data/zones'
import { FESTIV_TOKENS } from '../../../tokens'
import { tabBarPb } from '../../../lib/safeArea'
import { StatGrid } from '../StatGrid'
import { MapSheet } from './MapSheet'
import { BoothPinHeader } from './BoothPinHeader'
import { BoothDetailContent } from '../BoothDetailContent'

interface SheetHandlers {
  sheetDragY: number
  sheetDismissing: boolean
  sheetExpanded: boolean
  onSheetTouchStart: TouchEventHandler<HTMLDivElement>
  onSheetTouchMove: TouchEventHandler<HTMLDivElement>
  onSheetTouchEnd: TouchEventHandler<HTMLDivElement>
  onDismiss: () => void
  onToggleExpand: () => void
}

interface Props extends SheetHandlers {
  dark?: boolean
  selectedSection: { zoneId: string; slot: number } | null
  linkedTruckBooth: BoothSummary | null
  selectedUserTruck: BoothSummary | null
  locationsByZone: Record<string, GetLocationsResponseDto[]>
  boothDetail: GetBoothResponseDto | undefined
  boothMenus: MenuResponseDto[]
}

export function MapTruckSheet({
  dark,
  selectedSection,
  linkedTruckBooth,
  selectedUserTruck,
  locationsByZone,
  boothDetail,
  boothMenus,
  sheetDragY,
  sheetDismissing,
  sheetExpanded,
  onSheetTouchStart,
  onSheetTouchMove,
  onSheetTouchEnd,
  onDismiss,
  onToggleExpand,
}: Props) {
  const sheetProps = {
    sheetDragY,
    sheetDismissing,
    expanded: sheetExpanded,
    onTouchStart: onSheetTouchStart,
    onTouchMove: onSheetTouchMove,
    onTouchEnd: onSheetTouchEnd,
    onDismiss,
  }

  // selectedUserTruck 시트
  if (selectedUserTruck) {
    const truckZoneColor =
      TRUCK_ZONES.find((z) => {
        const zoneLocations = locationsByZone[z.id] ?? []
        return zoneLocations.some(
          (l) => l.boothSummary?.id === selectedUserTruck.id
        )
      })?.color ?? FESTIV_TOKENS.sun
    const truckArea = getZoneName(undefined, 'truck')

    return (
      <MapSheet {...sheetProps} onToggleExpand={onToggleExpand}>
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
                id={String(selectedUserTruck.id)}
                description={boothDetail?.description ?? undefined}
                operatingHours={boothDetail?.operatingHours ?? undefined}
                area={truckArea}
                circleColor={truckZoneColor}
                menus={boothMenus}
              />
            </div>
          </div>
        )}
      </MapSheet>
    )
  }

  // selectedSection 시트
  const zone = TRUCK_ZONES.find((z) => z.id === selectedSection?.zoneId)
  if (!zone && !sheetDismissing) return null

  return (
    <MapSheet
      {...sheetProps}
      expandable={!!linkedTruckBooth}
      onToggleExpand={onToggleExpand}
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
                  id={String(linkedTruckBooth.id)}
                  description={boothDetail?.description ?? undefined}
                  operatingHours={boothDetail?.operatingHours ?? undefined}
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
                  id={String(linkedTruckBooth.id)}
                  description={boothDetail?.description ?? undefined}
                  operatingHours={boothDetail?.operatingHours ?? undefined}
                  sections={
                    selectedSection ? [selectedSection.slot] : undefined
                  }
                  area={zone.name}
                  menus={boothMenus}
                  circleColor={zone.color}
                />
              </div>
            </div>
          )}
        </>
      )}
    </MapSheet>
  )
}
