import type { TouchEventHandler } from 'react'
import type { GetBoothResponseDto } from '../../../features/Booth/types/GetBoothResponseDto'
import type { MenuResponseDto } from '../../../features/Booth/types/MenuResponseDto'
import { ZONES, NIGHT_ZONES } from '../../../data/zones'
import { TRUCK_ZONES } from '../../../stores/useTruckPlacementStore'
import { tabBarPb, tabBarPbTall } from '../../../lib/safeArea'
import { MapSheet } from './MapSheet'
import { WaitingActions } from './WaitingActions'
import { BoothDetailContent } from '../BoothDetailContent'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

export interface MarkerItem {
  id: string
  name: string
  type: string
  zoneId: string
  sections: number[]
  category: string
}

interface Props {
  dark?: boolean
  selectedMarker: MarkerItem
  boothDetail: GetBoothResponseDto | undefined
  boothMenus: MenuResponseDto[]
  sheetDragY: number
  sheetDismissing: boolean
  sheetExpanded: boolean
  onSheetTouchStart: TouchEventHandler<HTMLDivElement>
  onSheetTouchMove: TouchEventHandler<HTMLDivElement>
  onSheetTouchEnd: TouchEventHandler<HTMLDivElement>
  onDismiss: () => void
  onToggleExpand: () => void
  onWaiting: (boothId: string | number) => void
  onAlreadyWaiting: (boothId: string) => void
  isAlreadyWaiting: (boothId: string) => boolean
}

export function MapMarkerSheet({
  dark,
  selectedMarker,
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
  onWaiting,
  onAlreadyWaiting,
  isAlreadyWaiting,
}: Props) {
  const isNight = selectedMarker.type === 'night'
  const zoneList =
    selectedMarker.type === 'truck' ? TRUCK_ZONES : ALL_BOOTH_ZONES
  const area = zoneList.find((z) => z.id === selectedMarker.zoneId)?.name
  const circleColor = zoneList.find(
    (z) => z.id === selectedMarker.zoneId
  )?.color

  return (
    <MapSheet
      sheetDragY={sheetDragY}
      sheetDismissing={sheetDismissing}
      expanded={sheetExpanded}
      expandable
      onTouchStart={onSheetTouchStart}
      onTouchMove={onSheetTouchMove}
      onTouchEnd={onSheetTouchEnd}
      onDismiss={onDismiss}
      onToggleExpand={onToggleExpand}
    >
      {!sheetExpanded && (
        <>
          <BoothDetailContent
            dark={dark}
            type={selectedMarker.type}
            id={String(selectedMarker.id)}
            description={boothDetail?.description ?? undefined}
            operatingHours={boothDetail?.operatingHours ?? undefined}
            name={selectedMarker.name}
            sections={selectedMarker.sections}
            category={selectedMarker.category}
            area={area}
            circleColor={circleColor}
          />
          {isNight && (
            <WaitingActions
              onWaiting={() => onWaiting(selectedMarker.id)}
              onAlreadyWaiting={() =>
                onAlreadyWaiting(String(selectedMarker.id))
              }
              alreadyWaiting={isAlreadyWaiting(String(selectedMarker.id))}
            />
          )}
        </>
      )}

      {sheetExpanded && (
        <div className="relative h-full overflow-hidden">
          <div
            className="h-full overflow-y-auto overscroll-none px-5 pt-4"
            style={{ paddingBottom: isNight ? tabBarPbTall : tabBarPb }}
          >
            <BoothDetailContent
              dark={dark}
              type={selectedMarker.type}
              id={String(selectedMarker.id)}
              description={boothDetail?.description ?? undefined}
              operatingHours={boothDetail?.operatingHours ?? undefined}
              name={selectedMarker.name}
              sections={selectedMarker.sections}
              category={selectedMarker.category}
              area={area}
              circleColor={circleColor}
              menus={boothMenus}
            />
          </div>
          {isNight && (
            <WaitingActions
              sticky
              onWaiting={() => onWaiting(selectedMarker.id)}
              onAlreadyWaiting={() =>
                onAlreadyWaiting(String(selectedMarker.id))
              }
              alreadyWaiting={isAlreadyWaiting(String(selectedMarker.id))}
            />
          )}
        </div>
      )}
    </MapSheet>
  )
}
