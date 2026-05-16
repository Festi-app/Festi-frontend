import type { ReactNode } from 'react'

export function AdminTopBar({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  right?: ReactNode
}) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-7 py-4.5">
      <div>
        <div className="text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          {title}
        </div>
        {sub && <div className="mt-0.5 text-xs text-ink-60">{sub}</div>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}
