import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, FestiterMark, I, PhotoSlot, Pill } from '../../tokens'

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
      id: 'menus',
      label: '메뉴/상품',
      icon: I.ticket,
      badge: null,
      to: '/admin/booths',
    },
    {
      id: 'waiting',
      label: '웨이팅 관리',
      icon: I.bell,
      badge: 14,
      to: '/admin/waiting',
    },
    {
      id: 'trucks',
      label: '푸드트럭',
      icon: I.truck,
      badge: 11,
      to: '/admin/trucks',
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

      <button
        type="button"
        onClick={() => navigate('/admin/festival')}
        className="mb-4.5 flex items-center gap-2 rounded-[14px] border border-border bg-surface-alt px-3 py-2.5 text-left"
      >
        <div className="size-8 rounded-[10px] bg-mint p-1.75 text-[#141A1F]">
          {I.star()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold tracking-[0.5px] text-ink-60">
            FESTIVAL
          </div>
          <div className="text-[13px] font-bold tracking-[-0.2px] text-ink">
            2026 봄축제
          </div>
        </div>
        <div className="size-3.5 text-ink-60">{I.chev(undefined, 'd')}</div>
      </button>

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

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[11px] font-bold tracking-[-0.1px] text-ink-60">
        {label}
      </div>
      {children}
    </div>
  )
}

