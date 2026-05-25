import React from 'react'
import { tabBarPb } from '../../../lib/safeArea'
import { I } from '../../../tokens'

export function MapSheet({
  children,
  sheetDragY,
  sheetDismissing,
  expanded,
  expandable = true,
  favoriteButton,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleExpand,
}: {
  children: React.ReactNode
  sheetDragY: number
  sheetDismissing: boolean
  expanded: boolean
  expandable?: boolean
  favoriteButton?: React.ReactNode
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void
  onDismiss: () => void
  onToggleExpand: () => void
}) {
  return (
    <div
      className={`absolute flex flex-col bg-surface ${
        expanded
          ? 'inset-x-0 bottom-0 z-40 h-[80%] overflow-hidden rounded-t-3xl shadow-[0_-8px_32px_rgba(15,42,51,0.18)]'
          : 'inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border px-4.5 pt-2.5 shadow-[0_-8px_32px_rgba(15,42,51,0.18)]'
      }`}
      style={{
        animation:
          sheetDragY > 0
            ? 'none'
            : sheetDismissing
              ? 'festi-sheet-out 0.22s ease both'
              : 'festi-sheet-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
        paddingBottom: expanded ? undefined : tabBarPb,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => e.stopPropagation()}
    >
      {expanded ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex size-8 items-center justify-center rounded-full bg-surface-alt text-ink"
          >
            <div className="size-4">{I.chev(undefined, 'l')}</div>
          </button>
          {favoriteButton && <div className="ml-auto">{favoriteButton}</div>}
        </div>
      ) : (
        <div className="mx-auto mb-3 flex h-5 w-full items-center justify-center">
          {expandable ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="h-full w-full flex items-center justify-center"
              aria-label="펼쳐서 상세보기"
            >
              <div className="h-1 w-9 rounded-full bg-ink-20" />
            </button>
          ) : (
            <div className="h-1 w-9 rounded-full bg-ink-20 opacity-30" />
          )}
        </div>
      )}
      <div className={expanded ? 'min-h-0 flex-1' : ''}>{children}</div>
    </div>
  )
}
