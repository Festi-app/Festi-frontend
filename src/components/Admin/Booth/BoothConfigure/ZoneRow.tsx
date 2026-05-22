export function ZoneRow({
  id,
  label,
  color,
  value,
  onDecrement,
  onIncrement,
}: {
  id: string
  label: string
  color: string
  value: number
  onDecrement: () => void
  onIncrement: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
      <div
        className="size-2.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span className="w-5 shrink-0 text-[11px] font-extrabold text-ink-40">
        {id}
      </span>
      <span className="flex-1 truncate text-[12px] font-bold text-ink">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-sm leading-none text-ink-60"
        >
          −
        </button>
        <span className="w-7 text-center text-[13px] font-extrabold text-ink">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-sm leading-none text-ink-60"
        >
          +
        </button>
      </div>
    </div>
  )
}
