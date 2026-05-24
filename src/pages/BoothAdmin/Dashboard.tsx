import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { FESTIV_TOKENS, I } from '../../tokens'
import { useMyBoothApplication } from '../../features/BoothApplication/hooks/useMyBoothApplication'
import { useUpdateBooth } from '../../features/Booth/hooks/useUpdateBooth'
import { useBoothWaitings } from '../../features/Waiting/hooks/useBoothWaitings'
import { useCallWaiting } from '../../features/Waiting/hooks/useCallWaiting'
import { useUpdateWaitingStatus } from '../../features/Waiting/hooks/useUpdateWaitingStatus'
import type { BoothApplicationResponseDto } from '../../features/BoothApplication/types/BoothApplicationResponseDto'
import type { WaitingResponseDto } from '../../features/Waiting/types/WaitingResponseDto'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const BOOTH_TYPE_LABEL: Record<string, string> = {
  DAY: '주간',
  NIGHT: '야간',
  FOOD_TRUCK: '푸드트럭',
}

// ── Pending/Rejected screen ───────────────────────────────────────────────────

function StatusScreen({
  application,
  onLogout,
}: {
  application: BoothApplicationResponseDto
  onLogout: () => void
}) {
  const isPending = application.status === 'PENDING'
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center bg-bg px-4 font-festi md:min-h-screen">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-surface-alt text-4xl">
            {isPending ? '⏳' : '❌'}
          </div>
        </div>
        <div className="mb-2 text-[22px] font-extrabold text-ink">
          {isPending ? '승인 대기 중' : '신청 반려됨'}
        </div>
        <div className="mb-1 text-[14px] text-ink-60">
          <span className="font-bold text-ink">{application.boothName}</span>
          {isPending
            ? '의 부스 신청이 검토 중이에요'
            : '의 부스 신청이 반려됐어요'}
        </div>
        {isPending ? (
          <div className="mb-8 text-[13px] text-ink-40">
            관리자 승인 후 부스 정보를 등록할 수 있어요
          </div>
        ) : (
          application.reviewMemo && (
            <div className="mb-8 rounded-xl bg-alert/10 px-4 py-3 text-[13px] text-alert">
              사유: {application.reviewMemo}
            </div>
          )
        )}

        <div className="mb-4 rounded-2xl border border-border bg-surface p-5 text-left shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]">
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            신청 정보
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: '부스명', value: application.boothName },
              {
                label: '유형',
                value:
                  BOOTH_TYPE_LABEL[application.boothType] ??
                  application.boothType,
              },
              application.operatingHours
                ? { label: '운영 시간', value: application.operatingHours }
                : null,
              {
                label: '신청일',
                value: new Date(application.createdAt).toLocaleDateString(
                  'ko-KR'
                ),
              },
            ]
              .filter(
                (item): item is { label: string; value: string } =>
                  item !== null
              )
              .map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[13px]">
                  <span className="text-ink-60">{label}</span>
                  <span className="font-bold text-ink">{value}</span>
                </div>
              ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-border bg-surface py-3 text-[14px] font-bold text-ink-60"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

// ── Info tab ──────────────────────────────────────────────────────────────────

function InfoTab({
  application,
}: {
  application: BoothApplicationResponseDto
}) {
  const { mutate: updateBooth, isPending: isSaving } = useUpdateBooth()

  const [name, setName] = useState(application.boothName)
  const [description, setDescription] = useState(application.description ?? '')
  const [operatingHours, setOperatingHours] = useState(
    application.operatingHours ?? ''
  )
  const [imageUrl, setImageUrl] = useState(application.imageUrl ?? '')
  const [saved, setSaved] = useState(false)

  const boothId = application.boothId

  function handleSave() {
    if (!boothId) return
    updateBooth(
      {
        boothId,
        body: {
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          operatingHours: operatingHours.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        },
      }
    )
  }

  return (
    <div className="max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[18px] font-extrabold text-ink">부스 정보</div>
          <div className="text-[12px] text-ink-60">
            부스 정보를 수정하고 저장하세요
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!boothId || isSaving}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white transition-colors disabled:opacity-40',
            saved ? 'bg-pop' : 'bg-cta'
          )}
        >
          <div className="size-4">{I.check('#fff')}</div>
          {saved ? '저장됨' : isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      {!boothId && (
        <div className="mb-4 rounded-xl bg-sun/10 px-4 py-3 text-[13px] text-[#B8860B]">
          승인 완료 후 부스 정보를 수정할 수 있어요
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1.5 text-[12px] font-bold text-ink-60">부스명</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!boothId}
            className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[12px] font-bold text-ink-60">
            부스 소개
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!boothId}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[12px] font-bold text-ink-60">
            운영 시간
          </div>
          <input
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            disabled={!boothId}
            placeholder="예: 10:00 ~ 18:00"
            className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[12px] font-bold text-ink-60">
            이미지 URL
          </div>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={!boothId}
            placeholder="https://..."
            className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  )
}

