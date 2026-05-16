import { useState } from 'react'
import { cn } from '../../lib/cn'
import { NoticeCard } from './NoticeCard'
import type { Notice, NoticeType } from '../../stores/useNoticeStore'

type Filter = '전체' | NoticeType

const FILTERS: Filter[] = ['전체', '공지', '이벤트']

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
  const [filter, setFilter] = useState<Filter>('전체')

  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.createdAt.localeCompare(a.createdAt)
  })

  const filtered =
    filter === '전체' ? sorted : sorted.filter((n) => n.type === filter)

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-3.5">
        <div className="mb-3 flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 rounded-xl py-1.5 text-[12px] font-bold transition-colors',
                filter === f
                  ? 'bg-cta text-white'
                  : 'bg-surface-alt text-ink-60'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-ink-40">
          총 <strong className="text-ink">{filtered.length}건</strong>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[12px] text-ink-40">
            등록된 공지가 없어요
          </div>
        ) : (
          filtered.map((n) => (
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
