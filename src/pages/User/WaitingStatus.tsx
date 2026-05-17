import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { FestiTabBar } from '../../components/User/Navbar'
import { AppHeader, SubHeader } from '../../components/User/ScreenHeader'
import { WaitingTicketCard } from '../../components/User/WaitingTicket'
import { ConfirmModal } from '../../components/User/ConfirmModal'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'

type Waiting = {
  boothId: number
  boothName: string
  boothTone: string
  registered: string
  waitNo: number
  callNo: number
  progressPct: number
  aheadTeams: number
  etaMin: number
}

function WaitingBoothCard({
  waiting: w,
  ink60,
  onClick,
}: {
  waiting: Waiting
  ink60: string
  onClick: () => void
}) {
  const pillColor =
    w.aheadTeams <= 3
      ? FESTI_TOKENS.pop
      : w.aheadTeams <= 7
        ? FESTI_TOKENS.sun
        : FESTI_TOKENS.alert
  const soon = w.aheadTeams <= 3
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3 text-left transition-transform duration-100 active:scale-[0.98]"
    >
      <div className="size-13 shrink-0 overflow-hidden rounded-[14px]">
        <PhotoSlot label="" tone={w.boothTone} radius={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Pill
            color={pillColor}
            ink={pillColor === FESTI_TOKENS.sun ? FESTI_TOKENS.ink : '#fff'}
          >
            대기중
          </Pill>
          <Pill color="transparent" ink={ink60}>
            #{w.boothId}
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
        </div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          앞에 {w.aheadTeams}팀 · ~{w.etaMin}분
        </div>
      </div>
      <div className="size-3.5 text-ink-40">{I.chev(undefined, 'r')}</div>
    </button>
  )
}

const INITIAL_WAITINGS: Waiting[] = [
  {
    boothId: 16,
    boothName: '컴공과 칵테일 바',
    boothTone: 'rose',
    registered: '4인 · 21:14 등록',
    waitNo: 34,
    callNo: 30,
    progressPct: 60,
    aheadTeams: 2,
    etaMin: 14,
  },
  {
    boothId: 38,
    boothName: '체대 곱창집',
    boothTone: 'mint',
    registered: '2인 · 21:05 등록',
    waitNo: 22,
    callNo: 10,
    progressPct: 45,
    aheadTeams: 12,
    etaMin: 38,
  },
  {
    boothId: 47,
    boothName: '미디어부 라멘',
    boothTone: 'sun',
    registered: '3인 · 20:58 등록',
    waitNo: 18,
    callNo: 15,
    progressPct: 83,
    aheadTeams: 3,
    etaMin: 10,
  },
  {
    boothId: 22,
    boothName: '의약학부 주점',
    boothTone: 'grape',
    registered: '2인 · 20:45 등록',
    waitNo: 41,
    callNo: 33,
    progressPct: 80,
    aheadTeams: 8,
    etaMin: 25,
  },
]

export function MobileWaitingStatus({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [waitings, setWaitings] = useState<Waiting[]>(INITIAL_WAITINGS)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const ink60 = dark ? '#8B939B' : '#5E676D'

  const main = waitings[0] ?? null
  const others = waitings.slice(1)

  function cancelMain() {
    setWaitings((prev) => prev.slice(1))
    setConfirmCancel(false)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <div className="shrink-0 px-5 pt-13.5 pb-3.5">
        <AppHeader dark={dark} className="mt-1.5 mb-1" />
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pt-1 pb-27.5">
        {main ? (
          <>
            <WaitingTicketCard
              dark={dark}
              boothName={main.boothName}
              boothId={main.boothId}
              boothTone={main.boothTone}
              registered={main.registered}
              waitNo={main.waitNo}
              callNo={main.callNo}
              progressPct={main.progressPct}
              aheadTeams={main.aheadTeams}
              etaMin={main.etaMin}
              onCancel={() => setConfirmCancel(true)}
              onClick={() => navigate('/waiting/detail')}
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

            {others.length > 0 && (
              <>
                <SubHeader title="다른 웨이팅" right={`${others.length}건`} />
                <div className="flex flex-col gap-2.5">
                  {others.map((w) => (
                    <WaitingBoothCard
                      key={w.boothId}
                      waiting={w}
                      ink60={ink60}
                      onClick={() => navigate('/waiting/detail')}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-surface-alt text-ink-40">
              <div className="size-7">{I.ticket()}</div>
            </div>
            <div className="text-[15px] font-bold text-ink-60">
              현재 등록된 웨이팅이 없습니다
            </div>
            <div className="mt-1 text-[13px] text-ink-40">
              부스 웨이팅을 등록해 보세요
            </div>
          </div>
        )}
      </div>

      {!main && (
        <div className="pb-27.5">
          <QuickEntrySection dark={dark} compact />
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
          onConfirm={cancelMain}
          onClose={() => setConfirmCancel(false)}
        />
      )}
    </div>
  )
}
