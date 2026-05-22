import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../../tokens'

import { formatSections } from '../../../lib/format'
import { type ActiveWaiting } from '../../../stores/useWaitingStore'
export function WaitingBoothCard({
  waiting: w,
  ink60,
  onClick,
}: {
  waiting: ActiveWaiting
  ink60: string
  onClick: () => void
}) {
  const pillColor =
    w.aheadTeams <= 3
      ? FESTIV_TOKENS.pop
      : w.aheadTeams <= 7
        ? FESTIV_TOKENS.sun
        : FESTIV_TOKENS.alert
  const soon = w.aheadTeams <= 3
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3 text-left transition-transform duration-100 active:scale-[0.98]"
    >
      <div className="size-13 shrink-0 overflow-hidden rounded-[14px]">
        <PhotoSlot label="" tone={w.boothTone} radius={14} ratio="1/1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Pill
            color={pillColor}
            ink={pillColor === FESTIV_TOKENS.sun ? FESTIV_TOKENS.ink : '#fff'}
          >
            대기중
          </Pill>
          <Pill color="transparent" ink={ink60}>
            앞에 {w.aheadTeams}팀
          </Pill>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-bold tracking-[-0.3px] text-ink">
          {soon && (
            <span
              className="inline-block size-1.5 shrink-0 rounded-full bg-pop"
              style={{ animation: 'festi-ping 1.4s ease-in-out infinite' }}
            />
          )}
          {w.boothName}
          <span className="text-[11px] font-normal text-ink-40">
            {w.boothArea}
            {w.boothSections && w.boothSections.length > 0 && (
              <> #{formatSections(w.boothSections)}</>
            )}
          </span>
        </div>
        <div className="mt-0.5 text-[11px] text-ink-60">{w.registered}</div>
      </div>
      <div className="size-3.5 text-ink-40">{I.chev(undefined, 'r')}</div>
    </button>
  )
}
