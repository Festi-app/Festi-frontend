import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToggleFavorite } from '../../../features/Favorite/hooks/useToggleFavorite'
import { ScreenHeader } from '../../../components/User/ScreenHeader'
import { FESTIV_TOKENS, I } from '../../../tokens'
import { tabBarPb } from '../../../lib/safeArea'
import { useLocations } from '../../../features/Map/hooks/useLocations'
import { useFestivalDays } from '../../../features/Festival/hooks/useFestivalDays'
import { Toast } from '../../../components/shared/Toast'
import { formatSections, getZoneName } from '../../../lib/format'
import type { BoothType } from '../../../features/Booth/types/BoothSummaryDto'

const _d = new Date()
const todayStr = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`

const TYPE_MAP: Record<'night' | 'day' | 'truck', BoothType> = {
  night: 'NIGHT',
  day: 'DAY',
  truck: 'FOOD_TRUCK',
}

const CATEGORY_LABEL: Record<string, string> = {
  ACTIVITY: '활동',
  INFO: '정보',
  MARKET: '마켓',
  EXPERIENCE: '체험',
  PROMOTION: '홍보',
  ALCOHOL: '주류',
}

const TITLE_MAP: Record<'night' | 'day' | 'truck', string> = {
  night: '야간 부스',
  day: '주간 부스',
  truck: '푸드트럭',
}

export function UserBoothList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isSaved, toggle } = useToggleFavorite()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)

  function handleToggle(id: string, currentlySaved: boolean) {
    toggle(id)
    setToast(currentlySaved ? 'unsaved' : 'saved')
    setTimeout(() => setToast(null), 2000)
  }
  const type = (searchParams.get('type') ?? 'night') as
    | 'day'
    | 'night'
    | 'truck'
  const { data: festivalDaysList = [] } = useFestivalDays()
  const todayFestivalDay =
    festivalDaysList.find((d) => d.day === todayStr)?.day ?? ''
  const { data: locations = [], isLoading } = useLocations({
    day: todayFestivalDay,
    type: TYPE_MAP[type],
  })
  const booths = useMemo(
    () => locations.filter((l) => l.boothSummary !== null),
    [locations]
  )

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title={TITLE_MAP[type]} />

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5"
        style={{ paddingBottom: tabBarPb }}
      >
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-ink-40">
            불러오는 중...
          </div>
        ) : booths.length === 0 ? (
          <div className="flex h-[70vh] items-center justify-center rounded-[18px] border border-border bg-surface text-[13px] text-ink-40">
            등록된 부스가 없어요
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {booths.map((loc) => {
              const b = loc.boothSummary!
              const saved = isSaved(b.id)
              return (
                <div
                  key={b.id}
                  onClick={() => navigate(`/booth?type=${type}&id=${b.id}`)}
                  className="cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface transition-transform duration-100 active:scale-[0.98]"
                >
                  <div className="flex items-stretch gap-3.5 p-3">
                    <div className="size-24 shrink-0 overflow-hidden rounded-[14px] bg-surface-alt" />
                    <div className="flex min-w-0 flex-1 flex-col pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-start text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                            {b.name}
                          </div>
                          <div className="mt-0.5 text-start text-xs text-ink-60">
                            {getZoneName(loc.zoneLabel) ??
                              CATEGORY_LABEL[b.category] ??
                              b.category}
                            {loc.index != null && (
                              <> #{formatSections([loc.index])}</>
                            )}
                          </div>
                          {b.description && (
                            <div className="mt-1 text-[13px] leading-snug text-ink-60">
                              {b.description}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggle(b.id, saved)
                          }}
                          className="mt-0.5 size-4.5 shrink-0"
                        >
                          {I.star(
                            saved ? FESTIV_TOKENS.alert : undefined,
                            saved ? FESTIV_TOKENS.alert : 'none'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {toast && (
        <Toast
          bottomStyle="calc(6rem + env(safe-area-inset-bottom) + 0.75rem)"
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
    </div>
  )
}
