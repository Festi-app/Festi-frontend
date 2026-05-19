import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function AdminModal({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = '취소',
  onConfirm,
  onClose,
  variant = 'confirm',
}: {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onClose: () => void
  variant?: 'confirm' | 'warning' | 'info'
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(20,26,31,0.55)',
        animation: 'festi-fade-in 0.18s ease both',
      }}
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-surface shadow-[0_24px_60px_rgba(20,26,31,0.28)]"
        style={{ animation: 'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-5">
          {variant !== 'confirm' && (
            <div
              className={cn(
                'mb-3 flex size-10 items-center justify-center rounded-2xl text-xl',
                variant === 'warning' ? 'bg-alert/10' : 'bg-cta/10'
              )}
            >
              {variant === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
          )}
          <div className="mb-2 text-[18px] font-extrabold tracking-[-0.4px] text-ink">
            {title}
          </div>
          <div className="text-[13px] leading-relaxed text-ink-60">{body}</div>
        </div>
        <div className="flex gap-2 border-t border-border px-6 py-4">
          {onConfirm ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-border bg-surface-alt py-3 text-[14px] font-bold text-ink"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  'flex-1 rounded-2xl py-3 text-[14px] font-extrabold text-white',
                  variant === 'warning' ? 'bg-alert' : 'bg-cta'
                )}
              >
                {confirmLabel ?? '확인'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-cta py-3 text-[14px] font-extrabold text-white"
            >
              {confirmLabel ?? '확인'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
