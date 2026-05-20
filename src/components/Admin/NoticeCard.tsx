import { I } from '../../tokens'
import { cn } from '../../lib/cn'
import type { Notice } from '../../stores/useNoticeStore'

export function NoticeCard({
  notice,
  selected,
  onSelect,
  onTogglePin,
  onDelete,
}: {
  notice: Notice
  selected: boolean
  onSelect: () => void
  onTogglePin: () => void
  onDelete: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-2xl border p-3.5 text-left transition-all',
        selected
          ? 'border-cta bg-cta/5'
          : 'border-border bg-surface hover:border-ink-20'
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {notice.pinned && (
          <span className="text-[10px] font-bold text-ink-40">📌 고정</span>
        )}
      </div>

      <div className="mb-1 line-clamp-1 text-[14px] font-bold tracking-[-0.2px] text-ink">
        {notice.title}
      </div>
      <div className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-ink-60">
        {notice.content}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-ink-40">{notice.createdAt}</span>
        <div
          className="flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onTogglePin}
            title={notice.pinned ? '고정 해제' : '상단 고정'}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg transition-colors',
              notice.pinned
                ? 'bg-ink/8 text-ink'
                : 'text-ink-40 hover:bg-surface-alt'
            )}
          >
            <div className="size-3.5">
              {I.star(notice.pinned ? '#141A1F' : '#C5CDD6')}
            </div>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex size-7 items-center justify-center rounded-lg text-ink-40 transition-colors hover:bg-alert/10 hover:text-alert"
          >
            <div className="size-3.5">{I.trash()}</div>
          </button>
        </div>
      </div>
    </button>
  )
}
