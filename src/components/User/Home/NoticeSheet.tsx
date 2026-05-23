import { useMemo } from 'react'
import { I } from '../../../tokens'
import { useNoticeStore } from '../../../stores/useNoticeStore'
import { tabBarOuterPb } from '../../../lib/safeArea'

export function NoticeSheet({ onClose }: { onClose: () => void }) {
  const { notices } = useNoticeStore()
  const sorted = useMemo(
    () =>
      [...notices].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.createdAt.localeCompare(a.createdAt)
      }),
    [notices]
  )

  return (
    <>
      <div
        className="absolute inset-0 z-55 bg-[rgba(0,0,0,0.4)]"
        style={{ animation: 'festi-fade-in 0.18s ease both' }}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-60 flex flex-col rounded-t-3xl bg-surface"
        style={{
          maxHeight: '70%',
          animation:
            'festi-sheet-up 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div className="size-5 text-ink-80">{I.megaphone()}</div>
            <span className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
              공지사항
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-surface-alt p-1.5 text-ink-60"
          >
            <svg viewBox="0 0 16 16" fill="none" width="100%" height="100%">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div
          className="flex flex-col gap-2 overflow-y-auto px-5"
          style={{ paddingBottom: tabBarOuterPb }}
        >
          {sorted.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-border bg-bg p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                {n.pinned && (
                  <span className="shrink-0 rounded-md bg-cta/15 px-1.5 py-0.5 text-[10px] font-extrabold text-cta">
                    고정
                  </span>
                )}
                <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                  {n.title}
                </div>
                <span className="ml-auto shrink-0 text-[11px] text-ink-40">
                  {n.createdAt.slice(5).replace('-', '.')}
                </span>
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-ink-60">
                {n.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
