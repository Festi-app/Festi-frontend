import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFavoritesStore } from '../../../stores/useFavoritesStore'
import { ScreenHeader } from '../../../components/User/ScreenHeader'
import { FESTIV_TOKENS, I } from '../../../tokens'
import { tabBarPb } from '../../../lib/safeArea'
import { useBooths } from '../../../features/Booth/hooks/useBooths'
import type { BoothType } from '../../../features/Booth/types/BoothSummaryDto'

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
  const { isSaved, toggleSave } = useFavoritesStore()
  const type = (searchParams.get('type') ?? 'night') as
    | 'day'
    | 'night'
    | 'truck'
  const { data: booths = [], isLoading } = useBooths({ type: TYPE_MAP[type] })

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
        ) : (
          <div className="flex flex-col gap-3">
            {booths.map((b) => {
              const saved = isSaved(type, b.id)
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
                            {CATEGORY_LABEL[b.category] ?? b.category}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSave(type, b.id)
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
    </div>
  )
}
