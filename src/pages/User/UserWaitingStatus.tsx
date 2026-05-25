import { useState } from 'react'
import { tabBarPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { I } from '../../tokens'
import { WaitingTicketCard } from '../../components/User/Waiting/WaitingTicketCard'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { CancelToast } from '../../components/User/CancelToast'
import { EmptyState } from '../../components/User/EmptyState'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'
import { useWaitingCancel } from '../../hooks/useWaitingCancel'
import { WaitingBoothCard } from '../../components/User/Waiting/WaitingBoothCard'
import { waitingDetailUrl } from '../../constants/routes'
import { useMyWaitings } from '../../features/Waiting/hooks/useMyWaitings'
import {
  useRegisterPushSubscription,
  getStoredSubscriptionId,
} from '../../features/PushSubscription/hooks/usePushSubscription'

function formatRegistered(partySize: number, registeredAt: string): string {
  const date = new Date(registeredAt)
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${partySize}인 · ${h}:${m} 등록`
}

export function UserWaitingStatus({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { data: waitings = [], isLoading } = useMyWaitings()
  const activeWaitings = waitings.filter(
    (w) => w.status === 'WAITING' || w.status === 'CALLED'
  )
  const { confirmCancel, setConfirmCancel, showCancelToast, handleCancel } =
    useWaitingCancel()
  const [infoTip, setInfoTip] = useState(false)
  const ink60 = dark ? '#8B939B' : '#5E676D'

  const main = activeWaitings[0] ?? null
  const others = activeWaitings.slice(1)

  const pushSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  const [isSubscribed, setIsSubscribed] = useState(
    () => !!getStoredSubscriptionId()
  )
  const { mutate: registerPush, isPending: isRegistering } =
    useRegisterPushSubscription()

  function handleEnableNotification() {
    registerPush(undefined, {
      onSuccess: () => setIsSubscribed(true),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg font-festi">
        <div className="text-[13px] text-ink-40">불러오는 중…</div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {main ? (
        <div
          className="min-h-0 flex-1 overflow-auto overscroll-none px-5 pt-5"
          style={{ paddingBottom: tabBarPb }}
        >
          <WaitingTicketCard
            dark={dark}
            boothName={main.boothSummary?.name ?? '—'}
            registered={formatRegistered(main.partySize, main.registeredAt)}
            waitNo={main.position}
            callNo={main.currentCallPosition}
            onCancel={() => setConfirmCancel(true)}
            onClick={() =>
              main.boothSummary?.id &&
              navigate(waitingDetailUrl(main.boothSummary.id))
            }
          />

          {main.status === 'CALLED' && (
            <div className="mt-3.5 flex items-center gap-3 rounded-[18px] bg-pop-soft p-3.5">
              <div className="size-9 shrink-0 rounded-xl bg-pop p-2 text-white">
                {I.bell()}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold tracking-[-0.2px] text-[#141A1F]">
                  호출됐어요!
                </div>
                <div className="mt-0.5 text-xs text-[#2E363C]">
                  부스 근처에서 대기해 주세요. 호출 후 5분 안에 도착!
                </div>
              </div>
            </div>
          )}

          {pushSupported &&
            !isSubscribed &&
            Notification.permission !== 'denied' && (
              <button
                type="button"
                onClick={handleEnableNotification}
                disabled={isRegistering}
                className="mt-3.5 flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3.5 text-left transition-colors active:bg-surface-alt disabled:opacity-50"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-ink-60">
                  {I.bell()}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold tracking-[-0.2px] text-ink">
                    호출 알림 받기
                  </div>
                  <div className="mt-0.5 text-xs text-ink-60">
                    호출 시 브라우저 알림으로 바로 알려드려요
                  </div>
                </div>
                <div className="shrink-0 text-[11px] font-bold text-cta">
                  {isRegistering ? '설정 중...' : '켜기'}
                </div>
              </button>
            )}

          <div className="flex items-center justify-between px-0.5 pb-2 pt-5">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-ink-60">
                다른 웨이팅
              </span>
              <button
                type="button"
                onClick={() => setInfoTip((v) => !v)}
                className="relative flex size-4 items-center justify-center rounded-full border border-ink-20 text-[9px] font-bold text-ink-40"
              >
                i
                {infoTip && (
                  <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/4 rounded-[10px] bg-[#141A1F] px-3 py-2 text-left text-[11px] font-semibold leading-normal text-white shadow-lg">
                    <div className="whitespace-nowrap">
                      웨이팅은 최대 3개 부스까지 가능합니다
                    </div>
                    <div className="absolute top-full left-1/4 border-4 border-transparent border-t-[#141A1F]" />
                  </div>
                )}
              </button>
            </div>
            {others.length > 0 && (
              <span className="text-[13px] font-semibold text-ink-40">
                {others.length}건
              </span>
            )}
          </div>
          {others.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {others.map((w) => (
                <WaitingBoothCard
                  key={w.id}
                  waiting={w}
                  ink60={ink60}
                  onClick={() =>
                    w.boothSummary?.id &&
                    navigate(waitingDetailUrl(w.boothSummary.id))
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={I.ticket()}
              title="다른 웨이팅이 없습니다"
              sub="웨이팅을 추가로 등록해 보세요"
              className="py-8"
            />
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <EmptyState
            icon={I.ticket()}
            title="현재 등록된 웨이팅이 없습니다"
            sub="부스 웨이팅을 등록해 보세요"
            className="flex-1 px-5"
          />
          <div className="shrink-0" style={{ paddingBottom: tabBarPb }}>
            <QuickEntrySection compact />
          </div>
        </div>
      )}

      {main && (
        <ConfirmModal
          open={confirmCancel}
          title="웨이팅을 취소할까요?"
          body={
            <>
              {main.boothSummary?.name ?? '—'}
              <br />
              취소 후에는 다시 등록해야 합니다.
            </>
          }
          confirmLabel="취소하기"
          onConfirm={() => main && handleCancel(main.id)}
          onClose={() => setConfirmCancel(false)}
        />
      )}

      <CancelToast show={showCancelToast} />
    </div>
  )
}
