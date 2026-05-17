import { FESTI_TOKENS, PhotoSlot, Pill } from '../../tokens'

export function MenuItemCard({
  name,
  desc,
  price,
  tone,
  best = false,
}: {
  name: string
  desc: string
  price: number
  tone: string
  best?: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2">
      <div className="size-16 shrink-0 overflow-hidden rounded-xl">
        <PhotoSlot label="" tone={tone} radius={12} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-bold tracking-[-0.3px] text-ink">
            {name}
          </div>
          {best && (
            <Pill
              color={FESTI_TOKENS.pop}
              ink={FESTI_TOKENS.ink}
              style={{ fontSize: 10 }}
            >
              BEST
            </Pill>
          )}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">{desc}</div>
        <div className="mt-1 text-sm font-extrabold tracking-[-0.3px] text-ink">
          {price.toLocaleString()}
          <span className="text-[11px] font-semibold text-ink-60">원</span>
        </div>
      </div>
    </div>
  )
}
