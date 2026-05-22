import React, { useEffect, useRef, useState } from 'react'

export const MIN_SCALE = 1
export const MAX_SCALE = 3.5

export function useMapGesture({ activeMapRatio }: { activeMapRatio: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const lastTouchDist = useRef<number | null>(null)
  const lastOffset = useRef({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const mouseDragStart = useRef<{ x: number; y: number } | null>(null)
  const pendingPanRef = useRef<{ x: number; y: number; scale: number } | null>(
    null
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (pendingPanRef.current) {
      const { x, y, scale: s } = pendingPanRef.current
      pendingPanRef.current = null
      setScale(s)
      setOffset({ x, y })
      return
    }
    const imageH = el.clientWidth * activeMapRatio
    setScale(Math.min(MAX_SCALE, el.clientHeight / imageH))
    setOffset({ x: 0, y: 0 })
  }, [activeMapRatio])

  function clampOffset(x: number, y: number, s: number) {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const cw = el.clientWidth
    const ch = el.clientHeight
    const imageH = cw * activeMapRatio
    const maxX = Math.max(0, ((s - 1) * cw) / 2)
    const maxY = Math.max(0, (imageH * s) / 2 - ch * 0.2)
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  function handleTouchStart(e: React.TouchEvent<Element>) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.hypot(dx, dy)
      setIsPinching(true)
      lastOffset.current = offset
    } else if (e.touches.length === 1 && scale > MIN_SCALE) {
      dragStart.current = {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      }
    }
  }

  function handleTouchMove(e: React.TouchEvent<Element>) {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, scale * (dist / lastTouchDist.current))
      )
      lastTouchDist.current = dist
      const clamped = clampOffset(offset.x, offset.y, next)
      setScale(next)
      setOffset(clamped)
    } else if (
      e.touches.length === 1 &&
      dragStart.current &&
      scale > MIN_SCALE
    ) {
      const nx = e.touches[0].clientX - dragStart.current.x
      const ny = e.touches[0].clientY - dragStart.current.y
      setOffset(clampOffset(nx, ny, scale))
    }
  }

  function handleTouchEnd() {
    lastTouchDist.current = null
    setIsPinching(false)
    dragStart.current = null
    if (scale < MIN_SCALE * 1.05) {
      setScale(MIN_SCALE)
      setOffset({ x: 0, y: 0 })
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (scale <= MIN_SCALE) return
    mouseDragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!mouseDragStart.current) return
    const nx = e.clientX - mouseDragStart.current.x
    const ny = e.clientY - mouseDragStart.current.y
    setOffset(clampOffset(nx, ny, scale))
  }

  function handleMouseUp() {
    mouseDragStart.current = null
  }

  function zoom(delta: number) {
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta))
    const clamped = clampOffset(offset.x, offset.y, next)
    setScale(next)
    setOffset(clamped)
  }

  return {
    containerRef,
    scale,
    setScale,
    offset,
    setOffset,
    isPinching,
    pendingPanRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoom,
  }
}
