import { useState } from 'react'
import { tabBarPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { ROUTES, boothUrl } from '../../constants/routes'
import { PhotoSlot } from '../../tokens'
import { ScreenHeader } from '../../components/User/ScreenHeader'
import { FestiTabBar } from '../../components/User/Navbar'
import { NIGHT_BOOTHS } from '../../data/booths'
import { getBoothZoneName } from '../../data/zones'
import { WaitingTicketCard } from '../../components/User/WaitingTicket'
import { CancelToast } from '../../components/User/CancelToast'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { useWaitingCancel } from '../../hooks/useWaitingCancel'
import { NotificationSettings } from '../../components/User/NotificationSettings'
import { useWaitingStore } from '../../stores/useWaitingStore'

const NOTIFICATION_ROWS = [
  { label: '내 차례 3팀 전 알림', sub: '카카오톡 + 푸시' },
  { label: '내 차례 호출 알림', sub: '진동 + 사운드' },
]

export function MobileWaitingDetail({
  dark = false,
  id,
}: {
  dark?: boolean
  id?: number
}) {
  const booth = NIGHT_BOOTHS.find((b) => b.id === id) ?? NIGHT_BOOTHS[0]
  const { waitings } = useWaitingStore()
  const waiting = waitings.find((w) => w.boothId === booth.id)
  const navigate = useNavigate()
  const [cancelledWaiting, setCancelledWaiting] =
    useState<typeof waiting>(undefined)
  const { confirmCancel, setConfirmCancel, showCancelToast, handleCancel } =
    useWaitingCancel(() => navigate(ROUTES.WAITING))

  function onConfirmCancel() {
    setCancelledWaiting(waiting)
    handleCancel(booth.id)
  }

  if (!waiting && !showCancelToast) {
    navigate(ROUTES.WAITING, { replace: true })
    return null
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 상세" />

      <div
        className="min-h-0 flex-1 overflow-y-auto px-5 pt-5"
        style={{ paddingBottom: tabBarPb }}
      >
        {(waiting ?? cancelledWaiting) &&
          (() => {
            const w = waiting ?? cancelledWaiting!
            return (
              <WaitingTicketCard
                dark={dark}
                boothName={booth.name}
                boothTone={booth.tone}
                boothArea={getBoothZoneName(booth)}
                boothSections={booth.sections}
                registered={w.registered}
                waitNo={w.waitNo}
                callNo={w.callNo}
                progressPct={w.progressPct}
                aheadTeams={w.aheadTeams}
                onCancel={() => setConfirmCancel(true)}
              />
            )
          })()}

        <div className="relative mt-4">
          <div className="overflow-hidden rounded-[20px] border border-border bg-surface">
            <div className="flex items-center gap-3 p-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-[14px]">
                <PhotoSlot label="" tone={booth.tone} radius={14} ratio="1/1" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                  {booth.name}
                </div>
                <div className="mt-0.5 text-xs text-ink-60">
                  {getBoothZoneName(booth)} · #{booth.id}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(boothUrl('night', booth.id))}
                className="shrink-0 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold text-ink-80"
              >
                부스 보기
              </button>
            </div>
            <div className="grid grid-cols-2 border-t border-border">
              {[
                {
                  l: '현재 대기',
                  v:
                    booth.wait == null || booth.wait === 0
                      ? '없음'
                      : `${booth.wait}팀`,
                },
                { l: '운영 시간', v: booth.operatingHours ?? '17시 ~ 22시' },
              ].map((x, i) => (
                <div
                  key={i}
                  className={`py-3 text-center ${i === 0 ? 'border-r border-border' : ''}`}
                >
                  <div className="text-[11px] font-semibold text-ink-60">
                    {x.l}
                  </div>
                  <div className="mt-1 text-[17px] font-extrabold tracking-[-0.3px] text-ink">
                    {x.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[20px] border border-border bg-surface">
            <div className="px-4 pt-4 pb-1 text-[13px] font-bold tracking-[-0.2px] text-ink-60">
              알림 설정
            </div>
            <NotificationSettings rows={NOTIFICATION_ROWS} />
          </div>

          <div className="mt-3.5 rounded-[14px] bg-surface-alt p-3.5 text-[11px] leading-normal text-ink-60">
            호출 후 5분 이내 미도착 시 자동 취소될 수 있어요.
            <br />
            부스 근처에서 대기해주세요.
          </div>
        </div>
      </div>

      <FestiTabBar active="wait" dark={dark} />

      <ConfirmModal
        open={confirmCancel}
        title="웨이팅을 취소할까요?"
        body={
          <>
            {booth.name} · {booth.id}번
            <br />
            취소 후에는 다시 등록해야 합니다.
          </>
        }
        confirmLabel="취소하기"
        onConfirm={onConfirmCancel}
        onClose={() => setConfirmCancel(false)}
      />

      <CancelToast
        show={showCancelToast}
        sub="잠시 후 목록으로 이동합니다"
        bottom="bottom-10"
      />
    </div>
  )
}
