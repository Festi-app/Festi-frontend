import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { FestiTabBar } from '../../components/User/Navbar'
import { WaitingTicketCard } from '../../components/User/WaitingTicket'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { CancelToast } from '../../components/User/CancelToast'
import { EmptyState } from '../../components/User/EmptyState'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'
import { useWaitingCancel } from '../../hooks/useWaitingCancel'
import { formatSections } from '../../lib/format'
import {
  useWaitingStore,
  type ActiveWaiting,
} from '../../stores/useWaitingStore'

function WaitingBoothCard({
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

export function MobileWaitingStatus({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { waitings } = useWaitingStore()
  const { confirmCancel, setConfirmCancel, showCancelToast, handleCancel } =
    useWaitingCancel()
  const [infoTip, setInfoTip] = useState(false)
  const ink60 = dark ? '#8B939B' : '#5E676D'

  const main = waitings[0] ?? null
  const others = waitings.slice(1)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {main ? (
        <div className="min-h-0 flex-1 overflow-auto overscroll-none px-5 pt-5 pb-27.5">
          <WaitingTicketCard
            dark={dark}
            boothName={main.boothName}
            boothTone={main.boothTone}
            boothArea={main.boothArea}
            boothSections={main.boothSections}
            registered={main.registered}
            waitNo={main.waitNo}
            callNo={main.callNo}
            progressPct={main.progressPct}
            aheadTeams={main.aheadTeams}
            onCancel={() => setConfirmCancel(true)}
            onClick={() => navigate(`/waiting/detail?id=${main.boothId}`)}
          />

          {main.aheadTeams <= 3 && (
            <div className="mt-3.5 flex items-center gap-3 rounded-[18px] bg-pop-soft p-3.5">
              <div className="size-9 shrink-0 rounded-xl bg-pop p-2 text-white">
                {I.bell()}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold tracking-[-0.2px] text-[#141A1F]">
                  곧 호출돼요!
                </div>
                <div className="mt-0.5 text-xs text-[#2E363C]">
                  부스 근처에서 대기해 주세요. 호출 후 5분 안에 도착!
                </div>
              </div>
            </div>
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
                  key={w.boothId}
                  waiting={w}
                  ink60={ink60}
                  onClick={() => navigate(`/waiting/detail?id=${w.boothId}`)}
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
          <div className="shrink-0 pb-27.5">
            <QuickEntrySection compact />
          </div>
        </div>
      )}

      <FestiTabBar active="wait" dark={dark} />

      {main && (
        <ConfirmModal
          open={confirmCancel}
          title="웨이팅을 취소할까요?"
          body={
            <>
              {main.boothName} · {main.waitNo}번
              <br />
              취소 후에는 다시 등록해야 합니다.
            </>
          }
          confirmLabel="취소하기"
          onConfirm={() => main && handleCancel(main.boothId)}
          onClose={() => setConfirmCancel(false)}
        />
      )}

      <CancelToast show={showCancelToast} />
    </div>
  )
}
