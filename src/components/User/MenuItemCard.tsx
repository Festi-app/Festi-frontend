import { FESTIV_TOKENS, PhotoSlot, Pill } from '../../tokens'

export function MenuItemCard({
  name,
  description,
  price,
  tone,
  best = false,
  isSoldOut = false,
  showImage = false,
  priceDisplay,
}: {
  name: string
  description: string
  price: number
  tone: string
  best?: boolean
  isSoldOut?: boolean
  showImage?: boolean
  priceDisplay?: string
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-border bg-surface p-2 ${isSoldOut ? 'opacity-50' : ''}`}
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
          {best && !isSoldOut && (
            <Pill
              color={FESTIV_TOKENS.pop}
              ink={FESTIV_TOKENS.ink}
              style={{ fontSize: 10 }}
            >
              BEST
            </Pill>
          )}
          {isSoldOut && (
            <Pill color="#F1F7F8" ink="#8B939B" style={{ fontSize: 10 }}>
              품절
            </Pill>
          )}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">{description}</div>
        {(price !== 0 || priceDisplay) && (
          <div className="mt-1 text-sm font-extrabold tracking-[-0.3px] text-ink">
            {priceDisplay ?? `${price.toLocaleString()}원`}
          </div>
        )}
      </div>
    </div>
  )
}
