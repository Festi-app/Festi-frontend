import { FESTIV_TOKENS, PhotoSlot, Pill } from '../../tokens'

export function MenuItemCard({
  name,
  desc,
  price,
  tone,
  best = false,
  soldOut = false,
  showImage = false,
  priceDisplay,
}: {
  name: string
  desc: string
  price: number
  tone: string
  best?: boolean
  soldOut?: boolean
  showImage?: boolean
  priceDisplay?: string
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-border bg-surface p-2 ${soldOut ? 'opacity-50' : ''}`}
    >
      {showImage && (
        <div className="size-16 shrink-0 overflow-hidden rounded-xl">
          <PhotoSlot label="" tone={tone} radius={12} ratio="1/1" />
        </div>
      )}
      <div className={`min-w-0 flex-1 ${showImage ? '' : 'px-2 py-1'}`}>
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-bold tracking-[-0.3px] text-ink">
            {name}
          </div>
          {best && !soldOut && (
            <Pill
              color={FESTIV_TOKENS.pop}
              ink={FESTIV_TOKENS.ink}
              style={{ fontSize: 10 }}
            >
              BEST
            </Pill>
          )}
          {soldOut && (
            <Pill color="#F1F7F8" ink="#8B939B" style={{ fontSize: 10 }}>
              품절
            </Pill>
          )}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">{desc}</div>
        {(price !== 0 || priceDisplay) && (
          <div className="mt-1 text-sm font-extrabold tracking-[-0.3px] text-ink">
            {priceDisplay ?? `${price.toLocaleString()}원`}
          </div>
        )}
      </div>
    </div>
  )
}
