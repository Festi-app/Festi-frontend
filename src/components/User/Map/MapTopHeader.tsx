import { DAY_GRADIENT, FESTIV_TOKENS, I, NIGHT_GRADIENT } from '../../../tokens'

export type MapView = 'day' | 'night' | 'truck'

export function MapTopHeader({
  mapView,
  selectedFestivalDay,
  currentDayLabel,
  dayLabels,
  dayDropdownOpen,
  onSearchOpen,
  onOpenList,
  onChangeMapView,
  onToggleDayDropdown,
  onSelectDay,
}: {
  mapView: MapView
  selectedFestivalDay: string
  currentDayLabel: string
  dayLabels: string[]
  dayDropdownOpen: boolean
  onSearchOpen: () => void
  onOpenList: () => void
  onChangeMapView: (view: MapView) => void
  onToggleDayDropdown: () => void
  onSelectDay: (day: string) => void
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0)_100%)] px-4 pt-5 pb-2 dark:bg-[linear-gradient(180deg,rgba(11,26,31,0.97)_0%,rgba(11,26,31,0)_100%)]">
      <div className="mb-2 flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex flex-1 items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-left shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-white/5"
        >
          <div className="size-4.5 text-ink-60">{I.search()}</div>
          <div className="text-sm font-medium text-ink-60">
            부스 번호 또는 이름
          </div>
        </button>
        <button
          type="button"
          onClick={onOpenList}
          className="flex size-11 items-center justify-center rounded-full bg-cta text-cta-ink shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]"
        >
          <div className="size-5">{I.list()}</div>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-full border border-border bg-white p-0.75 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-[#13262D]/95">
          {[
            {
              id: 'day' as MapView,
              label: '주간',
              ico: I.sun,
              grad: DAY_GRADIENT,
            },
            {
              id: 'night' as MapView,
              label: '야간',
              ico: I.moon,
              grad: NIGHT_GRADIENT,
            },
            {
              id: 'truck' as MapView,
              label: '푸드트럭',
              ico: I.truck,
              grad: FESTIV_TOKENS.sun,
            },
          ].map((o) => {
            const on = o.id === mapView
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => onChangeMapView(o.id)}
                className={`flex items-center gap-1.25 rounded-full px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] ${on ? 'text-white' : 'text-ink-60'}`}
                style={on ? { background: o.grad } : undefined}
              >
                <div className="size-3.5">{o.ico()}</div>
                {o.label}
              </button>
            )
          })}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleDayDropdown}
            className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border bg-white/80 px-3 py-2 text-[13px] font-bold tracking-[-0.2px] text-ink shadow-[0_1px_8px_rgba(20,26,31,0.10)] backdrop-blur-sm dark:border-white/30 dark:bg-white/15 dark:text-white"
          >
            {selectedFestivalDay}
            {selectedFestivalDay === currentDayLabel && (
              <span className="size-1.5 shrink-0 rounded-full bg-pop" />
            )}
            <svg
              viewBox="0 0 12 12"
              width="12"
              height="12"
              fill="none"
              style={{
                transform: dayDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }}
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {dayDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5 min-w-24 overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_4px_20px_rgba(20,26,31,0.15)] dark:bg-[#13262D]">
              {dayLabels.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => onSelectDay(d)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-bold tracking-[-0.2px] ${selectedFestivalDay === d ? 'text-ink' : 'text-ink-60'}`}
                >
                  {d}
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${d === currentDayLabel ? 'bg-pop' : 'bg-transparent'}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
