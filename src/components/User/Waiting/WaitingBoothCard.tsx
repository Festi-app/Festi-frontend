import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../../tokens'
import type { WaitingResponseDto } from '../../../features/Waiting/types/WaitingResponseDto'

function formatRegistered(partySize: number, registeredAt: string): string {
  const date = new Date(registeredAt)
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${partySize}인 · ${h}:${m} 등록`
}

export function WaitingBoothCard({
  waiting: w,
  ink60,
  onClick,
}: {
  waiting: WaitingResponseDto
  ink60: string
  onClick: () => void
}) {
  const isCalled = w.status === 'CALLED'
  const pillColor = isCalled ? FESTIV_TOKENS.pop : FESTIV_TOKENS.alert

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3 text-left transition-transform duration-100 active:scale-[0.98]"
    >
      <div className="size-13 shrink-0 overflow-hidden rounded-[14px]">
        <PhotoSlot label="" tone={undefined} radius={14} ratio="1/1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Pill color={pillColor} ink={isCalled ? '#fff' : '#fff'}>
            {isCalled ? '호출됨' : '대기중'}
          </Pill>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-bold tracking-[-0.3px] text-ink">
          {isCalled && (
            <span
              className="inline-block size-1.5 shrink-0 rounded-full bg-pop"
              style={{ animation: 'festi-ping 1.4s ease-in-out infinite' }}
            />
          )}
          {w.boothSummary?.name ?? '—'}
        </div>
        <div
          className="mt-0.5 text-[11px] text-ink-60"
          style={{ color: ink60 }}
        >
          {formatRegistered(w.partySize, w.registeredAt)}
        </div>
      </div>
      <div className="size-3.5 text-ink-40">{I.chev(undefined, 'r')}</div>
    </button>
  )
}
