import type { ReactElement, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I } from '../../tokens'
import { FestivMark, FestivWordmark } from '../Logo'
import { cn } from '../../lib/cn'

function AdminSidebar({ active }: { active: string }) {
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
      id: 'timetable',
      label: '공연 타임테이블',
      icon: I.clock,
      badge: null,
      to: '/admin/timetable',
    },
    {
      id: 'notices',
      label: '공지/이벤트',
      icon: I.megaphone,
      badge: null,
      to: '/admin/notices',
    },
  ]

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface px-3.5 py-5">
      <div className="mb-7.5 flex items-center gap-2 px-2 py-1">
        <div className="flex items-center gap-1.5 text-[#141A1F] dark:text-white">
          <FestivMark size={25} color="currentColor" />
          <FestivWordmark size={22} color="currentColor" />
        </div>
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
                {item.icon(selected ? '#fff' : FESTIV_TOKENS.ink60)}
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

export function AdminShell({
  active = 'booths',
  children,
}: {
  active?: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg font-festi text-ink">
      <AdminSidebar active={active} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
