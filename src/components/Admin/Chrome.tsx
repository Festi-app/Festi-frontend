import type { ReactElement, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, FestiterMark, I } from '../../tokens'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

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
          <div className="text-[9px] font-bold tracking-[0.5px] text-ink-60">
            FESTIVAL
          </div>
          <div className="text-[13px] font-bold tracking-[-0.2px] text-ink">
            2026 봄축제
          </div>
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
