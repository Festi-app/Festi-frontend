import { tabBarPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { ROUTES, boothUrl } from '../../constants/routes'
import { PhotoSlot } from '../../tokens'
import { ScreenHeader } from '../../components/User/ScreenHeader'
import { WaitingTicketCard } from '../../components/User/Waiting/WaitingTicketCard'
import { CancelToast } from '../../components/User/CancelToast'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { useWaitingCancel } from '../../hooks/useWaitingCancel'
import { useMyWaitings } from '../../features/Waiting/hooks/useMyWaitings'
import { useBooth } from '../../features/Booth/hooks/useBooth'

function formatRegistered(partySize: number, registeredAt: string): string {
  const date = new Date(registeredAt)
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${partySize}인 · ${h}:${m} 등록`
}

export function UserWaitingDetail({
  dark = false,
  id,
}: {
  dark?: boolean
  id?: string
}) {
  const navigate = useNavigate()
  const { data: waitings = [] } = useMyWaitings()
  const waiting = waitings.find((w) => w.boothSummary?.id === id)
  const boothId = waiting?.boothSummary?.id ?? id ?? null
  const { data: booth } = useBooth(boothId)

  const { confirmCancel, setConfirmCancel, showCancelToast, handleCancel } =
    useWaitingCancel(() => navigate(ROUTES.WAITING))

  if (!waiting && !showCancelToast) {
    navigate(ROUTES.WAITING, { replace: true })
    return null
  }

  const boothName = booth?.name ?? waiting?.boothSummary?.name ?? '—'
  const registered = waiting
    ? formatRegistered(waiting.partySize, waiting.registeredAt)
    : ''

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 상세" />

      <div
        className="min-h-0 flex-1 overflow-y-auto px-5 pt-5"
        style={{ paddingBottom: tabBarPb }}
      >
        {waiting && (
          <WaitingTicketCard
            dark={dark}
            boothName={boothName}
            registered={registered}
            waitNo={waiting.position}
            callNo={waiting.currentCallPosition}
            onCancel={() => setConfirmCancel(true)}
          />
        )}

        <div className="relative mt-4">
          <div className="overflow-hidden rounded-[20px] border border-border bg-surface">
            <div className="flex items-center gap-3 p-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-[14px]">
                <PhotoSlot label="" tone={undefined} radius={14} ratio="1/1" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                  {boothName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => boothId && navigate(boothUrl('night', boothId))}
                className="shrink-0 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold text-ink-80"
              >
                부스 보기
              </button>
            </div>
            <div className="grid grid-cols-2 border-t border-border">
              {[
                {
                  l: '운영 상태',
                  v: booth?.isWaitingOpen ? '웨이팅 가능' : '웨이팅 마감',
                },
                {
                  l: '운영 시간',
                  v: booth?.operatingHours ?? '—',
                },
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

          <div className="mt-3.5 rounded-[14px] bg-surface-alt p-3.5 text-[11px] leading-normal text-ink-60">
            호출 후 5분 이내 미도착 시 자동 취소될 수 있어요.
            <br />
            부스 근처에서 대기해주세요.
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmCancel}
        title="웨이팅을 취소할까요?"
        body={
          <>
            {boothName}
            <br />
            취소 후에는 다시 등록해야 합니다.
          </>
        }
        confirmLabel="취소하기"
        onConfirm={() => waiting && handleCancel(waiting.id)}
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
