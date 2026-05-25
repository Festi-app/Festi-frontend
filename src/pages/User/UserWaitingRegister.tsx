import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { boothUrl } from '../../constants/routes'
import { ScreenHeader } from '../../components/User/ScreenHeader'
import { FieldLabel } from '../../components/shared/FieldLabel'
import { Toast } from '../../components/shared/Toast'
import { NotificationSettings } from '../../components/User/Waiting/NotificationSettings'
import { useRegisterWaiting } from '../../features/Waiting/hooks/useRegisterWaiting'
import { useMyWaitings } from '../../features/Waiting/hooks/useMyWaitings'
import { useBooth } from '../../features/Booth/hooks/useBooth'
import { useMe } from '../../features/User/hooks/useMe'
import {
  useRegisterPushSubscription,
  useRemovePushSubscription,
  getStoredSubscriptionId,
} from '../../features/PushSubscription/hooks/usePushSubscription'

const NOTIFICATION_ROWS = [
  { label: '내 차례 호출 알림', sub: '푸시 알림' },
  { label: '도착 알림 진동', sub: '진동 + 사운드' },
]

const pushSupported =
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window

const BOOTH_TYPE_VIEW = {
  DAY: { label: '주간', param: 'day', color: FESTIV_TOKENS.mint },
  NIGHT: { label: '야간', param: 'night', color: FESTIV_TOKENS.alert },
  FOOD_TRUCK: { label: '푸드트럭', param: 'truck', color: FESTIV_TOKENS.sun },
} as const

export function UserWaitingRegister({ id }: { dark?: boolean; id?: string }) {
  const navigate = useNavigate()
  const [people, setPeople] = useState(4)
  const [notifications, setNotifications] = useState([
    pushSupported ? !!getStoredSubscriptionId() : false,
    true,
  ])
  const [showToast, setShowToast] = useState(false)
  const [limitToast, setLimitToast] = useState(false)

  const { mutate: registerWaiting } = useRegisterWaiting(id ?? '')
  const { data: booth } = useBooth(id ?? null)
  const { data: me } = useMe()
  const { data: waitings = [] } = useMyWaitings()
  const { mutate: registerPush } = useRegisterPushSubscription()
  const { mutate: removePush } = useRemovePushSubscription()

  function handleNotificationChange(i: number) {
    if (i === 0 && pushSupported) {
      const next = !notifications[0]
      if (next) {
        registerPush(undefined, {
          onSuccess: () =>
            setNotifications((cur) =>
              cur.map((v, idx) => (idx === 0 ? true : v))
            ),
          onError: () =>
            setNotifications((cur) =>
              cur.map((v, idx) => (idx === 0 ? false : v))
            ),
        })
      } else {
        const subId = getStoredSubscriptionId()
        if (subId) {
          removePush(subId, {
            onSuccess: () =>
              setNotifications((cur) =>
                cur.map((v, idx) => (idx === 0 ? false : v))
              ),
          })
        } else {
          setNotifications((cur) =>
            cur.map((v, idx) => (idx === 0 ? false : v))
          )
        }
      }
    } else {
      setNotifications((cur) => cur.map((v, idx) => (idx === i ? !v : v)))
    }
  }

  function handleRegister() {
    if (!id) return
    const activeWaitingCount = waitings.filter(
      (waiting) => waiting.status === 'WAITING' || waiting.status === 'CALLED'
    ).length

    if (activeWaitingCount >= 3) {
      setLimitToast(true)
      setTimeout(() => setLimitToast(false), 2200)
      return
    }

    registerWaiting(
      { partySize: people },
      {
        onSuccess: () => {
          setShowToast(true)
          setTimeout(() => navigate('/waiting', { replace: true }), 1800)
        },
        onError: () => {
          setLimitToast(true)
          setTimeout(() => setLimitToast(false), 2200)
        },
      }
    )
  }

  const boothTypeView = booth
    ? BOOTH_TYPE_VIEW[booth.type]
    : BOOTH_TYPE_VIEW.NIGHT

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <ScreenHeader title="웨이팅 등록" />

      <div className="h-[calc(100%-130px)] overflow-auto px-5 pt-4.5 pb-35">
        {/* Booth card */}
        <button
          type="button"
          onClick={() => id && navigate(boothUrl(boothTypeView.param, id))}
          className="flex w-full gap-3 rounded-[18px] border border-border bg-surface p-3 text-left"
        >
          <div className="size-14 shrink-0 overflow-hidden rounded-[14px]">
            {booth?.imageUrl ? (
              <img
                src={booth.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoSlot label="" tone="mint" radius={14} ratio="1/1" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex gap-1">
              <Pill color={boothTypeView.color} ink="#fff">
                {boothTypeView.label}
              </Pill>
            </div>
            <div className="mt-1 text-[15px] font-extrabold tracking-[-0.3px] text-ink">
              {booth?.name ?? '부스 정보 불러오는 중…'}
            </div>
            {booth?.description && (
              <div className="mt-0.5 line-clamp-1 text-[12px] font-medium text-ink-60">
                {booth.description}
              </div>
            )}
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
            onChange={handleNotificationChange}
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
            {people}명 · {me?.phone ?? ''}
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
            sub={`${people}명`}
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

      {limitToast && (
        <Toast
          message="웨이팅은 최대 3개까지 가능합니다"
          sub="기존 웨이팅을 취소한 뒤 다시 등록해주세요"
          icon={
            <div className="flex size-8 items-center justify-center rounded-full bg-alert shadow-[0_0_0_3px_rgba(255,77,87,0.25)]">
              <span className="text-[18px] font-extrabold text-white">!</span>
            </div>
          }
        />
      )}
    </div>
  )
}
