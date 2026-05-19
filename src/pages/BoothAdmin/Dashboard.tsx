import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useBoothAdminStore,
  type BoothAdminAccount,
  type NightMenuItem,
  type DayActivity,
  type BoothCategoryType,
} from '../../stores/useBoothAdminStore'
import { FESTIV_TOKENS, I } from '../../tokens'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function uid() {
  return Math.random().toString(36).slice(2)
}

const CATEGORY_COLORS: Record<BoothCategoryType, string> = {
  정보: FESTIV_TOKENS.coral,
  체험: FESTIV_TOKENS.grape,
  마켓: FESTIV_TOKENS.sun,
  활동: FESTIV_TOKENS.pop,
}

// ── Pending screen ────────────────────────────────────────────────────────────

function PendingScreen({
  account,
  onLogout,
}: {
  account: BoothAdminAccount
  onLogout: () => void
}) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center bg-bg px-4 font-festi md:min-h-screen">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-surface-alt text-4xl">
            ⏳
          </div>
        </div>
        <div className="mb-2 text-[22px] font-extrabold text-ink">
          승인 대기 중
        </div>
        <div className="mb-1 text-[14px] text-ink-60">
          <span className="font-bold text-ink">{account.orgName}</span>의 가입
          신청이 검토 중이에요
        </div>
        <div className="mb-8 text-[13px] text-ink-40">
          관리자 승인 후 부스 정보를 등록할 수 있어요
        </div>

        <div className="mb-4 rounded-2xl border border-border bg-surface p-5 text-left shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]">
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            신청 정보
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: '단체명', value: account.orgName },
              { label: '유형', value: account.orgType },
              { label: '운영 시간', value: account.operatingTimes.join(' · ') },
              { label: '대표자', value: account.representativeName },
            ].map(({ label, value }) => (
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

// ── Booth item row (shared: menu & activity) ──────────────────────────────────

function BoothItemRow({
  idx,
  mode,
  name,
  desc,
  price,
  image,
  onChange,
  onRemove,
}: {
  idx: number
  mode: 'menu' | 'activity'
  name: string
  desc: string
  price?: string
  image?: string
  onChange: (patch: {
    name?: string
    desc?: string
    price?: string
    image?: string
  }) => void
  onRemove: () => void
}) {
  const imgRef = useRef<HTMLInputElement>(null)
  const title = mode === 'menu' ? `메뉴 ${idx + 1}` : `활동 ${idx + 1}`

  return (
    <div className="rounded-xl border border-border bg-bg p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-bold text-ink-40">{title}</div>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] font-semibold text-alert"
        >
          삭제
        </button>
      </div>
      <div className="flex gap-3">
        {/* Square image — self-start prevents flex stretch from making it taller than wide */}
        <button
          type="button"
          onClick={() => imgRef.current?.click()}
          className="size-16 shrink-0 self-start overflow-hidden rounded-xl border border-border bg-surface-alt"
        >
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-ink-40">
              {mode === 'menu' ? '사진' : '이미지'}
            </div>
          )}
        </button>
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onChange({ image: URL.createObjectURL(file) })
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={mode === 'menu' ? '메뉴명' : '활동명'}
            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
          <input
            value={price ?? ''}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="가격 (예: 8,000원)"
            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
          <input
            value={desc}
            onChange={(e) => onChange({ desc: e.target.value })}
            placeholder={mode === 'menu' ? '메뉴 소개' : '활동 소개'}
            className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}

// ── Info tab ──────────────────────────────────────────────────────────────────

