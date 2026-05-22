import type { ReactNode } from 'react'

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = '확인',
  cancelLabel = '돌아가기',
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}) {
  if (!open) return null
  return (
    <>
      <div
        className="absolute inset-0 z-60 bg-[rgba(0,0,0,0.45)]"
        style={{ animation: 'festi-fade-in 0.18s ease both' }}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-5 top-1/2 z-70 -translate-y-1/2 rounded-3xl bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
        style={{
          animation:
            'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}
      >
        <div className="mb-1 text-center text-[18px] font-extrabold tracking-[-0.4px] text-ink">
          {title}
        </div>
        <div className="mb-6 text-center text-[13px] leading-normal text-ink-60">
          {body}
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-border bg-surface-alt py-3.5 text-[15px] font-bold text-ink"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-alert py-3.5 text-[15px] font-extrabold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}
