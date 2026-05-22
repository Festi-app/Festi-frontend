import type { ReactNode } from 'react'

export function Card({
  title,
  right,
  children,
}: {
  title?: string
  right?: ReactNode
  children: ReactNode
  dark?: boolean
}) {
  return (
    <section className="rounded-[18px] border border-border bg-surface p-4.5">
      {(title || right) && (
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink">
            {title}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}
