import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function AdminBtn({
  children,
  primary,
  ghost,
  icon,
  onClick,
}: {
  children?: ReactNode
  primary?: boolean
  ghost?: boolean
  icon?: ReactElement
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2.25 text-[13px] font-bold tracking-[-0.2px]',
        primary
          ? 'border-cta bg-cta text-cta-ink'
          : ghost
            ? 'border-border bg-transparent text-ink-80'
            : 'border-border bg-surface text-ink-80'
      )}
    >
      {icon && <div className="size-3.5">{icon}</div>}
      {children}
    </button>
  )
}
