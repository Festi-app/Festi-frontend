import type { ReactNode } from 'react'

export function Toast({
  icon,
  message,
  sub,
  bottom = 'bottom-28',
}: {
  icon: ReactNode
  message: string
  sub?: string
  bottom?: string
}) {
  return (
    <div
      className={`absolute inset-x-5 ${bottom} z-70 flex items-center gap-3 rounded-[20px] bg-[#141A1F] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]`}
      style={{
        animation:
          'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
      }}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>
      <div>
        <div className="text-[14px] font-extrabold tracking-[-0.3px] text-white">
          {message}
        </div>
        {sub && <div className="mt-0.5 text-[11px] text-white/60">{sub}</div>}
      </div>
    </div>
  )
}
