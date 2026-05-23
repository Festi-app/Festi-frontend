import { I } from '../../../tokens'
import { ZONES, NIGHT_ZONES } from '../../../data/zones'
import { TRUCK_ZONES } from '../../../stores/useTruckPlacementStore'
import {
  typeColor,
  typeLabel,
  waitStatus,
} from '../../../features/Map/utils/display'

const ALL_BOOTH_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

type Marker = {
  id: number
  name: string
  zoneId?: string
  type: string
  category?: string
  wait?: number
}

export function MapSearchOverlay({
  searchQuery,
  searchResults,
  onChangeQuery,
  onClose,
  onSelectResult,
}: {
  searchQuery: string
  searchResults: Marker[]
  onChangeQuery: (q: string) => void
  onClose: () => void
  onSelectResult: (m: Marker) => void
}) {
  return (
    <>
      <div
        className="absolute inset-0 z-30 bg-black/40 animate-[festi-fade-in_0.18s_ease_both]"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-0 z-40 bg-surface px-4 pt-5 pb-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] animate-[festi-page-in_0.22s_cubic-bezier(0.25,0.46,0.45,0.94)_both]">
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface-alt px-3.5 py-2.5">
            <div className="size-4.5 text-ink-60">{I.search()}</div>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder="부스 번호 또는 이름"
              className="flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onChangeQuery('')}
                className="size-4 text-ink-40"
              >
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-ink-60"
          >
            취소
          </button>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto overscroll-none">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-40">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {searchResults.map((m) => {
                const ws =
                  m.type === 'night' && m.wait != null
                    ? waitStatus(m.wait)
                    : null
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectResult(m)}
                    className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-colors hover:bg-surface-alt active:bg-surface-alt"
                  >
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                      style={{
                        background:
                          ALL_BOOTH_ZONES.find((z) => z.id === m.zoneId)
                            ?.color ?? typeColor(m.type),
                      }}
                    >
                      {m.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                          {m.name}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-ink-40">
                          {typeLabel(m.type)}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-60">
                        {ALL_BOOTH_ZONES.find((z) => z.id === m.zoneId)?.name}
                      </div>
                    </div>
                    {ws && (
                      <div
                        className="text-[13px] font-extrabold"
                        style={{ color: ws.color }}
                      >
                        {ws.label}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