function InfoTab({ account }: { account: BoothAdminAccount }) {
  const updateInfo = useBoothAdminStore((s) => s.updateInfo)

  const [dayName, setDayName] = useState(account.dayBoothName)
  const [dayDesc, setDayDesc] = useState(account.dayBoothDesc)
  const [dayImgUrl, setDayImgUrl] = useState<string | undefined>(
    account.dayDetailImage
  )
  const [dayActivities, setDayActivities] = useState<DayActivity[]>(
    account.dayActivities ?? []
  )
  const [nightName, setNightName] = useState(account.nightBoothName)
  const [nightDesc, setNightDesc] = useState(account.nightBoothDesc)
  const [nightImgUrl, setNightImgUrl] = useState<string | undefined>(
    account.nightDetailImage
  )
  const [menus, setMenus] = useState<NightMenuItem[]>(account.nightMenus ?? [])
  const [saved, setSaved] = useState(false)
  const dayImgRef = useRef<HTMLInputElement>(null)
  const nightImgRef = useRef<HTMLInputElement>(null)

  const hasDay = account.operatingTimes.includes('주간')
  const hasNight = account.operatingTimes.includes('야간')

  function addActivity() {
    setDayActivities((prev) => [
      ...prev,
      { id: uid(), name: '', price: '', desc: '' },
    ])
  }

  function updateActivity(id: string, patch: Partial<DayActivity>) {
    setDayActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    )
  }

  function addMenu() {
    setMenus((prev) => [...prev, { id: uid(), name: '', price: '', desc: '' }])
  }

  function updateMenu(id: string, patch: Partial<NightMenuItem>) {
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function handleSave() {
    updateInfo({
      dayBoothName: dayName,
      dayBoothDesc: dayDesc,
      dayDetailImage: dayImgUrl,
      dayActivities,
      nightBoothName: nightName,
      nightBoothDesc: nightDesc,
      nightDetailImage: nightImgUrl,
      nightMenus: menus,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[18px] font-extrabold text-ink">정보 등록</div>
          <div className="text-[12px] text-ink-60">
            부스 상세 정보를 입력하고 저장하세요
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-extrabold text-white transition-colors',
            saved ? 'bg-pop' : 'bg-cta'
          )}
        >
          <div className="size-4">{I.check('#fff')}</div>
          {saved ? '저장됨' : '저장'}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* 주간 */}
        {hasDay && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <div
                className="size-2.5 rounded-full"
                style={{ background: FESTIV_TOKENS.coral }}
              />
              <div className="text-[15px] font-extrabold text-ink">
                주간 부스
              </div>
              {account.dayCategory && (
                <span
                  className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
                  style={{
                    background:
                      CATEGORY_COLORS[account.dayCategory as BoothCategoryType],
                  }}
                >
                  {account.dayCategory}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  부스명
                </div>
                <input
                  value={dayName}
                  onChange={(e) => setDayName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  부스 간단 소개
                </div>
                <textarea
                  value={dayDesc}
                  onChange={(e) => setDayDesc(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  이미지 첨부
                </div>
                {dayImgUrl ? (
                  <div className="relative">
                    <img
                      src={dayImgUrl}
                      alt=""
                      className="h-36 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setDayImgUrl(undefined)}
                      className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-[11px] font-bold text-white"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => dayImgRef.current?.click()}
                    className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg text-[12px] font-semibold text-ink-40 hover:bg-surface-alt"
                  >
                    + 이미지 추가
                  </button>
                )}
                <input
                  ref={dayImgRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setDayImgUrl(URL.createObjectURL(file))
                  }}
                />
              </div>

              {/* Activities */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[12px] font-bold text-ink-60">
                    활동 목록{' '}
                    <span className="font-normal text-ink-40">
                      {dayActivities.length}개
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addActivity}
                    className="text-[12px] font-bold text-cta"
                  >
                    + 활동 추가
                  </button>
                </div>
                {dayActivities.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border py-6 text-center text-[12px] text-ink-40">
                    활동을 추가하세요
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {dayActivities.map((activity, idx) => (
                      <BoothItemRow
                        key={activity.id}
                        idx={idx}
                        mode="activity"
                        name={activity.name}
                        price={activity.price}
                        desc={activity.desc}
                        image={activity.image}
                        onChange={(patch) => updateActivity(activity.id, patch)}
                        onRemove={() =>
                          setDayActivities((prev) =>
                            prev.filter((a) => a.id !== activity.id)
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 야간 */}
        {hasNight && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <div
                className="size-2.5 rounded-full"
                style={{ background: FESTIV_TOKENS.grape }}
              />
              <div className="text-[15px] font-extrabold text-ink">
                야간 부스 (주점)
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  부스명
                </div>
                <input
                  value={nightName}
                  onChange={(e) => setNightName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  간단 부스 소개
                </div>
                <textarea
                  value={nightDesc}
                  onChange={(e) => setNightDesc(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>

              {/* Night overall image */}
              <div>
                <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                  전체 활동 이미지
                </div>
                {nightImgUrl ? (
                  <div className="relative">
                    <img
                      src={nightImgUrl}
                      alt=""
                      className="h-36 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNightImgUrl(undefined)}
                      className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-[11px] font-bold text-white"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => nightImgRef.current?.click()}
                    className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg text-[12px] font-semibold text-ink-40 hover:bg-surface-alt"
                  >
                    + 이미지 추가
                  </button>
                )}
                <input
                  ref={nightImgRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setNightImgUrl(URL.createObjectURL(file))
                  }}
                />
              </div>

              {/* Menus */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[12px] font-bold text-ink-60">
                    메뉴 목록{' '}
                    <span className="font-normal text-ink-40">
                      {menus.length}개
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addMenu}
                    className="text-[12px] font-bold text-cta"
                  >
                    + 메뉴 추가
                  </button>
                </div>
                {menus.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border py-6 text-center text-[12px] text-ink-40">
                    메뉴를 추가하세요
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {menus.map((menu, idx) => (
                      <BoothItemRow
                        key={menu.id}
                        idx={idx}
                        mode="menu"
                        name={menu.name}
                        desc={menu.desc}
                        price={menu.price}
                        image={menu.image}
                        onChange={(patch) => updateMenu(menu.id, patch)}
                        onRemove={() =>
                          setMenus((prev) =>
                            prev.filter((m) => m.id !== menu.id)
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Waiting tab ───────────────────────────────────────────────────────────────

function WaitingTab({ account }: { account: BoothAdminAccount }) {
  const callWaiting = useBoothAdminStore((s) => s.callWaiting)
  const completeWaiting = useBoothAdminStore((s) => s.completeWaiting)
  const cancelWaiting = useBoothAdminStore((s) => s.cancelWaiting)

  const waitingList = account.waitingList ?? []
  // Only 'waiting' entries, in order — used to compute queue position
  const queueOnly = waitingList.filter((w) => w.status === 'waiting')
  const active = waitingList.filter(
    (w) => w.status === 'waiting' || w.status === 'called'
  )
  const finished = waitingList.filter(
    (w) => w.status === 'done' || w.status === 'cancelled'
  )

  // Ref tracks which keys have already fired — no re-render needed
  const notifiedRef = useRef<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  // Mirror of notifiedRef keys for badge rendering (triggers re-render on new notification)
  const [notifiedKeys, setNotifiedKeys] = useState<ReadonlySet<string>>(
    new Set()
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
          msg: `${w.partyName}님께 3팀 전 알림을 발송했어요`,
        })
      if (pos === 2 && !notifiedRef.current.has(key1))
        toFire.push({
          key: key1,
          msg: `${w.partyName}님께 1팀 전 알림을 발송했어요`,
        })
    })
    if (toFire.length === 0) return
    toFire.forEach((f) => notifiedRef.current.add(f.key))
    setNotifiedKeys(new Set(notifiedRef.current))
    setToast(toFire[toFire.length - 1].msg)
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [queueKey]) // eslint-disable-line react-hooks/exhaustive-deps

  function getNotifBadge(id: string) {
    if (notifiedKeys.has(`${id}-1`)) return '1팀 전 알림 발송'
    if (notifiedKeys.has(`${id}-3`)) return '3팀 전 알림 발송'
    return null
  }

  return (
    <div className="relative max-w-2xl p-6">
      {/* Notification toast */}
      {toast && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-2.5 rounded-2xl border border-pop/30 bg-pop/10 px-4 py-3 text-[13px] font-semibold text-pop shadow-lg backdrop-blur-sm md:right-8 md:top-6">
          <span>📱</span>
          {toast}
        </div>
      )}

      <div className="mb-6">
        <div className="text-[18px] font-extrabold text-ink">웨이팅 관리</div>
        <div className="text-[12px] text-ink-60">
          {account.nightBoothName} · 3팀·1팀 전 자동 알림 발송
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-2.5">
        {[
          {
            label: '대기 중',
            count: queueOnly.length,
            color: FESTIV_TOKENS.ink,
          },
          {
            label: '호출됨',
            count: waitingList.filter((w) => w.status === 'called').length,
            color: FESTIV_TOKENS.coral,
          },
          {
            label: '입장 완료',
            count: waitingList.filter((w) => w.status === 'done').length,
            color: FESTIV_TOKENS.pop,
          },
          {
            label: '취소',
            count: waitingList.filter((w) => w.status === 'cancelled').length,
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

      {/* Active list */}
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
          {active.map((w) => {
            const badge = getNotifBadge(w.id)
            return (
              <div
                key={w.id}
                className={cn(
                  'rounded-2xl border p-4 transition-colors',
                  w.status === 'called'
                    ? 'border-cta/30 bg-cta/5'
                    : 'border-border bg-surface'
                )}
              >
                {/* Top row */}
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                    style={{
                      background:
                        w.status === 'called'
                          ? FESTIV_TOKENS.coral
                          : FESTIV_TOKENS.ink40,
                    }}
                  >
                    {w.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-ink">
                        {w.partyName}
                      </span>
                      <span className="text-[12px] text-ink-60">
                        {w.groupSize}명
                      </span>
                      {badge && (
                        <span className="rounded-full bg-pop/15 px-2 py-0.5 text-[10px] font-bold text-pop">
                          📱 {badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-60">
                      <a
                        href={`tel:${w.phone}`}
                        className="flex items-center gap-1 font-semibold text-cta no-underline"
                      >
                        <div className="size-3">
                          {I.call(FESTIV_TOKENS.coral)}
                        </div>
                        {w.phone}
                      </a>
                      <span>· {w.registeredAt} 등록</span>
                    </div>
                  </div>
                </div>

                {/* Action row */}
                {w.status === 'waiting' ? (
                  <button
                    type="button"
                    onClick={() => callWaiting(w.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cta py-2.5 text-[13px] font-extrabold text-white"
                  >
                    <div className="size-4">{I.call('#fff')}</div>
                    전화 후 호출함
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => completeWaiting(w.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-pop py-2.5 text-[13px] font-extrabold text-white"
                    >
                      <div className="size-4">{I.check('#fff')}</div>
                      입장 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelWaiting(w.id)}
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

      {/* Finished list */}
      {finished.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            처리 완료 ({finished.length})
          </div>
          <div className="flex flex-col gap-1.5 opacity-50">
            {finished.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[13px] font-extrabold text-ink-40">
                  {w.number}
                </div>
                <div className="flex-1 text-[13px] text-ink-60">
                  {w.partyName} · {w.phone} · {w.groupSize}명
                </div>
                <div
                  className={cn(
                    'text-[11px] font-bold',
                    w.status === 'done' ? 'text-pop' : 'text-ink-40'
                  )}
                >
                  {w.status === 'done' ? '입장 완료' : '취소'}
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
  const account = useBoothAdminStore(
    (s) => s.accounts.find((a) => a.id === s.currentAccountId) ?? null
  )
  const logout = useBoothAdminStore((s) => s.logout)
  const [tab, setTab] = useState<TabKey>('info')

  useEffect(() => {
    if (!account) navigate('/booth-admin/login')
  }, [account, navigate])

  if (!account) return null

  function handleLogout() {
    logout()
    navigate('/booth-admin/login')
  }

  if (account.status === 'pending') {
    return <PendingScreen account={account} onLogout={handleLogout} />
  }

  const hasNight = account.operatingTimes.includes('야간')
  const waitingCount = account.waitingList.filter(
    (w) => w.status === 'waiting' || w.status === 'called'
  ).length

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'info', label: '정보 등록' },
    ...(hasNight
      ? [
          {
            key: 'waiting' as TabKey,
            label: '웨이팅',
            badge: waitingCount || undefined,
          },
        ]
      : []),
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden bg-bg font-festi">
      {/* Header */}
      <header className="sticky top-14 z-40 flex items-center gap-4 border-b border-border bg-surface px-5 py-3.5 md:top-0">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold text-ink">
            {account.orgName}
          </div>
          <div className="text-[11px] text-ink-60">
            {account.representativeName} · {account.operatingTimes.join(' · ')}{' '}
            운영
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
        {/* Sidebar */}
        <aside className="hidden w-48 shrink-0 border-r border-border bg-surface pt-5 md:block">
          <div className="px-3">
            <div className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-40">
              메뉴
            </div>
            {tabs.map(({ key, label, badge }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-left transition-colors',
                  tab === key
                    ? 'bg-mint-soft text-ink'
                    : 'text-ink-60 hover:bg-surface-alt'
                )}
              >
                <span className="flex-1">{label}</span>
                {badge != null && (
                  <span className="rounded-full bg-cta px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-surface md:hidden">
          {tabs.map(({ key, label, badge }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors',
                tab === key ? 'text-cta' : 'text-ink-40'
              )}
            >
              {label}
              {badge != null && (
                <span className="absolute right-[calc(50%-14px)] top-1.5 rounded-full bg-cta px-1 text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {tab === 'info' && <InfoTab account={account} />}
          {tab === 'waiting' && hasNight && <WaitingTab account={account} />}
        </main>
      </div>
    </div>
  )
}
