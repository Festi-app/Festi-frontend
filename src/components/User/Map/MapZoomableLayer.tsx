import type { ReactNode, TouchEventHandler, MouseEventHandler } from 'react'

interface Props {
  scale: number
  offset: { x: number; y: number }
  isPinching: boolean
  activeMapAspect: string
  activeMapImage: string
  dark?: boolean
  onTouchStart: TouchEventHandler<HTMLDivElement>
  onTouchMove: TouchEventHandler<HTMLDivElement>
  onTouchEnd: TouchEventHandler<HTMLDivElement>
  onMouseDown: MouseEventHandler<HTMLDivElement>
  onMouseMove: MouseEventHandler<HTMLDivElement>
  onMouseUp: MouseEventHandler<HTMLDivElement>
  onClick: () => void
  children: ReactNode
}

export function MapZoomableLayer({
  scale,
  offset,
  isPinching,
  activeMapAspect,
  activeMapImage,
  dark,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClick,
  children,
}: Props) {
  return (
    <div
      className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onClick={onClick}
      style={{
        transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
        transformOrigin: 'center center',
        transition: isPinching ? 'none' : 'transform 0.15s ease-out',
      }}
    >
      <div
        className="absolute inset-x-0"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          aspectRatio: activeMapAspect,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${activeMapImage})`,
            backgroundSize: '100% 100%',
            ...(dark
              ? {}
              : { filter: 'brightness(1.05) saturate(0.6)', opacity: 0.75 }),
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[8%] bg-[linear-gradient(180deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(180deg,#0B1A1F_0%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%] bg-[linear-gradient(0deg,#E8F4F5_0%,transparent_100%)] dark:bg-[linear-gradient(0deg,#0B1A1F_0%,transparent_100%)]" />
        {!dark && (
          <div className="pointer-events-none absolute inset-0 bg-[rgba(232,244,245,0.18)]" />
        )}
        {children}
      </div>
    </div>
  )
}
