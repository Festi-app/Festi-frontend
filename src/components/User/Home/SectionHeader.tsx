import { I } from '../../../tokens'

export function SectionHeader({
  title,
  sub,
  more = false,
  onMore,
  className = '',
}: {
  title: string
  sub: string
  dark?: boolean
  more?: boolean
  onMore?: () => void
  className?: string
}) {
  return (
    <div className={`mb-3 flex items-end justify-between px-5 ${className}`}>
      <div>
        <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
          {title}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">{sub}</div>
      </div>
      {more && (
        <button
          type="button"
          onClick={onMore}
          className="flex items-center gap-0.5 text-[13px] font-semibold text-ink-60"
        >
          전체 <div className="size-3">{I.chev(undefined, 'r')}</div>
        </button>
      )}
    </div>
  )
}
