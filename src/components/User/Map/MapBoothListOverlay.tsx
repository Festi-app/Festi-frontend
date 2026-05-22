import { tabBarPb } from '../../../lib/safeArea'
import { FESTIV_TOKENS } from '../../../tokens'
import { TRUCK_BOOTHS } from '../../../data/booths'
import { ZONES, NIGHT_ZONES } from '../../../data/zones'
import { TRUCK_ZONES } from '../../../stores/useTruckPlacementStore'
import {
  typeColor,
  BOOTH_CATEGORIES,
  BOOTH_CATEGORY_THEMES,
} from '../../../features/User/Map/utils/display'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

type Marker = {
  id: number
  name: string
  zoneId?: string
  type: string
  category?: string
  sections?: number[]
}

export function MapBoothListOverlay({
  listTab,
  listCatFilter,
  listMarkers,
  onClose,
  onChangeTab,
  onChangeCatFilter,
  onSelectBooth,
}: {
  listTab: 'day' | 'night' | 'truck'
  listCatFilter: string | null
  listMarkers: Marker[]
  onClose: () => void
  onChangeTab: (tab: 'day' | 'night' | 'truck') => void
  onChangeCatFilter: (cat: string | null) => void
  onSelectBooth: (
    booth: { id: number; zoneId?: string; sections?: number[] },
    type: 'day' | 'night' | 'truck'
  ) => void
}) {
  return (
    <>
      <div
        className="absolute inset-0 z-20 bg-black/40 animate-[festi-fade-in_0.18s_ease_both]"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-[72vh] flex-col rounded-t-3xl bg-surface shadow-[0_-8px_32px_rgba(15,42,51,0.18)] animate-[festi-sheet-in_0.28s_cubic-bezier(0.25,0.46,0.45,0.94)_both]">
        <div className="pt-2.5">
          <button
            type="button"
            onClick={onClose}
            className="mx-auto block h-1 w-9 rounded-full bg-ink-20"
            aria-label="닫기"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 pt-3 pb-2">
          {(
            [
              { id: 'day', label: '주간', color: FESTIV_TOKENS.pop },
              { id: 'night', label: '야간', color: FESTIV_TOKENS.alert },
              { id: 'truck', label: '푸드트럭', color: FESTIV_TOKENS.sun },
            ] as const
          ).map((tab) => {
            const on = listTab === tab.id
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  onChangeTab(tab.id)
                  onChangeCatFilter(null)
                }}
                className={`rounded-full border px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                  on
                    ? 'border-transparent text-white'
                    : 'border-border bg-surface-alt text-ink-60'
                }`}
                style={on ? { background: tab.color } : undefined}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Category filter chips — 주간만 */}
        {listTab === 'day' && (
          <div className="px-4 pb-2.5">
            <div className="inline-flex items-center gap-0.5 rounded-full bg-white/65 px-1.5 py-1.5 shadow-[0_1px_6px_rgba(20,26,31,0.08)] backdrop-blur-sm dark:bg-[#13262D]/65">
              <button
                type="button"
                onClick={() => onChangeCatFilter(null)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-[-0.2px] transition-colors ${
                  listCatFilter === null
                    ? 'bg-ink text-white dark:bg-white dark:text-ink'
                    : 'text-ink-60'
                }`}
              >
                전체
              </button>
              {BOOTH_CATEGORIES.map((cat) => {
                const theme = BOOTH_CATEGORY_THEMES[cat]
                const active = listCatFilter === cat
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => onChangeCatFilter(cat)}
                    className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-[-0.2px] transition-colors ${active ? 'text-ink' : 'text-ink-60'}`}
                    style={active ? { background: theme.color } : undefined}
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: theme.color }}
                    />
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* List */}
        <div className="relative min-h-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-[linear-gradient(180deg,transparent_0%,var(--color-surface)_100%)]" />
          <div
            className="h-full overflow-y-auto overscroll-none px-4"
            style={{ paddingBottom: tabBarPb }}
          >
            {listTab === 'truck' ? (
              <div className="flex flex-col divide-y divide-border">
                {TRUCK_BOOTHS.map((truck) => {
                  const truckZone = ALL_BOOTH_ZONES.find(
                    (z) => z.id === truck.zoneId
                  )
                  const pinColor = truckZone?.color ?? FESTIV_TOKENS.sun
                  return (
                    <button
                      key={truck.id}
                      type="button"
                      onClick={() => onSelectBooth(truck, 'truck')}
                      className="flex w-full items-center gap-3 py-3.5 text-left"
                    >
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                        style={{ background: pinColor }}
                      >
                        {truck.id}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                          {truck.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-ink-60">
                          {truckZone?.name}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : listMarkers.length === 0 ? (
              <div className="py-10 text-center text-sm text-ink-40">
                부스가 없습니다
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {listMarkers.map((m) => {
                  const pinColor =
                    ALL_BOOTH_ZONES.find((z) => z.id === m.zoneId)?.color ??
                    typeColor(m.type)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onSelectBooth(m, m.type === 'night' ? 'night' : 'day')
                      }
                      className="flex items-center gap-3 py-3.5 text-left"
                    >
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                        style={{ background: pinColor }}
                      >
                        {m.id}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                          {m.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-ink-60">
                          {ALL_BOOTH_ZONES.find((z) => z.id === m.zoneId)?.name}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
