import { Toast } from '../shared/Toast'

export function CancelToast({
  show,
  sub,
  bottom,
}: {
  show: boolean
  sub?: string
  bottom?: string
}) {
  if (!show) return null
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-60 bg-[rgba(0,0,0,0.45)]"
        style={{ animation: 'festi-fade-in 0.2s ease both' }}
      />
      <Toast
        bottom={bottom}
        message="웨이팅이 취소되었습니다"
        sub={sub}
        icon={
          <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="#FF6B6B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        }
      />
    </>
  )
}
