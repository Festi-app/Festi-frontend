import { FESTIV_TOKENS, I, PhotoSlot } from '../../tokens'

export function PhotoHero({
  tone,
  label,
  height = 'h-80',
  showDots = false,
  dotsCount = 4,
  onBack,
  favorite,
  onFavorite,
}: {
  tone: string
  label?: string
  height?: string
  showDots?: boolean
  dotsCount?: number
  onBack: () => void
  favorite?: boolean
  onFavorite?: () => void
}) {
  return (
    <div className={`relative ${height}`}>
      <PhotoSlot
        label={label ?? ''}
        tone={tone}
        ratio="auto"
        radius={0}
        className="h-full"
        style={{ aspectRatio: 'auto' }}
      />
      <div className="absolute inset-x-0 top-0 h-27.5 bg-[linear-gradient(180deg,rgba(15,42,51,0.4)_0%,rgba(15,42,51,0)_100%)]" />
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#141A1F] backdrop-blur-lg"
        >
          <div className="size-4.5">{I.chev(undefined, 'l')}</div>
        </button>
        {onFavorite && (
          <button
            type="button"
            onClick={onFavorite}
            className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#141A1F] backdrop-blur-lg"
          >
            <div className="size-4.5">
              {I.star(
                favorite ? FESTIV_TOKENS.alert : undefined,
                favorite ? FESTIV_TOKENS.alert : 'none'
              )}
            </div>
          </button>
        )}
      </div>
      {showDots && (
        <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.25">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${i === 0 ? 'w-4.5 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
