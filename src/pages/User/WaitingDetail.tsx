import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoSlot } from '../../tokens'
import { ScreenHeader } from '../../components/User/ScreenHeader'
import { WaitingTicketCard } from '../../components/User/WaitingTicket'
import { Toast } from '../../components/shared/Toast'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { NotificationSettings } from '../../components/User/NotificationSettings'

const NOTIFICATION_ROWS = [
  { label: '내 차례 3팀 전 알림', sub: '카카오톡 + 푸시' },
  { label: '내 차례 호출 알림', sub: '진동 + 사운드' },
]

export function MobileWaitingDetail({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current)
    },
    []
  )

  function handleCancel() {
    setConfirmCancel(false)
    setShowCancelToast(true)
    navTimerRef.current = setTimeout(() => navigate('/waiting'), 2000)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 상세" />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-10">
        <WaitingTicketCard
          dark={dark}
          boothName="체대 곱창집"
          boothId={38}
          boothTone="mint"
          registered="4인 · 21:32 등록"
          waitNo={38}
          callNo={26}
          progressPct={30}
          aheadTeams={12}
          etaMin={38}
          onCancel={() => setConfirmCancel(true)}
        />

        <div className="relative mt-4">
          <div className="overflow-hidden rounded-[20px] border border-border bg-surface">
            <div className="flex items-center gap-3 p-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-[14px]">
                <PhotoSlot label="" tone="mint" radius={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                  체대 곱창집
                </div>
                <div className="mt-0.5 text-xs text-ink-60">
                  #38 · 야식 · 진리관 앞
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/booth?waiting=true')}
                className="shrink-0 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs font-bold text-ink-80"
              >
                부스 보기
              </button>
            </div>
            <div className="grid grid-cols-2 border-t border-border">
              {[
                { l: '현재 대기', v: '12팀', s: '예상 38분' },
                { l: '운영 시간', v: '~23시', s: '18시 오픈' },
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
                  <div className="mt-0.5 text-[10px] text-ink-40">{x.s}</div>
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

      <ConfirmModal
        open={confirmCancel}
        title="웨이팅을 취소할까요?"
        body={
          <>
            체대 곱창집 · 38번
            <br />
            취소 후에는 다시 등록해야 합니다.
          </>
        }
        confirmLabel="취소하기"
        onConfirm={handleCancel}
        onClose={() => setConfirmCancel(false)}
      />

      {showCancelToast && (
        <>
          <div
            className="absolute inset-0 z-40 bg-bg/70 pointer-events-none"
            style={{ animation: 'festi-fade-in 0.2s ease both' }}
          />
          <Toast
            bottom="bottom-10"
            message="웨이팅이 취소되었습니다"
            sub="잠시 후 목록으로 이동합니다"
            icon={
              <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="#FF6B6B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            }
          />
        </>
      )}
    </div>
  )
}
