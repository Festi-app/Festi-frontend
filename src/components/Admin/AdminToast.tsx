import { cn } from '../../lib/cn'

export function AdminToast({
  message,
  variant = 'success',
}: {
  message: string
  variant?: 'success' | 'error' | 'info'
}) {
  const icon = variant === 'success' ? '✓' : variant === 'error' ? '✕' : 'ℹ'

  return (
    <div
      className="fixed bottom-6 left-[calc(50%+7.5rem)] z-[100] -translate-x-1/2"
      style={{
        animation:
          'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
      }}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-[#141A1F] px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
        <div
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold',
            variant === 'success'
              ? 'bg-pop text-white'
              : variant === 'error'
                ? 'bg-alert text-white'
                : 'bg-cta text-white'
          )}
        >
          {icon}
        </div>
        <span className="whitespace-nowrap text-[14px] font-bold text-white">
          {message}
        </span>
      </div>
    </div>
  )
}
