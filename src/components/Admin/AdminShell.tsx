import type { ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'



export function AdminShell({
  active = 'booths',
  children,
}: {
  active?: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg font-festi text-ink">
      <AdminSidebar active={active} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
