import { DAY_GRADIENT, I, NIGHT_GRADIENT } from '../../tokens'
import { useDayNightStore } from '../../stores/useDayNightStore'

export function DayNightToggle({ fullWidth = false }: { fullWidth?: boolean }) {
  const { isDay, setIsDay } = useDayNightStore()

  return (
    <div
      className={`mt-4.5 rounded-full border border-border bg-white p-0.75 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] dark:bg-[#13262D]/95 ${
        fullWidth ? 'flex' : 'inline-flex'
      }`}
    >
      {(
        [
          { id: 'day', label: '주간', ico: I.sun, grad: DAY_GRADIENT },
          { id: 'night', label: '야간', ico: I.moon, grad: NIGHT_GRADIENT },
        ] as const
      ).map((o) => {
        const on = (o.id === 'day') === isDay
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => setIsDay(o.id === 'day')}
            className={`flex items-center gap-1.25 rounded-full px-3.5 py-2 text-[13px] font-bold tracking-[-0.2px] transition-colors ${
              fullWidth ? 'flex-1 justify-center' : ''
            } ${on ? 'text-white' : 'text-ink-60'}`}
            style={on ? { background: o.grad } : undefined}
          >
            <div className="size-3.5">{o.ico()}</div>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
