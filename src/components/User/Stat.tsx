import type { ReactElement } from 'react'

export function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon?: ReactElement
  color?: string
  dark?: boolean
}) {
  return (
    <div className="flex-1 text-center">
      <div className="mb-0.5 text-[10px] font-semibold text-ink-60">
        {label}
      </div>
      <div
        className="flex items-center justify-center gap-1 text-[15px] font-extrabold tracking-[-0.3px] text-ink"
        style={color ? { color } : undefined}
      >
        {icon && <div className="size-3.25">{icon}</div>}
        {value}
      </div>
    </div>
  )
}
