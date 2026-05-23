import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I, PhotoSlot } from '../../tokens'
import { boothUrl } from '../../constants/routes'
import { NIGHT_BOOTHS } from '../../data/booths'
import { getBoothZoneName } from '../../data/zones'

const BOOTHS = NIGHT_BOOTHS.filter((b) => (b.wait ?? 0) <= 2)

export function QuickEntrySection({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)

  return (
    <>
      {compact ? (
        <div className="flex items-center gap-3 px-5 pb-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-bold tracking-[0.3px] text-ink-40">
            빠른 입장 가능한 부스
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : (
        <div className="mb-3 flex items-end justify-between px-5">
          <div>
            <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
              지금 바로 입장 가능
            </div>
            <div className="mt-0.5 text-xs text-ink-60">
              대기 2팀 이하 · 빠르게 방문해보세요
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSpinning(true)}
            onAnimationEnd={() => setSpinning(false)}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-surface-alt p-1.5 text-ink-60"
            style={
              spinning
                ? { animation: 'festi-spin-once 0.5s ease both' }
                : undefined
            }
          >
            {I.refresh()}
          </button>
        </div>
      )}
      <div
        className={`flex gap-3 overflow-x-auto px-5 pb-1 ${compact ? 'mb-0' : 'mb-6'}`}
      >
        {BOOTHS.map((b) => {
          const badgeBg =
            b.wait === 0
              ? FESTIV_TOKENS.pop
              : b.wait === 1
                ? '#A3E635'
                : FESTIV_TOKENS.sun
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => navigate(boothUrl('night', b.id))}
              className="w-36 shrink-0 rounded-[20px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.97]"
            >
              <div className="relative mb-2.5">
                <PhotoSlot label="" tone={b.tone} ratio="1/1" radius={14} />
                <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.85)] px-2 py-0.75 text-[11px] font-bold text-white">
                  #{(b.sections?.[0] ?? 0) + 1}
                </div>
                <div
                  className="absolute right-2 bottom-2 rounded-full px-2 py-0.75 text-[11px] font-bold text-[#141A1F]"
                  style={{ background: badgeBg }}
                >
                  {b.wait === 0 ? '바로 입장' : `${b.wait}팀`}
                </div>
              </div>
              <div className="text-sm font-bold leading-[1.2] tracking-[-0.3px] text-ink">
                {b.name}
              </div>
              <div className="mt-1 text-[11px] text-ink-60">
                {getBoothZoneName(b)}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
