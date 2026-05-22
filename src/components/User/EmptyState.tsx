import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  sub,
  className,
  compact = false,
}: {
  icon: ReactNode
  title: string
  sub?: string
  className?: string
  compact?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className ?? ''}`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-surface-alt text-ink-40 ${compact ? 'mb-2 size-12' : 'mb-3 size-16'}`}
      >
        <div className={compact ? 'size-5' : 'size-7'}>{icon}</div>
      </div>
      <div
        className={`font-bold text-ink-60 ${compact ? 'text-[13px]' : 'text-[15px]'}`}
      >
        {title}
      </div>
      {sub && (
        <div
          className={`text-ink-40 ${compact ? 'mt-0.5 text-[11px]' : 'mt-1 text-[13px]'}`}
        >
          {sub}
        </div>
      )}
    </div>
  )
}
