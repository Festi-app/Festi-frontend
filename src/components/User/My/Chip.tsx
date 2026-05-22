import { cn } from '../../../lib/cn'

export function Chip({
  label,
  badge,
  active,
  onClick,
}: {
  label: string
  badge?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.25 rounded-full border px-2.75 py-1.75 text-xs font-bold tracking-[-0.2px]',
        active
          ? 'border-cta bg-cta text-cta-ink'
          : 'border-border bg-surface text-ink-80'
      )}
    >
      {label}
      {badge && (
        <span
          className={cn(
            'rounded-full p-1.5 text-[10px]',
            active ? 'bg-pop text-white' : 'bg-surface-alt text-ink-60'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
