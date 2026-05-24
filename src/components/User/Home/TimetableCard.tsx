import { FESTIV_TOKENS } from '../../../tokens'
import { toMin } from '../../../lib/time'

type Slot = {
  time: string
  end: string
  name: string
  artist: string
}

const ROW_H = 64

export function TimetableCard({
  slots,
  timetableDay,
  currentDay,
  nowMin,
}: {
  slots: Slot[]
  timetableDay: number
  currentDay: number
  nowMin: number
}) {
  if (!slots.length)
    return (
      <div className="flex items-center justify-center rounded-[20px] border border-border bg-surface py-6 text-[13px] text-ink-40">
        등록된 공연 일정이 없어요
      </div>
    )

  const start = toMin(slots[0].time)
  const end = toMin(slots[slots.length - 1].end)
  const nowPct = Math.min(1, Math.max(0, (nowMin - start) / (end - start)))
  const nowY = nowPct * ROW_H * slots.length
  const showNowBar =
    timetableDay === currentDay && nowMin > start && nowMin < end

  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-border bg-surface"
      style={{ animation: 'festi-fade-in 0.18s ease both' }}
    >
      {slots.map((p, i) => {
        const slotStart = toMin(p.time)
        const slotEnd = toMin(p.end)
        const isNow =
          timetableDay === currentDay && nowMin >= slotStart && nowMin < slotEnd
        return (
          <div
            key={i}
            className={`flex items-center gap-3.5 px-4 ${i < slots.length - 1 ? 'border-b border-border' : ''} ${isNow ? 'bg-pop/4' : ''}`}
            style={{ height: ROW_H }}
          >
            <div
              className={`w-11 shrink-0 text-[13px] font-extrabold tabular-nums tracking-[-0.3px] ${isNow ? 'text-pop' : 'text-ink-60'}`}
            >
              {p.time}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                  {p.name}
                </span>
                {isNow && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold"
                    style={{
                      background: FESTIV_TOKENS.pop + '22',
                      color: FESTIV_TOKENS.pop,
                    }}
                  >
                    진행중
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-60">{p.artist}</div>
            </div>
          </div>
        )
      })}

      {showNowBar && (
        <div
          className="pointer-events-none absolute right-3 left-0 flex items-center gap-1.5"
          style={{ top: nowY }}
        >
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#22C55E,#00C6E0)]" />
          <span className="shrink-0 rounded-full bg-[#22C55E] px-2 py-0.5 text-[10px] font-extrabold text-white">
            지금
          </span>
        </div>
      )}
    </div>
  )
}
