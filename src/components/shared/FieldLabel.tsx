import type { ReactNode } from 'react'

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 mb-2 text-[13px] font-bold tracking-[-0.2px] text-ink-80">
      {children}
    </div>
  )
}
