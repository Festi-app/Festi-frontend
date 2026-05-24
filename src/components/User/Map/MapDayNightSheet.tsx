import type { TouchEventHandler } from 'react'
import type { ZoneDef } from '../../../data/zones'
import type { BoothSummary } from '../../../types/common'
import type { GetBoothResponseDto } from '../../../features/Booth/types/GetBoothResponseDto'
import type { MenuResponseDto } from '../../../features/Booth/types/MenuResponseDto'
import { tabBarPb, tabBarPbTall } from '../../../lib/safeArea'
import { MapSheet } from './MapSheet'
import { WaitingActions } from './WaitingActions'
import { BoothDetailContent } from '../BoothDetailContent'

const API_CAT_TO_KR: Record<string, string> = {
  ACTIVITY: '활동',
  INFO: '정보',
  MARKET: '마켓',
  EXPERIENCE: '체험',
  PROMOTION: '프로모션',
  ALCOHOL: '주류',
}

interface Props {
  dark?: boolean
  mapView: string
  selectedBoothCell: { zoneId: string; slot: number } | null
  selectedBoothZone: ZoneDef
  linkedBooth: BoothSummary | null
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

export function MapDayNightSheet({
  dark,
  mapView,
  selectedBoothCell,
  selectedBoothZone,
  linkedBooth,
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
  const isNight = mapView === 'night'

  return (
    <MapSheet
      sheetDragY={sheetDragY}
      sheetDismissing={sheetDismissing}
      expanded={sheetExpanded}
      expandable={!!linkedBooth}
      onTouchStart={onSheetTouchStart}
      onTouchMove={onSheetTouchMove}
      onTouchEnd={onSheetTouchEnd}
      onDismiss={onDismiss}
      onToggleExpand={onToggleExpand}
    >
      {!sheetExpanded && (
        <>
          {linkedBooth ? (
            <BoothDetailContent
              dark={dark}
              type={isNight ? 'night' : 'day'}
              name={linkedBooth.name}
              id={String(linkedBooth.id)}
              description={boothDetail?.description ?? undefined}
              operatingHours={boothDetail?.operatingHours ?? undefined}
              sections={
                selectedBoothCell ? [selectedBoothCell.slot] : undefined
              }
              category={
                API_CAT_TO_KR[linkedBooth.category] ?? linkedBooth.category
              }
              area={selectedBoothZone.name}
              circleColor={selectedBoothZone.color}
            />
          ) : (
            <div className="my-3 rounded-xl bg-surface-alt px-4 py-3 text-center text-[12px] text-ink-40">
              이 섹션에 배정된 부스가 없어요
            </div>
          )}
          {isNight && linkedBooth && (
            <WaitingActions
              onWaiting={() => onWaiting(linkedBooth.id)}
              onAlreadyWaiting={() => onAlreadyWaiting(linkedBooth.id)}
              alreadyWaiting={isAlreadyWaiting(linkedBooth.id)}
            />
          )}
        </>
      )}

      {sheetExpanded && linkedBooth && (
        <div className="relative h-full overflow-hidden">
          <div
            className="h-full overflow-y-auto overscroll-none px-5 pt-4"
            style={{ paddingBottom: isNight ? tabBarPbTall : tabBarPb }}
          >
            <BoothDetailContent
              dark={dark}
              type={isNight ? 'night' : 'day'}
              name={linkedBooth.name}
              id={String(linkedBooth.id)}
              description={boothDetail?.description ?? undefined}
              operatingHours={boothDetail?.operatingHours ?? undefined}
              sections={
                selectedBoothCell ? [selectedBoothCell.slot] : undefined
              }
              category={
                API_CAT_TO_KR[linkedBooth.category] ?? linkedBooth.category
              }
              area={selectedBoothZone.name}
              menus={boothMenus}
              circleColor={selectedBoothZone.color}
            />
          </div>
          {isNight && (
            <WaitingActions
              sticky
              onWaiting={() => onWaiting(linkedBooth.id)}
              onAlreadyWaiting={() => onAlreadyWaiting(linkedBooth.id)}
              alreadyWaiting={isAlreadyWaiting(linkedBooth.id)}
            />
          )}
        </div>
      )}
    </MapSheet>
  )
}
