import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, FestiterMark, I, PhotoSlot, Pill } from '../../tokens'
import { SubHeader } from './Detail'
import { FestiTabBar } from '../../components/User/Navbar'

// ── Field label ───────────────────────────────────────────────────────────────

export function FieldLabel({
  children,
}: {
  children: ReactNode
  dark?: boolean
}) {
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
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      {/* Header */}
      <div className="border-b border-border bg-surface px-5 pt-13.5 pb-4">
        <div className="mt-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="size-6 text-ink"
          >
            {I.chev(undefined, 'l')}
          </button>
          <div className="flex-1 text-[17px] font-extrabold tracking-[-0.4px] text-ink">
            웨이팅 등록
          </div>
        </div>
      </div>

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
        <FieldLabel dark={dark}>인원</FieldLabel>
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
        <FieldLabel dark={dark}>알림 설정</FieldLabel>
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
          onClick={() => navigate('/waiting')}
          className="w-full rounded-[20px] bg-cta px-5 py-4 text-center text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]"
        >
          <div className="text-[11px] font-semibold opacity-70">
            {people}명 · 010-2354-8821
          </div>
          <div className="mt-0.5 text-[17px] font-extrabold tracking-[-0.4px]">
            웨이팅 등록하기
          </div>
        </button>
      </div>
    </div>
  )
}

// ── Screen: My Waiting Status ─────────────────────────────────────────────────

export function MobileWaitingStatus({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [activeWaiting, setActiveWaiting] = useState(true)
  const markColor = dark ? '#F2F5F7' : '#141A1F'
  const bgColor = dark ? '#0F1216' : '#F2F3F4'
  const cardColor = dark ? '#1A3137' : FESTI_TOKENS.ink
  const cardText = dark ? '#EAF6F7' : '#FFFFFF'
  const ink60 = dark ? '#8B939B' : '#5E676D'

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      {/* Header */}
      <div className="px-5 pt-13.5 pb-3.5">
        <div className="mt-1.5 mb-1 flex items-center gap-2">
          <FestiterMark size={18} color={markColor} />
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => navigate('/me')}
            className="size-9 p-2 text-ink-60"
          >
            {I.bell()}
          </button>
        </div>
        <div className="text-[26px] font-extrabold tracking-[-0.7px] text-ink">
          내 웨이팅
        </div>
      </div>

      <div className="h-[calc(100%-100px)] overflow-auto px-5 pt-1 pb-27.5">
        {/* Main ticket card */}
        {activeWaiting && (
          <div
            className="relative overflow-hidden rounded-[28px] p-5.5"
            style={{
              background: cardColor,
              color: cardText,
              border: dark ? '1px solid #2F353B' : 'none',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${FESTI_TOKENS.mint}55 0%, transparent 55%),
                         radial-gradient(circle at 20% 100%, ${FESTI_TOKENS.pop}33 0%, transparent 50%)`,
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <Pill
                  color="rgba(169,229,231,0.18)"
                  ink={FESTI_TOKENS.mint}
                  style={{ fontSize: 11 }}
                >
                  <span className="mr-1 inline-block size-1.5 animate-[festi-blink_1.6s_ease-in-out_infinite] rounded-full bg-mint" />
                  LIVE · 진행중
                </Pill>
                <div className="text-[11px] font-semibold opacity-70">
                  대기번호
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <div className="font-festi text-[96px] leading-none font-extrabold tracking-[-4px] text-mint">
                  34
                </div>
                <div>
                  <div className="text-[13px] font-semibold opacity-70">
                    현재 호출
                  </div>
                  <div className="mt-0.5 text-[34px] leading-none font-extrabold tracking-[-1px]">
                    30
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[60%] rounded-full bg-[linear-gradient(90deg,#a9e5e7_0%,#22c36a_100%)]" />
                </div>
                <div className="mt-2.5 flex justify-between text-xs font-semibold">
                  <span className="opacity-70">
                    앞에 <strong className="text-white">4팀</strong> 남음
                  </span>
                  <span className="opacity-70">
                    예상 대기 <strong className="text-white">~14분</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket perforation */}
            <div className="relative -mx-5.5 mt-5 mb-3.5 h-px border-t border-dashed border-white/20">
              <div
                className="absolute -top-3 -left-3 size-6 rounded-full"
                style={{ background: bgColor }}
              />
              <div
                className="absolute -top-3 -right-3 size-6 rounded-full"
                style={{ background: bgColor }}
              />
            </div>

            <div className="relative flex items-center gap-3">
              <div className="size-11 shrink-0 overflow-hidden rounded-xl">
                <PhotoSlot label="" tone="rose" radius={12} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold tracking-[-0.3px]">
                  컴공과 칵테일 바
                </div>
                <div className="mt-0.5 text-[11px] opacity-70">
                  #16 · 4인 · 21:14 등록
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveWaiting(false)}
                className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold"
              >
                취소
              </button>
            </div>
          </div>
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

        <SubHeader title="다른 웨이팅" right="2건" dark={dark} />
        <div className="flex flex-col gap-2.5">
          {[
            {
              n: 38,
              name: '체대 곱창집',
              state: '대기중',
              sub: '앞에 12팀 · ~38분',
              tone: 'mint',
              color: FESTI_TOKENS.mint,
            },
            {
              n: 47,
              name: '미디어부 라멘',
              state: '예약',
              sub: '20:30 도착 예약',
              tone: 'sun',
              color: FESTI_TOKENS.sun,
            },
          ].map((w, i) => (
            <button
              type="button"
              onClick={() => navigate('/booth')}
              key={i}
              className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-3 text-left"
            >
              <div className="size-13 shrink-0 overflow-hidden rounded-[14px]">
                <PhotoSlot label="" tone={w.tone} radius={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <Pill color={w.color} ink={FESTI_TOKENS.ink}>
                    {w.state}
                  </Pill>
                  <Pill color="transparent" ink={ink60}>
                    #{w.n}
                  </Pill>
                </div>
                <div className="mt-1 text-sm font-bold tracking-[-0.3px] text-ink">
                  {w.name}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-60">{w.sub}</div>
              </div>
              <div className="size-3.5 text-ink-40">
                {I.chev(undefined, 'r')}
              </div>
            </button>
          ))}
        </div>
      </div>

      <FestiTabBar active="wait" dark={dark} />

      <style>{`
        @keyframes festi-blink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.3 }
        }
      `}</style>
    </div>
  )
}
