import { formatSections } from '../../../lib/format'
import { I, PhotoSlot } from '../../../tokens'

export function UserBoothListCard({
  name,
  tone,
  zoneName,
  sections,
  description,
  onClick,
}: {
  name?: string
  tone?: string
  zoneName?: string
  sections?: number[]
  description?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[18px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.98]"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-[14px]">
        <PhotoSlot label="" tone={tone} radius={14} ratio="1/1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold tracking-[-0.3px] text-ink">
          {name}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">
          {zoneName}
          {sections && sections.length > 0 && <> #{formatSections(sections)}</>}
        </div>
        {description && (
          <div className="mt-1 truncate text-[11px] text-ink-40">
            {description}
          </div>
        )}
      </div>
      <div className="mt-0.5 size-4 text-ink-40">{I.chev(undefined, 'r')}</div>
    </button>
  )
}
