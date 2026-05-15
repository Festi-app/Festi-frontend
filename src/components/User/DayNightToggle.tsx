import { I } from '../../tokens'
import { useDayNightStore } from '../../stores/useDayNightStore'

export function DayNightToggle() {
  const { isDay, setIsDay } = useDayNightStore()

  return (
    <div className="mt-4.5 flex rounded-full border border-border bg-bg p-0.75 relative">
      {/* 슬라이딩 pill */}
      <div
        className="absolute top-0.75 bottom-0.75 w-[calc(50%-3px)] rounded-full bg-cta"
        style={{
          left: isDay ? '3px' : 'calc(50%)',
          transition: 'left 0.24s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {(
        [
          { id: 'day', label: '주간', ico: I.sun, time: '11-17시' },
          { id: 'night', label: '야간', ico: I.moon, time: '17-22시' },
        ] as const
      ).map((o) => {
        const on = (o.id === 'day') === isDay
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => setIsDay(o.id === 'day')}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-bold tracking-[-0.3px] transition-colors duration-200 ${
              on ? 'text-cta-ink' : 'text-ink-60'
            }`}
          >
            <div className="size-4">{o.ico()}</div>
            {o.label}
            <span
              className={`text-[11px] font-semibold ${on ? 'opacity-60' : 'opacity-80'}`}
            >
              · {o.time}
            </span>
          </button>
        )
      })}
    </div>
  )
}
