import type { ReactElement } from 'react'
import { cn } from '../../lib/cn'

export function Segmented({
  value,
  options,
  icons,
  onChange,
}: {
  value: string
  options: string[]
  icons?: Array<(c?: string) => ReactElement>
  onChange?: (value: string) => void
}) {
  return (
    <div className="inline-flex rounded-[10px] border border-border bg-surface-alt p-0.75">
      {options.map((option, index) => {
        const selected = option === value
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange?.(option)}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold tracking-[-0.2px]',
              selected
                ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(15,42,51,0.06)]'
                : 'text-ink-60'
            )}
          >
            {icons?.[index] && (
              <div className="size-3.25">{icons[index]()}</div>
            )}
            {option}
          </button>
        )
      })}
    </div>
  )
}
