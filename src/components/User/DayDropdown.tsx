import { useEffect, useRef, useState } from 'react'
import { FESTI_TOKENS } from '../../tokens'

export function DayDropdown({
  value,
  onChange,
  currentDay,
  totalDays = 3,
  align = 'right',
}: {
  value: number
  onChange: (day: number) => void
  currentDay: number
  totalDays?: number
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-full border border-border bg-white/80 px-3 py-2 text-[13px] font-bold tracking-[-0.2px] text-ink shadow-[0_1px_8px_rgba(20,26,31,0.10)] backdrop-blur-sm dark:border-white/30 dark:bg-white/15 dark:text-white"
      >
        {value}일차
        {value === currentDay && (
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: FESTI_TOKENS.pop }}
          />
        )}
        <svg
          viewBox="0 0 12 12"
          width="12"
          height="12"
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full z-20 mt-1.5 min-w-24 overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_4px_20px_rgba(20,26,31,0.15)] dark:bg-[#1A1E23] ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => {
                onChange(d)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-bold tracking-[-0.2px] ${
                value === d ? 'text-ink' : 'text-ink-60'
              }`}
            >
              {d}일차
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{
                  background:
                    d === currentDay ? FESTI_TOKENS.pop : 'transparent',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
