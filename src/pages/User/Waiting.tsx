import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { FestiTabBar } from '../../components/User/Navbar'
import {
  AppHeader,
  PageTitle,
  ScreenHeader,
  SubHeader,
} from '../../components/User/ScreenHeader'
import { WaitingTicketCard } from '../../components/User/WaitingTicket'

// ── Field label ───────────────────────────────────────────────────────────────

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 mb-2 text-[13px] font-bold tracking-[-0.2px] text-ink-80">
      {children}
    </div>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

export function Switch({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-6.5 w-10.5 items-center rounded-full p-0.5 ${
        on ? 'justify-end bg-pop' : 'justify-start bg-[#D3DBDE]'
      }`}
    >
      <div className="size-5.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </button>
  )
}

// ── Screen: Waiting Register ──────────────────────────────────────────────────

export function MobileWaitingRegister({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [people, setPeople] = useState(4)
  const [notifications, setNotifications] = useState([true, true])
  const [showToast, setShowToast] = useState(false)
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  function handleRegister() {
    setShowToast(true)
    setTimeout(() => {
      navigate(-1)
    }, 1800)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 등록" />

      <div className="h-[calc(100%-130px)] overflow-auto px-5 pt-4.5 pb-35">
        {/* Booth card */}
        <button
          type="button"
          onClick={() => navigate('/booth')}
          className="flex w-full gap-3 rounded-[18px] border border-border bg-surface p-3 text-left"
        >
          <div className="size-14 shrink-0 overflow-hidden rounded-[14px]">
            <PhotoSlot label="" tone="rose" radius={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex gap-1">
              <Pill color={FESTI_TOKENS.alert} ink="#fff">
                #16
              </Pill>
              <Pill color={surfaceAlt} ink={ink80}>
                야간 주점
              </Pill>
            </div>
            <div className="mt-1 text-[15px] font-extrabold tracking-[-0.3px] text-ink">
              컴공과 칵테일 바
            </div>
            <div className="mt-0.5 text-[11px] text-ink-60">
              현재 7팀 대기 · 예상 22분
            </div>
          </div>
        </button>

        {/* People picker */}
        <FieldLabel>인원</FieldLabel>
        <div className="flex items-center justify-between rounded-[18px] border border-border bg-surface p-4">
          <div>
            <div className="text-[13px] font-semibold text-ink-60">
              방문 인원
            </div>
            <div className="mt-1 text-[28px] font-extrabold tracking-[-0.6px] text-ink">
              {people}{' '}
              <span className="text-sm font-semibold text-ink-60">명</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {([I.minus, I.plus] as const).map((ic, i) => (
              <button
                type="button"
                onClick={() =>
                  setPeople((current) =>
                    i === 1
                      ? Math.min(10, current + 1)
                      : Math.max(1, current - 1)
                  )
                }
                key={i}
                className={`size-11 rounded-[14px] border border-border p-3 text-[#141A1F] ${
                  i === 1 ? 'bg-mint' : 'bg-surface-alt'
                }`}
              >
                {ic()}
              </button>
            ))}
          </div>
        </div>

        {/* Quick chips */}
        <div className="mt-2 flex gap-1.5">
          {([2, 4, 6, 8, 10] as const).map((n, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPeople(n)}
              className={`flex-1 rounded-xl border py-2 text-center text-[13px] font-bold ${
                n === people
                  ? 'border-[#141A1F] bg-[#141A1F] text-white dark:border-white dark:bg-white dark:text-[#141A1F]'
                  : 'border-border bg-surface text-ink-80'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Notification toggles */}
        <FieldLabel>알림 설정</FieldLabel>
        <div className="overflow-hidden rounded-[18px] border border-border bg-surface">
          {[
            { l: '내 차례 3팀 전 알림', s: '카카오톡 + 푸시', on: true },
            { l: '내 차례 호출 알림', s: '진동 + 사운드', on: true },
          ].map((row, i, arr) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-3.5 ${
                i < arr.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex-1">
                <div className="text-sm font-bold tracking-[-0.3px] text-ink">
                  {row.l}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-60">{row.s}</div>
              </div>
              <Switch
                on={notifications[i]}
                onClick={() =>
                  setNotifications((current) =>
                    current.map((value, index) =>
                      index === i ? !value : value
                    )
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="mt-4 rounded-[14px] bg-surface-alt p-3.5 text-[11px] leading-normal text-ink-60">
          호출 후 5분 이내 미도착 시 자동 취소될 수 있어요. 웨이팅은 1인 1팀만
          등록 가능합니다.
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,#f2f3f4_30%)] px-5 pt-3.5 pb-7 dark:bg-[linear-gradient(180deg,transparent_0%,#0f1216_30%)]">
        <button
          type="button"
          onClick={handleRegister}
          className="w-full rounded-[20px] bg-cta px-5 py-4 text-center text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)] transition-transform duration-100 active:scale-[0.98]"
        >
          <div className="text-[11px] font-semibold opacity-70">
            {people}명 · 010-2354-8821
          </div>
          <div className="mt-0.5 text-[17px] font-extrabold tracking-[-0.4px]">
            웨이팅 등록하기
          </div>
        </button>
      </div>

      {/* Registration complete toast */}
      {showToast && (
        <div
          className="absolute inset-x-5 bottom-28 z-50 flex items-center gap-3 rounded-[20px] bg-[#141A1F] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          style={{
            animation:
              'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
          }}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pop shadow-[0_0_0_3px_rgba(34,195,106,0.25)]">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
              <path
                d="M3 8l3.5 3.5L13 4.5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-extrabold tracking-[-0.3px] text-white">
              웨이팅 등록이 완료되었습니다
            </div>
            <div className="mt-0.5 text-[11px] text-white/60">
              컴공과 칵테일 바 · {people}명
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Screen: My Waiting Status ─────────────────────────────────────────────────

export function MobileWaitingStatus({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [activeWaiting, setActiveWaiting] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const ink60 = dark ? '#8B939B' : '#5E676D'

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {/* Header */}
      <div className="shrink-0 px-5 pt-13.5 pb-3.5">
        <AppHeader dark={dark} className="mt-1.5 mb-1" />
        <PageTitle>내 웨이팅</PageTitle>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pt-1 pb-27.5">
        {/* Main ticket card */}
        {activeWaiting && (
          <WaitingTicketCard
            dark={dark}
            boothName="컴공과 칵테일 바"
            boothId={16}
            boothTone="rose"
            registered="4인 · 21:14 등록"
            waitNo={34}
            callNo={30}
            progressPct={60}
            aheadTeams={2}
            etaMin={14}
            onCancel={() => setConfirmCancel(true)}
          />
        )}

        {/* Notification banner */}
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

        <SubHeader title="다른 웨이팅" right="4건" />
        <div className="flex flex-col gap-2.5">
          {[
            {
              n: 16,
              name: '컴공과 칵테일 바',
              wait: 2,
              sub: '앞에 2팀 · ~7분',
              tone: 'rose',
            },
            {
              n: 38,
              name: '체대 곱창집',
              wait: 12,
              sub: '앞에 12팀 · ~38분',
              tone: 'mint',
            },
            {
              n: 47,
              name: '미디어부 라멘',
              wait: 3,
              sub: '앞에 3팀 · ~10분',
              tone: 'sun',
            },
            {
              n: 22,
              name: '의약학부 주점',
              wait: 8,
              sub: '앞에 8팀 · ~25분',
              tone: 'grape',
            },
          ].map((w, i) => {
            const pillColor =
              w.wait <= 3
                ? FESTI_TOKENS.pop
                : w.wait <= 7
                  ? FESTI_TOKENS.sun
                  : FESTI_TOKENS.alert
            const soon = w.wait <= 3
            return (
              <button
                type="button"
                onClick={() => navigate('/waiting/detail')}
                key={i}
                className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3 text-left transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="size-13 shrink-0 overflow-hidden rounded-[14px]">
                  <PhotoSlot label="" tone={w.tone} radius={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <Pill
                      color={pillColor}
                      ink={
                        pillColor === FESTI_TOKENS.sun
                          ? FESTI_TOKENS.ink
                          : '#fff'
                      }
                    >
                      대기중
                    </Pill>
                    <Pill color="transparent" ink={ink60}>
                      #{w.n}
                    </Pill>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-bold tracking-[-0.3px] text-ink">
                    {soon && (
                      <span
                        className="inline-block size-1.5 shrink-0 rounded-full bg-pop"
                        style={{
                          animation: 'festi-ping 1.4s ease-in-out infinite',
                        }}
                      />
                    )}
                    {w.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-60">{w.sub}</div>
                </div>
                <div className="size-3.5 text-ink-40">
                  {I.chev(undefined, 'r')}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <FestiTabBar active="wait" dark={dark} />

      {/* Cancel confirm modal */}
      {confirmCancel && (
        <>
          <div
            className="absolute inset-0 z-40 bg-[rgba(0,0,0,0.45)]"
            style={{ animation: 'festi-fade-in 0.18s ease both' }}
            onClick={() => setConfirmCancel(false)}
          />
          <div
            className="absolute inset-x-5 top-1/2 z-50 -translate-y-1/2 rounded-[24px] bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            style={{
              animation:
                'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
            }}
          >
            <div className="mb-1 text-center text-[18px] font-extrabold tracking-[-0.4px] text-ink">
              웨이팅을 취소할까요?
            </div>
            <div className="mb-6 text-center text-[13px] leading-normal text-ink-60">
              컴공과 칵테일 바 · 34번
              <br />
              취소 후에는 다시 등록해야 합니다.
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="flex-1 rounded-[16px] border border-border bg-surface-alt py-3.5 text-[15px] font-bold text-ink"
              >
                돌아가기
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWaiting(false)
                  setConfirmCancel(false)
                }}
                className="flex-1 rounded-[16px] bg-alert py-3.5 text-[15px] font-extrabold text-white"
              >
                취소하기
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes festi-blink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.3 }
        }
      `}</style>
    </div>
  )
}

// ── Screen: Waiting Detail ────────────────────────────────────────────────────

export function MobileWaitingDetail({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  function handleCancel() {
    setConfirmCancel(false)
    setShowCancelToast(true)
    setTimeout(() => navigate('/waiting'), 2000)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 상세" />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-10">
        {/* Ticket card */}
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

        {/* Booth info + notifications */}
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
                onClick={() => navigate('/booth')}
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

          {/* Notification settings */}
          <div className="mt-4 overflow-hidden rounded-[20px] border border-border bg-surface">
            <div className="px-4 pt-4 pb-1 text-[13px] font-bold tracking-[-0.2px] text-ink-60">
              알림 설정
            </div>
            {[
              { l: '내 차례 3팀 전 알림', s: '카카오톡 + 푸시' },
              { l: '내 차례 호출 알림', s: '진동 + 사운드' },
            ].map((row, i, arr) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex-1">
                  <div className="text-sm font-bold tracking-[-0.3px] text-ink">
                    {row.l}
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-60">{row.s}</div>
                </div>
                <Switch on={true} />
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="mt-3.5 rounded-[14px] bg-surface-alt p-3.5 text-[11px] leading-normal text-ink-60">
            호출 후 5분 이내 미도착 시 자동 취소될 수 있어요. 부스 근처에서
            대기해 주세요.
          </div>
        </div>
      </div>

      {/* Cancel confirm modal */}
      {confirmCancel && (
        <>
          <div
            className="absolute inset-0 z-40 bg-[rgba(0,0,0,0.45)]"
            style={{ animation: 'festi-fade-in 0.18s ease both' }}
            onClick={() => setConfirmCancel(false)}
          />
          <div
            className="absolute inset-x-5 top-1/2 z-50 -translate-y-1/2 rounded-[24px] bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            style={{
              animation:
                'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
            }}
          >
            <div className="mb-1 text-center text-[18px] font-extrabold tracking-[-0.4px] text-ink">
              웨이팅을 취소할까요?
            </div>
            <div className="mb-6 text-center text-[13px] leading-normal text-ink-60">
              체대 곱창집 · 38번
              <br />
              취소 후에는 다시 등록해야 합니다.
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="flex-1 rounded-[16px] border border-border bg-surface-alt py-3.5 text-[15px] font-bold text-ink"
              >
                돌아가기
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-[16px] bg-alert py-3.5 text-[15px] font-extrabold text-white"
              >
                취소하기
              </button>
            </div>
          </div>
        </>
      )}

      {/* Cancel complete: dim + toast */}
      {showCancelToast && (
        <>
          <div
            className="absolute inset-0 z-40 bg-bg/70 pointer-events-none"
            style={{ animation: 'festi-fade-in 0.2s ease both' }}
          />
          <div
            className="absolute inset-x-5 bottom-10 z-50 flex items-center gap-3 rounded-[20px] bg-[#141A1F] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            style={{
              animation:
                'festi-toast-in 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both',
            }}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm">
              ✕
            </div>
            <div>
              <div className="text-[14px] font-extrabold tracking-[-0.3px] text-white">
                웨이팅이 취소되었습니다
              </div>
              <div className="mt-0.5 text-[11px] text-white/60">
                잠시 후 목록으로 이동합니다
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
