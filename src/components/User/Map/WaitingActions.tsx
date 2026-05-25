import { tabBarPb } from '../../../lib/safeArea'
import { I } from '../../../tokens'

type WaitingButtonProps = {
  onWaiting: () => void
  onAlreadyWaiting?: () => void
  disabled?: boolean
  waitBadge?: number
  alreadyWaiting?: boolean
  isWaitingOpen?: boolean
}

function WaitingButton({
  onWaiting,
  onAlreadyWaiting,
  disabled,
  waitBadge,
  alreadyWaiting,
  isWaitingOpen,
}: WaitingButtonProps) {
  const noWait = waitBadge == null || waitBadge === 0
  if (isWaitingOpen === false) {
    return (
      <div className="flex w-full items-center justify-between rounded-[20px] bg-[#D0D5D8] px-5 py-4 text-left dark:bg-[#2F353B]">
        <div>
          <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink-60 dark:text-ink-40">
            웨이팅 마감
          </div>
          <div className="text-[11px] font-semibold text-ink-40">
            현장 웨이팅이 마감되었습니다.
          </div>
        </div>
      </div>
    )
  }
  if (alreadyWaiting) {
    return (
      <button
        type="button"
        onClick={onAlreadyWaiting}
        className="flex w-full items-center justify-between rounded-[20px] bg-[#D0D5D8] px-5 py-4 text-left transition-transform duration-100 active:scale-[0.98] dark:bg-[#2F353B]"
      >
        <div>
          <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink-60 dark:text-ink-40">
            이미 웨이팅 중
          </div>
          <div className="text-[11px] font-semibold text-ink-40">
            웨이팅을 취소할 수 있어요
          </div>
        </div>
        <div className="size-4.5">{I.chev(undefined, 'r')}</div>
      </button>
    )
  }
  if (noWait) {
    return (
      <div className="flex w-full items-center justify-between rounded-[20px] bg-pop px-5 py-4">
        <div>
          <div className="text-[17px] font-extrabold tracking-[-0.4px] text-white">
            지금 바로 입장해주세요!
          </div>
          <div className="text-[11px] font-semibold text-white/70">
            대기 없이 바로 입장 가능합니다
          </div>
        </div>
        <div className="size-4.5 text-white">
          <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
            <path
              d="M3 8l3.5 3.5L13 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={onWaiting}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-[20px] bg-cta px-5 py-4 text-left shadow-[0_8px_22px_rgba(0,198,224,0.4)] disabled:opacity-40"
    >
      <div>
        <div className="text-[17px] font-extrabold tracking-[-0.4px] text-cta-ink">
          웨이팅 걸기
        </div>
        <div className="text-[11px] font-semibold text-cta-ink/70">
          현재 {waitBadge}팀 대기
        </div>
      </div>
      <div className="size-4.5">{I.chev('#fff', 'r')}</div>
    </button>
  )
}

export function WaitingActions({
  sticky = false,
  ...props
}: {
  onWaiting?: () => void
  onAlreadyWaiting?: () => void
  disabled?: boolean
  waitBadge?: number
  alreadyWaiting?: boolean
  isWaitingOpen?: boolean
  sticky?: boolean
}) {
  if (!props.onWaiting) return null
  const buttonProps = { ...props, onWaiting: props.onWaiting }
  if (sticky) {
    return (
      <div
        className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,var(--color-surface)_35%)] px-5 pt-3"
        style={{ paddingBottom: tabBarPb }}
      >
        <WaitingButton {...buttonProps} />
      </div>
    )
  }
  return (
    <div className="mt-3">
      <WaitingButton {...buttonProps} />
    </div>
  )
}
