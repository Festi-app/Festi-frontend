import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, FestiterMark, I } from '../../tokens'
import { useBoothAdminStore } from '../../stores/useBoothAdminStore'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Shared admin chrome ───────────────────────────────────────────────────────

export function AdminShell({
  active = 'booths',
  children,
}: {
  active?: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg font-festi text-ink">
      <AdminSidebar active={active} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function AdminSidebar({ active }: { active: string; dark?: boolean }) {
  const navigate = useNavigate()
  const items: Array<{
    id: string
    label: string
    icon: (c?: string) => ReactElement
    badge: number | null
    to: string
  }> = [
    { id: 'home', label: '대시보드', icon: I.home, badge: null, to: '/home' },
    {
      id: 'festival',
      label: '축제 설정',
      icon: I.settings,
      badge: null,
      to: '/admin/festival',
    },
    {
      id: 'booths',
      label: '부스 배치',
      icon: I.map,
      badge: 77,
      to: '/admin/booths',
    },
    {
      id: 'trucks',
      label: '푸드트럭',
      icon: I.truck,
      badge: 11,
      to: '/admin/trucks',
    },
    {
      id: 'booth-requests',
      label: '부스 신청 관리',
      icon: I.user,
      badge: null,
      to: '/admin/booth-requests',
    },
    {
      id: 'notices',
      label: '공지/이벤트',
      icon: I.star,
      badge: null,
      to: '/admin/festival',
    },
  ]

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface px-3.5 py-5">
      <div className="mb-5.5 flex items-center gap-2 px-2 py-1">
        <FestiterMark size={20} />
        <span className="rounded-full bg-alert px-2.25 py-1 text-[9px] font-bold tracking-[0.5px] text-white">
          ADMIN
        </span>
      </div>

      <div
        onClick={() => navigate('/admin/festival')}
        className="mb-4.5 flex cursor-pointer items-center gap-2 rounded-[14px] border border-border bg-surface-alt px-3 py-2.5"
      >
        <div className="size-8 rounded-[10px] bg-mint p-1.75 text-[#141A1F]">
          {I.star()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold tracking-[0.5px] text-ink-60">FESTIVAL</div>
          <div className="text-[13px] font-bold tracking-[-0.2px] text-ink">2026 봄축제</div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const selected = item.id === active
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate(item.to)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm tracking-[-0.2px]',
                selected
                  ? 'bg-cta font-bold text-cta-ink'
                  : 'font-semibold text-ink-80'
              )}
            >
              <div className="size-4.5">
                {item.icon(selected ? '#fff' : FESTI_TOKENS.ink60)}
              </div>
              <div className="flex-1">{item.label}</div>
              {item.badge != null && (
                <div
                  className={cn(
                    'rounded-full px-1.75 py-0.5 text-[10px] font-bold',
                    selected
                      ? 'bg-mint text-[#141A1F]'
                      : 'bg-surface-alt text-ink-80'
                  )}
                >
                  {item.badge}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1" />

      <div className="mb-2 rounded-[14px] bg-cta p-3 text-cta-ink">
        <div className="flex items-center gap-1.5">
          <span className="size-1.75 rounded-full bg-mint shadow-[0_0_0_3px_rgba(169,229,231,0.2)]" />
          <span className="text-[11px] font-bold tracking-[0.3px]">LIVE</span>
        </div>
        <div className="mt-1.5 text-[13px] font-bold tracking-[-0.2px]">
          2일차 · 야간 모드
        </div>
        <div className="mt-0.5 text-[11px] opacity-70">
          20:14 · 1,243명 접속중
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-pop text-xs font-extrabold text-white">
          김
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-ink">김총학 매니저</div>
          <div className="text-[10px] text-ink-60">제 31대 총학생회</div>
        </div>
      </div>
    </aside>
  )
}

export function AdminTopBar({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  dark?: boolean
  right?: ReactNode
}) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-7 py-4.5">
      <div>
        <div className="text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          {title}
        </div>
        {sub && <div className="mt-0.5 text-xs text-ink-60">{sub}</div>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}

export function AdminBtn({
  children,
  primary,
  ghost,
  icon,
  onClick,
}: {
  children?: ReactNode
  primary?: boolean
  ghost?: boolean
  dark?: boolean
  icon?: ReactElement
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2.25 text-[13px] font-bold tracking-[-0.2px]',
        primary
          ? 'border-cta bg-cta text-cta-ink'
          : ghost
            ? 'border-border bg-transparent text-ink-80'
            : 'border-border bg-surface text-ink-80'
      )}
    >
      {icon && <div className="size-3.5">{icon}</div>}
      {children}
    </button>
  )
}

