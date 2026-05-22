import React from 'react'
import { Pill } from '../../../tokens'

export function BoothPinHeader({
  color,
  badgeText,
  badgeFontSize = 'text-[13px]',
  pill,
  pill2,
  name,
  sub,
}: {
  color: string
  badgeText: React.ReactNode
  badgeFontSize?: string
  pill: { color: string; ink: string; content: React.ReactNode }
  pill2?: { color: string; ink: string; content: React.ReactNode }
  name: string
  sub?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-full ${badgeFontSize} font-extrabold text-white`}
        style={{
          background: color,
          boxShadow: `inset 0 0 0 3px #fff, 0 4px 12px ${color}66`,
        }}
      >
        {badgeText}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          <Pill color={pill.color} ink={pill.ink}>
            {pill.content}
          </Pill>
          {pill2 && (
            <Pill color={pill2.color} ink={pill2.ink}>
              {pill2.content}
            </Pill>
          )}
        </div>
        <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
          {name}
        </div>
        {sub && (
          <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
