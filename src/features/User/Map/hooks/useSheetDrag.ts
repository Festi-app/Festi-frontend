import React, { useRef, useState } from 'react'

export function useSheetDrag({ onDismissed }: { onDismissed: () => void }) {
  const [sheetDismissing, setSheetDismissing] = useState(false)
  const [sheetDragY, setSheetDragY] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [sheetExpandable, setSheetExpandable] = useState(true)
  const sheetDragStart = useRef<number | null>(null)
  const rawSheetDragRef = useRef(0)

  function dismissSheet() {
    setSheetExpanded(false)
    setSheetDismissing(true)
    setTimeout(() => {
      onDismissed()
      setSheetDismissing(false)
      setSheetDragY(0)
    }, 220)
  }

  function handleSheetTouchStart(e: React.TouchEvent<Element>) {
    e.stopPropagation()
    sheetDragStart.current = e.touches[0].clientY
    rawSheetDragRef.current = 0
  }

  function handleSheetTouchMove(e: React.TouchEvent<Element>) {
    e.stopPropagation()
    if (sheetDragStart.current === null) return
    const dy = e.touches[0].clientY - sheetDragStart.current
    rawSheetDragRef.current = dy
    if (dy > 0) setSheetDragY(dy)
  }

  function handleSheetTouchEnd(e: React.TouchEvent<Element>) {
    e.stopPropagation()
    const dy = rawSheetDragRef.current
    rawSheetDragRef.current = 0
    if (dy > 60) {
      if (sheetExpanded) {
        setSheetExpanded(false)
      } else {
        dismissSheet()
      }
      setSheetDragY(0)
    } else if (dy < -60 && !sheetExpanded && sheetExpandable) {
      setSheetExpanded(true)
      setSheetDragY(0)
    } else {
      setSheetDragY(0)
    }
    sheetDragStart.current = null
  }

  return {
    sheetDismissing,
    setSheetDismissing,
    sheetDragY,
    sheetExpanded,
    setSheetExpanded,
    sheetExpandable,
    setSheetExpandable,
    dismissSheet,
    handleSheetTouchStart,
    handleSheetTouchMove,
    handleSheetTouchEnd,
  }
}