// ── Internal card / field primitives ─────────────────────────────────────────

function Card({
  title,
  right,
  children,
}: {
  title?: string
  right?: ReactNode
  children: ReactNode
  dark?: boolean
}) {
  return (
    <section className="rounded-[18px] border border-border bg-surface p-4.5">
      {(title || right) && (
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink">
            {title}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}


function TimeRow({
  ico,
  label,
  range,
  selected = false,
}: {
  ico: () => ReactElement
  label: string
  range: string
  dark?: boolean
  selected?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'size-7 rounded-lg border p-1.5',
          selected
            ? 'border-[rgba(20,26,31,0.12)] bg-[rgba(20,26,31,0.08)] text-[#5E676D]'
            : 'border-border bg-surface text-ink-60'
        )}
      >
        {ico()}
      </div>
      <div>
        <div
          className={cn(
            'text-[10px] font-semibold',
            selected ? 'text-[#5E676D]' : 'text-ink-60'
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'font-mono text-[13px] font-bold tracking-[-0.2px]',
            selected ? 'text-[#141A1F]' : 'text-ink'
          )}
        >
          {range}
        </div>
      </div>
    </div>
  )
}

// ── Screen: Festival Settings ─────────────────────────────────────────────────

interface DayConfig {
  d: string
  date: string
  dayStart: string
  dayEnd: string
  nightStart: string
  nightEnd: string
  booths: number
}

const WD_KO = ['일', '월', '화', '수', '목', '금', '토']

function buildDaysFromRange(start: string, end: string, prev: DayConfig[]): DayConfig[] {
  if (!start || !end || start > end) return prev
  const result: DayConfig[] = []
  const cur = new Date(start + 'T00:00:00')
  const last = new Date(end + 'T00:00:00')
  let i = 0
  while (cur <= last) {
    const mo = String(cur.getMonth() + 1).padStart(2, '0')
    const da = String(cur.getDate()).padStart(2, '0')
    result.push({
      d: `${i + 1}일차`,
      date: `${mo}.${da} ${WD_KO[cur.getDay()]}`,
      dayStart: prev[i]?.dayStart ?? '11:00',
      dayEnd: prev[i]?.dayEnd ?? '17:00',
      nightStart: prev[i]?.nightStart ?? '17:00',
      nightEnd: prev[i]?.nightEnd ?? '22:00',
      booths: prev[i]?.booths ?? 0,
    })
    cur.setDate(cur.getDate() + 1)
    i++
  }
  return result
}

export function AdminFestival({ dark = false }: { dark?: boolean }) {
  const accounts = useBoothAdminStore((s) => s.accounts)
  const setBoothLocation = useBoothAdminStore((s) => s.setBoothLocation)
  const rejectAccount = useBoothAdminStore((s) => s.rejectAccount)

  const [dotMenuId, setDotMenuId] = useState<string | null>(null)
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null)
  const [locationDraft, setLocationDraft] = useState('')
  const approvedBooths = accounts.filter((a) => a.status === 'approved')

  const [notice, setNotice] = useState('기본 정보와 일정, 운영 시간을 관리해요')
  const [startDate, setStartDate] = useState('2026-05-20')
  const [endDate, setEndDate] = useState('2026-05-22')
  const [selectedDay, setSelectedDay] = useState('2일차')
  const [days, setDays] = useState<DayConfig[]>([
    { d: '1일차', date: '05.20 수', dayStart: '11:00', dayEnd: '17:00', nightStart: '17:00', nightEnd: '22:00', booths: 58 },
    { d: '2일차', date: '05.21 목', dayStart: '11:00', dayEnd: '17:00', nightStart: '17:00', nightEnd: '23:00', booths: 77 },
    { d: '3일차', date: '05.22 금', dayStart: '11:00', dayEnd: '16:00', nightStart: '16:00', nightEnd: '21:00', booths: 64 },
  ])

  function updateDayTime(d: string, key: keyof Pick<DayConfig, 'dayStart' | 'dayEnd' | 'nightStart' | 'nightEnd'>, val: string) {
    setDays((prev) => prev.map((day) => (day.d === d ? { ...day, [key]: val } : day)))
  }

  function handleStartDate(v: string) {
    setStartDate(v)
    setDays((prev) => buildDaysFromRange(v, endDate, prev))
  }

  function handleEndDate(v: string) {
    setEndDate(v)
    setDays((prev) => buildDaysFromRange(startDate, v, prev))
  }

  return (
    <AdminShell active="festival" dark={dark}>
      <AdminTopBar
        title="축제 설정"
        sub={notice}
        dark={dark}
        right={
          <>
            <AdminBtn dark={dark} ghost onClick={() => setNotice('변경사항을 취소했어요')}>
              변경사항 취소
            </AdminBtn>
            <AdminBtn
              dark={dark}
              primary
              icon={I.check('#fff')}
              onClick={() => setNotice('저장 완료 · 사용자 화면에 반영됐어요')}
            >
              저장
            </AdminBtn>
          </>
        }
      />

      <div className="grid grid-cols-[1.4fr_1fr] gap-5 overflow-auto p-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* 기본 정보 + 일자별 운영 시간 */}
          <Card dark={dark} title="일정 · 운영 시간">
            {/* Dates */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">시작일</div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink focus:border-cta focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">종료일</div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink focus:border-cta focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">일자별 운영 시간</div>
            <div className="flex flex-col gap-2.5">
              {days.map((day) => {
                const selected = day.d === selectedDay
                return (
                  <div
                    key={day.d}
                    onClick={() => setSelectedDay(day.d)}
                    className={cn(
                      'cursor-pointer rounded-[14px] border',
                      selected
                        ? 'border-coral bg-coral-soft text-[#141A1F]'
                        : 'border-border bg-surface-alt text-ink'
                    )}
                  >
                    {/* Row header (always read-only) */}
                    <div className="grid grid-cols-[92px_1fr_1fr_80px_28px] items-center gap-3 p-3">
                      <div>
                        <div className={cn('text-sm font-extrabold tracking-[-0.3px]', selected ? 'text-[#141A1F]' : 'text-ink')}>
                          {day.d}
                        </div>
                        <div className={cn('mt-0.5 text-[11px]', selected ? 'text-[#5E676D]' : 'text-ink-60')}>
                          {day.date}
                        </div>
                      </div>
                      <TimeRow ico={I.sun} label="주간" range={`${day.dayStart} — ${day.dayEnd}`} selected={selected} />
                      <TimeRow ico={I.moon} label="야간" range={`${day.nightStart} — ${day.nightEnd}`} selected={selected} />
                      <div className="text-right">
                        <div className={cn('text-sm font-extrabold', selected ? 'text-[#141A1F]' : 'text-ink')}>{day.booths}</div>
                        <div className={cn('text-[10px]', selected ? 'text-[#5E676D]' : 'text-ink-60')}>부스</div>
                      </div>
                    </div>

                    {/* Inline time editor for selected row */}
                    {selected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="grid grid-cols-2 gap-3 border-t border-[rgba(20,26,31,0.1)] px-3 pb-3 pt-2.5"
                      >
                        {/* 주간 */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold text-[#5E676D]">
                            <span className="size-3">{I.sun()}</span>주간 운영
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={day.dayStart}
                              onChange={(e) => updateDayTime(day.d, 'dayStart', e.target.value)}
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                            <span className="text-[11px] text-[#5E676D]">—</span>
                            <input
                              type="time"
                              value={day.dayEnd}
                              onChange={(e) => updateDayTime(day.d, 'dayEnd', e.target.value)}
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                          </div>
                        </div>
                        {/* 야간 */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold text-[#5E676D]">
                            <span className="size-3">{I.moon()}</span>야간 운영
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={day.nightStart}
                              onChange={(e) => updateDayTime(day.d, 'nightStart', e.target.value)}
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                            <span className="text-[11px] text-[#5E676D]">—</span>
                            <input
                              type="time"
                              value={day.nightEnd}
                              onChange={(e) => updateDayTime(day.d, 'nightEnd', e.target.value)}
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* 권한 관리 */}
          <Card dark={dark} title="권한 관리">
            {/* 총 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              총 관리자
            </div>
            <div className="mb-3 flex flex-col gap-1">
              {[
                { name: '김총학', role: '최고관리자', color: 'bg-[#141A1F]' },
                { name: '박운영', role: '부관리자', color: 'bg-grape' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5"
                >
                  <div
                    className={cn(
                      'flex size-7.5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white',
                      p.color
                    )}
                  >
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">{p.name}</div>
                    <div className="text-[11px] text-ink-60">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 부스 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 관리자 ({approvedBooths.length})
            </div>
            <div className="flex flex-col gap-1">
              {approvedBooths.length === 0 && (
                <div className="py-4 text-center text-[12px] text-ink-40">
                  승인된 부스 관리자가 없어요
                </div>
              )}
              {approvedBooths.map((acc) => {
                const loc = [acc.dayLocation, acc.nightLocation]
                  .filter(Boolean)
                  .join(' · ')
                const isOpen = dotMenuId === acc.id
                const isEditing = editingLocationId === acc.id
                return (
                  <div key={acc.id} className="relative">
                    <div className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5">
                      <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-cta/15 text-[11px] font-extrabold text-cta">
                        {acc.orgName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-ink">{acc.orgName}</div>
                        <div className="text-[11px] text-ink-60">
                          {acc.representativeName}
                          {loc && ` · ${loc}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDotMenuId(isOpen ? null : acc.id)}
                        className="size-6 text-ink-40"
                      >
                        {I.dots()}
                      </button>
                    </div>

                    {/* Dot menu */}
                    {isOpen && !isEditing && (
                      <div className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocationId(acc.id)
                            setLocationDraft(loc)
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[12px] font-bold text-ink hover:bg-surface-alt"
                        >
                          <span className="size-3.5">{I.map()}</span>
                          위치 수정
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            rejectAccount(acc.id)
                            setDotMenuId(null)
                            setNotice(`${acc.orgName} 권한을 삭제했어요`)
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[12px] font-bold text-alert hover:bg-alert/5"
                        >
                          <span className="size-3.5">{I.trash(FESTI_TOKENS.alert)}</span>
                          권한 삭제
                        </button>
                      </div>
                    )}

                    {/* Inline location edit */}
                    {isEditing && (
                      <div className="mt-1 flex gap-1.5 rounded-xl border border-cta/40 bg-bg px-3 py-2">
                        <input
                          autoFocus
                          value={locationDraft}
                          onChange={(e) => setLocationDraft(e.target.value)}
                          placeholder="예: A구역 3번 · N2구역 1번"
                          className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-ink-40 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const parts = locationDraft.split('·').map((s) => s.trim())
                            if (acc.operatingTimes.includes('주간') && parts[0])
                              setBoothLocation(acc.id, '주간', parts[0])
                            if (acc.operatingTimes.includes('야간') && parts[1])
                              setBoothLocation(acc.id, '야간', parts[1])
                            setEditingLocationId(null)
                            setDotMenuId(null)
                            setNotice(`${acc.orgName} 위치를 수정했어요`)
                          }}
                          className="shrink-0 rounded-lg bg-cta px-2.5 py-1 text-[11px] font-bold text-white"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocationId(null)
                            setDotMenuId(null)
                          }}
                          className="shrink-0 rounded-lg border border-border px-2 py-1 text-[11px] font-bold text-ink-60"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
