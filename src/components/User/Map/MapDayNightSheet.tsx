import { useState } from 'react'
import type { TouchEventHandler } from 'react'
import type { ZoneDef } from '../../../data/zones'
import type { BoothSummary } from '../../../types/common'
import type { GetBoothResponseDto } from '../../../features/Booth/types/GetBoothResponseDto'
import type { MenuResponseDto } from '../../../features/Booth/types/MenuResponseDto'
import { tabBarPb, tabBarPbTall } from '../../../lib/safeArea'
import { I } from '../../../tokens'
import { Toast } from '../../shared/Toast'
import { useToggleFavorite } from '../../../features/Favorite/hooks/useToggleFavorite'
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
  const { isSaved, toggle } = useToggleFavorite()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)

  function toggleFavorite() {
    if (!linkedBooth) return
    const id = String(linkedBooth.id)
    const wasSaved = isSaved(id)
    toggle(id)
    setToast(wasSaved ? 'unsaved' : 'saved')
    setTimeout(() => setToast(null), 2000)
  }

  const favoriteButton = linkedBooth ? (
    <button
      type="button"
      onClick={toggleFavorite}
      className="flex size-8 items-center justify-center rounded-full bg-surface-alt"
    >
      {I.star(
        isSaved(String(linkedBooth.id)) ? '#FFB800' : 'none',
        isSaved(String(linkedBooth.id)) ? '#FFB800' : '#8A9BA8'
      )}
    </button>
  ) : undefined

  return (
    <>
      <MapSheet
        sheetDragY={sheetDragY}
        sheetDismissing={sheetDismissing}
        expanded={sheetExpanded}
        expandable={!!linkedBooth}
        favoriteButton={favoriteButton}
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
        onDismiss={onDismiss}
        onToggleExpand={onToggleExpand}
      >
        {!sheetExpanded && (
          <>
            {linkedBooth ? (
              <>
                <BoothDetailContent
                  dark={dark}
                  type={isNight ? 'night' : 'day'}
                  name={linkedBooth.name}
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
                {isNight && (
                  <WaitingActions
                    onWaiting={() => onWaiting(linkedBooth.id)}
                    onAlreadyWaiting={() => onAlreadyWaiting(linkedBooth.id)}
                    alreadyWaiting={isAlreadyWaiting(linkedBooth.id)}
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-6 text-[13px] text-ink-40">
                등록된 부스가 없어요
              </div>
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
      {toast && (
        <Toast
          bottom="bottom-6"
          message={
            toast === 'saved' ? '저장되었습니다' : '저장이 취소되었습니다'
          }
          icon={
            toast === 'saved' ? (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert">
                {I.star('#fff', '#fff')}
              </div>
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="#FF6B6B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )
          }
        />
      )}
    </>
  )
}
