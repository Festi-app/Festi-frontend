export function StatGrid({
  stats,
  className,
}: {
  stats: { label: string; value: string; sub?: string }[]
  className?: string
}) {
  const gridCols =
    stats.length === 1
      ? ''
      : stats.length === 2
        ? 'grid grid-cols-2'
        : 'grid grid-cols-3'

  return (
    <div
      className={`rounded-2xl bg-surface-alt py-3 ${gridCols} ${className ?? ''}`}
    >
      {stats.map((x, i) => (
        <div
          key={i}
          className={`text-center ${i < stats.length - 1 ? 'border-r border-border' : ''}`}
        >
          <div className="text-[11px] font-semibold text-ink-60">{x.label}</div>
          <div className="mt-1 text-[17px] font-extrabold tracking-[-0.3px] text-ink">
            {x.value}
          </div>
          {x.sub && (
            <div className="mt-0.5 text-[10px] text-ink-40">{x.sub}</div>
          )}
        </div>
      ))}
    </div>
  )
}
