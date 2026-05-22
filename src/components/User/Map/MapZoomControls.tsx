export function MapZoomControls({
  onZoomIn,
  onZoomOut,
  canZoomOut,
}: {
  onZoomIn: () => void
  onZoomOut: () => void
  canZoomOut: boolean
}) {
  return (
    <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
      <button
        type="button"
        onClick={onZoomIn}
        className="flex size-9 items-center justify-center rounded-full border border-border bg-white/95 text-[20px] font-bold text-ink shadow-[0_2px_8px_rgba(20,26,31,0.15)] dark:bg-[#13262D]/95"
      >
        +
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="flex size-9 items-center justify-center rounded-full border border-border bg-white/95 text-[20px] font-bold text-ink shadow-[0_2px_8px_rgba(20,26,31,0.15)] disabled:opacity-35 dark:bg-[#13262D]/95"
      >
        −
      </button>
    </div>
  )
}
