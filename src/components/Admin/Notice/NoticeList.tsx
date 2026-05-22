import type { Notice } from '../../../stores/useNoticeStore'
import { NoticeCard } from './NoticeCard'

export function NoticeList({
  notices,
  selectedId,
  onSelect,
  onTogglePin,
  onDelete,
}: {
  notices: Notice[]
  selectedId: string | null
  onSelect: (id: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}) {
  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.createdAt.localeCompare(a.createdAt)
  })

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-3.5">
        <div className="text-[11px] text-ink-40">
          총 <strong className="text-ink">{sorted.length}건</strong>
          {sorted.filter((n) => n.pinned).length > 0 && (
            <span className="ml-2 text-ink-40">
              · 고정{' '}
              <strong className="text-ink">
                {sorted.filter((n) => n.pinned).length}건
              </strong>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {sorted.length === 0 ? (
          <div className="py-12 text-center text-[12px] text-ink-40">
            등록된 공지가 없어요
          </div>
        ) : (
          sorted.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              selected={selectedId === n.id}
              onSelect={() => onSelect(n.id)}
              onTogglePin={() => onTogglePin(n.id)}
              onDelete={() => onDelete(n.id)}
            />
          ))
        )}
      </div>
    </aside>
  )
}
