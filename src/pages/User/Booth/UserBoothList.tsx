import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFavoritesStore } from '../../../stores/useFavoritesStore'
import { ScreenHeader } from '../../../components/User/ScreenHeader'
import { FESTIV_TOKENS, I, PhotoSlot } from '../../../tokens'
import { getBoothZoneName } from '../../../data/zones'
import { formatSections } from '../../../lib/format'
import { tabBarPb } from '../../../lib/safeArea'
import { DAY_BOOTHS, NIGHT_BOOTHS, TRUCK_BOOTHS } from '../../../data/booths'

export function UserBoothList() {
  const BOOTH_LIST_CONFIG = {
    night: {
      items: NIGHT_BOOTHS,
      title: '야간 부스',
      base: '/booth?type=night',
    },
    day: { items: DAY_BOOTHS, title: '주간 부스', base: '/booth?type=day' },
    truck: {
      items: TRUCK_BOOTHS,
      title: '푸드트럭',
      base: '/booth?type=truck',
    },
  } as const
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isSaved, toggleSave } = useFavoritesStore()
  const type = (searchParams.get('type') ?? 'night') as
    | 'day'
    | 'night'
    | 'truck'

  const { items, title, base: detailBase } = BOOTH_LIST_CONFIG[type]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title={title} />

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5"
        style={{ paddingBottom: tabBarPb }}
      >
        <div className="flex flex-col gap-3">
          {items.map((b) => {
            const saved = isSaved(type, b.id)
            return (
              <div
                key={b.id}
                onClick={() => navigate(`${detailBase}&id=${b.id}`)}
                className="cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="flex items-stretch gap-3.5 p-3">
                  <div className="size-24 shrink-0 overflow-hidden rounded-[14px]">
                    <PhotoSlot
                      label=""
                      tone={b.tone}
                      radius={14}
                      ratio="1/1"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-start text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                          {b.name}
                        </div>
                        <div className="mt-0.5 text-start text-xs text-ink-60">
                          {getBoothZoneName(b)}
                          {b.sections && b.sections.length > 0 && (
                            <> #{formatSections(b.sections)}</>
                          )}
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
                    {b.description && (
                      <div
                        className="mt-2 text-start text-[11px] text-ink-40"
                        style={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {b.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
