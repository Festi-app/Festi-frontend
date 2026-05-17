import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { ScreenHeader } from '../../components/User/ScreenHeader'
import { FieldLabel } from '../../components/shared/FieldLabel'
import { Toast } from '../../components/shared/Toast'
import { NotificationSettings } from '../../components/User/NotificationSettings'

const NOTIFICATION_ROWS = [
  { label: '내 차례 3팀 전 알림', sub: '카카오톡 + 푸시' },
  { label: '내 차례 호출 알림', sub: '진동 + 사운드' },
]

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
      navigate('/waiting/detail', { replace: true })
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
          <NotificationSettings
            rows={NOTIFICATION_ROWS}
            values={notifications}
            onChange={(i) =>
              setNotifications((current) =>
                current.map((value, index) => (index === i ? !value : value))
              )
            }
          />
        </div>

        <div className="mt-4 rounded-[14px] bg-surface-alt p-3.5 text-[11px] leading-normal text-ink-60">
          호출 후 5분 이내 미도착 시 자동 취소될 수 있어요.
          <br />
          부스 근처에서 대기해주세요.
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

      {showToast && (
        <>
          <div
            className="absolute inset-0 z-40 bg-bg/70 pointer-events-none"
            style={{ animation: 'festi-fade-in 0.2s ease both' }}
          />
          <Toast
            message="웨이팅 등록이 완료되었습니다"
            sub={`컴공과 칵테일 바 · ${people}명`}
            icon={
              <div className="flex size-8 items-center justify-center rounded-full bg-pop shadow-[0_0_0_3px_rgba(34,195,106,0.25)]">
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
            }
          />
        </>
      )}
    </div>
  )
}