function TextInput({
  value,
  placeholder,
  icon,
}: {
  value: string
  dark?: boolean
  icon?: ReactElement
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold tracking-[-0.2px] text-ink">
      {icon && <div className="size-3.5">{icon}</div>}
      <input className="flex-1" placeholder={placeholder} value={value} />
    </div>
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

export function AdminFestival({ dark = false }: { dark?: boolean }) {
  const [notice, setNotice] = useState('기본 정보와 일정, 운영 시간을 관리해요')
  const [selectedDay, setSelectedDay] = useState('2일차')
  const [days, setDays] = useState([
    {
      d: '1일차',
      date: '05.20 수',
      day: '11:00 — 17:00',
      night: '17:00 — 22:00',
      booths: 58,
    },
    {
      d: '2일차',
      date: '05.21 목',
      day: '11:00 — 17:00',
      night: '17:00 — 23:00',
      booths: 77,
    },
    {
      d: '3일차',
      date: '05.22 금',
      day: '11:00 — 16:00',
      night: '16:00 — 21:00',
      booths: 64,
    },
  ])

  return (
    <AdminShell active="festival" dark={dark}>
      <AdminTopBar
        title="축제 설정"
        sub={notice}
        dark={dark}
        right={
          <>
            <AdminBtn
              dark={dark}
              ghost
              onClick={() => {
                setSelectedDay('2일차')
                setNotice('변경사항을 취소했어요')
              }}
            >
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
        <div className="flex flex-col gap-4">
          <Card dark={dark} title="기본 정보">
            <Field label="축제명" dark={dark}>
              <TextInput value="2026 숭실대학교 봄축제" dark={dark} />
            </Field>
            <Field label="부제 / 슬로건" dark={dark}>
              <TextInput value="비상 飛上 — 다시, 봄" dark={dark} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="시작일" dark={dark}>
                <TextInput
                  value="2026.05.20 (수)"
                  dark={dark}
                  icon={I.clock(FESTI_TOKENS.ink60)}
                />
              </Field>
              <Field label="종료일" dark={dark}>
                <TextInput
                  value="2026.05.22 (금)"
                  dark={dark}
                  icon={I.clock(FESTI_TOKENS.ink60)}
                />
              </Field>
            </div>
          </Card>

          <Card
            dark={dark}
            title="일자별 운영 시간"
            right={
              <AdminBtn
                dark={dark}
                ghost
                icon={I.plus(FESTI_TOKENS.ink60)}
                onClick={() => {
                  const next = days.length + 1
                  const label = `${next}일차`
                  setDays((current) => [
                    ...current,
                    {
                      d: label,
                      date: `05.${19 + next} ${next % 2 ? '금' : '목'}`,
                      day: '11:00 — 17:00',
                      night: '17:00 — 22:00',
                      booths: 0,
                    },
                  ])
                  setSelectedDay(label)
                  setNotice(`${label} 운영 시간을 추가했어요`)
                }}
              >
                일차 추가
              </AdminBtn>
            }
          >
            <div className="flex flex-col gap-2.5">
              {days.map((day) => {
                const selected = day.d === selectedDay
                return (
                  <button
                    type="button"
                    key={day.d}
                    onClick={() => {
                      setSelectedDay(day.d)
                      setNotice(`${day.d} 운영 시간을 선택했어요`)
                    }}
                    className={cn(
                      'grid grid-cols-[92px_1fr_1fr_80px_28px] items-center gap-3 rounded-[14px] border p-3 text-left',
                      selected
                        ? 'border-coral bg-coral-soft text-[#141A1F]'
                        : 'border-border bg-surface-alt text-ink'
                    )}
                  >
                    <div>
                      <div
                        className={cn(
                          'text-sm font-extrabold tracking-[-0.3px]',
                          selected ? 'text-[#141A1F]' : 'text-ink'
                        )}
                      >
                        {day.d}
                      </div>
                      <div
                        className={cn(
                          'mt-0.5 text-[11px]',
                          selected ? 'text-[#5E676D]' : 'text-ink-60'
                        )}
                      >
                        {day.date}
                      </div>
                    </div>
                    <TimeRow
                      ico={I.sun}
                      label="주간"
                      range={day.day}
                      dark={dark}
                      selected={selected}
                    />
                    <TimeRow
                      ico={I.moon}
                      label="야간"
                      range={day.night}
                      dark={dark}
                      selected={selected}
                    />
                    <div className="text-right">
                      <div
                        className={cn(
                          'text-sm font-extrabold',
                          selected ? 'text-[#141A1F]' : 'text-ink'
                        )}
                      >
                        {day.booths}
                      </div>
                      <div
                        className={cn(
                          'text-[10px]',
                          selected ? 'text-[#5E676D]' : 'text-ink-60'
                        )}
                      >
                        부스
                      </div>
                    </div>
                    <div
                      className={cn(
                        'size-4.5',
                        selected ? 'text-[#5E676D]' : 'text-ink-40'
                      )}
                    >
                      {I.dots()}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card dark={dark} title="배너 이미지">
            <div className="relative">
              <PhotoSlot
                label="hero banner · 1920×720"
                tone="mint"
                ratio="16/6"
                radius={12}
              />
              <div className="absolute right-2 bottom-2 flex gap-1.5">
                {['변경', '편집'].map((label) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() =>
                      setNotice(`배너 이미지 ${label}을 선택했어요`)
                    }
                  >
                    <Pill color="rgba(255,255,255,0.92)" ink={FESTI_TOKENS.ink}>
                      {label}
                    </Pill>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 text-[11px] text-ink-60">
              메인 홈 상단과 알림 카드에 표시됩니다.
            </div>
          </Card>

          <Card
            dark={dark}
            title="권한 관리"
            right={
              <AdminBtn
                dark={dark}
                ghost
                icon={I.plus(FESTI_TOKENS.ink60)}
                onClick={() => setNotice('새 관리자 초대를 준비했어요')}
              >
                초대
              </AdminBtn>
            }
          >
            <div className="flex flex-col gap-1.5">
              {[
                { name: '김총학', role: '최고관리자', avatar: 'bg-[#141A1F]' },
                { name: '박운영', role: '부스 관리자', avatar: 'bg-grape' },
                { name: '이미디어', role: '컨텐츠 편집자', avatar: 'bg-leaf' },
              ].map((person) => (
                <button
                  type="button"
                  key={person.name}
                  onClick={() =>
                    setNotice(`${person.name} 권한 메뉴를 열었어요`)
                  }
                  className="flex items-center gap-2.5 rounded-xl bg-surface-alt p-2.5 text-left"
                >
                  <div
                    className={cn(
                      'flex size-7.5 items-center justify-center rounded-full text-[11px] font-extrabold text-white',
                      person.avatar
                    )}
                  >
                    {person.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold tracking-[-0.2px] text-ink">
                      {person.name}
                    </div>
                    <div className="text-[11px] text-ink-60">{person.role}</div>
                  </div>
                  <div className="size-4 text-ink-40">{I.dots()}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
