import { cn } from '../../../lib/cn'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5.5 w-9 rounded-full transition-colors',
          checked ? 'bg-cta' : 'bg-ink-20'
        )}
      >
        <div
          className={cn(
            'absolute top-0.75 size-4 rounded-full bg-white shadow-sm transition-all',
            checked ? 'left-4.5' : 'left-0.75'
          )}
        />
      </div>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
    </label>
  )
}