// ── Waiting tab ───────────────────────────────────────────────────────────────

function WaitingTab({
  boothId,
  boothName,
}: {
  boothId: string
  boothName: string
}) {
  const { data: waitingList = [] } = useBoothWaitings(boothId)
  const { mutate: callWaiting } = useCallWaiting(boothId)
  const { mutate: updateStatus } = useUpdateWaitingStatus(boothId)

  const notifiedRef = useRef<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [notifiedKeys, setNotifiedKeys] = useState<ReadonlySet<string>>(
    new Set()
  )

  const queueOnly = waitingList.filter((w) => w.status === 'WAITING')
  const active = waitingList.filter(
    (w) => w.status === 'WAITING' || w.status === 'CALLED'
  )
  const finished = waitingList.filter(
    (w) => w.status === 'SEATED' || w.status === 'CANCELLED'
  )

  const queueKey = queueOnly.map((w) => w.id).join(',')

  useEffect(() => {
    const toFire: { key: string; msg: string }[] = []
    queueOnly.forEach((w, i) => {
      const pos = i + 1
      const key3 = `${w.id}-3`
      const key1 = `${w.id}-1`
      if (pos === 4 && !notifiedRef.current.has(key3))
        toFire.push({
          key: key3,
          msg: `${pos}번 팀에게 3팀 전 알림을 발송했어요`,
        })
      if (pos === 2 && !notifiedRef.current.has(key1))
        toFire.push({
          key: key1,
          msg: `${pos}번 팀에게 1팀 전 알림을 발송했어요`,
        })
    })
    if (toFire.length === 0) return
    toFire.forEach((f) => notifiedRef.current.add(f.key))
    setNotifiedKeys(new Set(notifiedRef.current))
    setToast(toFire[toFire.length - 1].msg)
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [queueKey]) // eslint-disable-line react-hooks/exhaustive-deps

  function getNotifBadge(w: WaitingResponseDto) {
    if (notifiedKeys.has(`${w.id}-1`)) return '1팀 전 알림 발송'
    if (notifiedKeys.has(`${w.id}-3`)) return '3팀 전 알림 발송'
    return null
  }

  return (
    <div className="relative max-w-2xl p-6">
      {toast && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2.5 rounded-2xl border border-pop/30 bg-pop/10 px-4 py-3 text-[13px] font-semibold text-pop shadow-lg backdrop-blur-sm md:right-8 md:top-6">
          <span>📱</span>
          {toast}
        </div>
      )}

      <div className="mb-6">
        <div className="text-[18px] font-extrabold text-ink">웨이팅 관리</div>
        <div className="text-[12px] text-ink-60">
          {boothName} · 3팀·1팀 전 자동 알림
        </div>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-2.5">
        {[
          {
            label: '대기 중',
            count: queueOnly.length,
            color: FESTIV_TOKENS.ink,
          },
          {
            label: '호출됨',
            count: waitingList.filter((w) => w.status === 'CALLED').length,
            color: FESTIV_TOKENS.coral,
          },
          {
            label: '입장 완료',
            count: waitingList.filter((w) => w.status === 'SEATED').length,
            color: FESTIV_TOKENS.pop,
          },
          {
            label: '취소',
            count: waitingList.filter((w) => w.status === 'CANCELLED').length,
            color: FESTIV_TOKENS.ink40,
          },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface p-3 text-center"
          >
            <div className="text-[22px] font-extrabold" style={{ color }}>
              {count}
            </div>
            <div className="text-[10px] text-ink-60">{label}</div>
          </div>
        ))}
      </div>

      {active.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface py-12 text-center">
          <div className="mb-1 text-[15px] font-bold text-ink-60">
            대기 중인 팀이 없어요
          </div>
          <div className="text-[12px] text-ink-40">
            사용자가 웨이팅 등록 시 여기에 표시됩니다
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            대기 목록
          </div>
          {active.map((w, idx) => {
            const badge = getNotifBadge(w)
            const queuePos = queueOnly.findIndex((q) => q.id === w.id) + 1
            return (
              <div
                key={w.id}
                className={cn(
                  'rounded-2xl border p-4 transition-colors',
                  w.status === 'CALLED'
                    ? 'border-cta/30 bg-cta/5'
                    : 'border-border bg-surface'
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                    style={{
                      background:
                        w.status === 'CALLED'
                          ? FESTIV_TOKENS.coral
                          : FESTIV_TOKENS.ink40,
                    }}
                  >
                    {queuePos > 0 ? queuePos : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-ink">
                        {w.partySize}명
                      </span>
                      {w.callCount > 0 && (
                        <span className="text-[12px] text-ink-60">
                          호출 {w.callCount}회
                        </span>
                      )}
                      {badge && (
                        <span className="rounded-full bg-pop/15 px-2 py-0.5 text-[10px] font-bold text-pop">
                          📱 {badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12px] text-ink-60">
                      {new Date(w.registeredAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      등록
                    </div>
                  </div>
                </div>

                {w.status === 'WAITING' ? (
                  <button
                    type="button"
                    onClick={() => callWaiting(w.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta py-2.5 text-[13px] font-extrabold text-white"
                  >
                    <div className="size-4">{I.call('#fff')}</div>
                    호출하기
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus({
                          waitingId: w.id,
                          body: { status: 'SEATED' },
                        })
                      }
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-pop py-2.5 text-[13px] font-extrabold text-white"
                    >
                      <div className="size-4">{I.check('#fff')}</div>
                      입장 완료
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus({
                          waitingId: w.id,
                          body: { status: 'CANCELLED' },
                        })
                      }
                      className="rounded-xl border border-border bg-surface py-2.5 text-[13px] font-bold text-ink-60 hover:bg-surface-alt"
                    >
                      취소 (노쇼)
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {finished.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            처리 완료 ({finished.length})
          </div>
          <div className="flex flex-col gap-1.5 opacity-50">
            {finished.map((w, idx) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[13px] font-extrabold text-ink-40">
                  {idx + 1}
                </div>
                <div className="flex-1 text-[13px] text-ink-60">
                  {w.partySize}명
                </div>
                <div
                  className={cn(
                    'text-[11px] font-bold',
                    w.status === 'SEATED' ? 'text-pop' : 'text-ink-40'
                  )}
                >
                  {w.status === 'SEATED' ? '입장 완료' : '취소'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

type TabKey = 'info' | 'waiting'

export function BoothAdminDashboard() {
  const navigate = useNavigate()
  const {
    data: application,
    isLoading,
    isError,
    error,
  } = useMyBoothApplication()
  const [tab, setTab] = useState<TabKey>('info')

  const is404 =
    isError &&
    (error as { response?: { status?: number } })?.response?.status === 404

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate(ROUTES.BOOTH_ADMIN.LOGIN)
  }, [navigate])

  useEffect(() => {
    if (isError && !is404) navigate(ROUTES.BOOTH_ADMIN.LOGIN)
  }, [isError, is404, navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate(ROUTES.BOOTH_ADMIN.LOGIN)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg font-festi text-ink-40">
        불러오는 중...
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 font-festi">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-surface-alt text-4xl">
          📋
        </div>
        <div className="mb-2 text-[22px] font-extrabold text-ink">
          부스 신청 내역이 없어요
        </div>
        <div className="mb-8 text-[13px] text-ink-60">
          부스 신청 후 관리자 승인을 기다려주세요
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-border px-5 py-2.5 text-[13px] font-bold text-ink-60"
        >
          로그아웃
        </button>
      </div>
    )
  }

  if (application.status === 'PENDING' || application.status === 'REJECTED') {
    return <StatusScreen application={application} onLogout={handleLogout} />
  }

  const hasNightWaiting =
    application.status === 'APPROVED' &&
    application.boothType === 'NIGHT' &&
    !!application.boothId

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: '부스 정보' },
    ...(hasNightWaiting ? [{ key: 'waiting' as TabKey, label: '웨이팅' }] : []),
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg font-festi">
      <header className="sticky top-14 z-40 flex items-center gap-4 border-b border-border bg-surface px-5 py-3.5 md:top-0">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold text-ink">
            {application.boothName}
          </div>
          <div className="text-[11px] text-ink-60">
            {BOOTH_TYPE_LABEL[application.boothType] ?? application.boothType}{' '}
            부스
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-bold text-ink-60 hover:bg-surface-alt"
        >
          로그아웃
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-48 shrink-0 border-r border-border bg-surface pt-5 md:block">
          <div className="px-3">
            <div className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-40">
              메뉴
            </div>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition-colors',
                  tab === key
                    ? 'bg-mint-soft text-ink'
                    : 'text-ink-60 hover:bg-surface-alt'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-surface md:hidden">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors',
                tab === key ? 'text-cta' : 'text-ink-40'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {tab === 'info' && <InfoTab application={application} />}
          {tab === 'waiting' && application.boothId && (
            <WaitingTab
              boothId={application.boothId}
              boothName={application.boothName}
            />
          )}
        </main>
      </div>
    </div>
  )
}
