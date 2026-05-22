import type { ReactElement } from 'react'
import { cn } from '../../../lib/cn'

export function TimeRow({
  ico,
  label,
  range,
  selected = false,
}: {
  ico: () => ReactElement
  label: string
  range: string
  dark?: boolean
  selected?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'size-7 rounded-lg border p-1.5',
          selected
            ? 'border-[rgba(20,26,31,0.12)] bg-[rgba(20,26,31,0.08)] text-[#5E676D]'
            : 'border-border bg-surface text-ink-60'
        )}
      >
        {ico()}
      </div>
      <div>
        <div
          className={cn(
            'text-[10px] font-semibold',
            selected ? 'text-[#5E676D]' : 'text-ink-60'
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'font-mono text-[13px] font-bold tracking-[-0.2px]',
            selected ? 'text-[#141A1F]' : 'text-ink'
          )}
        >
          {range}
        </div>
      </div>
    </div>
  )
}
