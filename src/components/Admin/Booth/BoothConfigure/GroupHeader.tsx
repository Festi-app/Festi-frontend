export function GroupHeader({
  title,
  total,
  unit,
}: {
  title: string
  total: number
  unit: string
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-40">
        {title}
      </span>
      <div className="flex-1 border-t border-border" />
      <span className="text-[10px] text-ink-40">
        총 {total}
        {unit}
      </span>
    </div>
  )
}
