import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I } from '../../tokens'
import { FestivMark, FestivWordmark } from '../Logo'
import { cn } from '../../lib/cn'
import { ROUTES } from '../../constants/routes'
import { useFestival } from '../../features/Festival/hooks/useFestival'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { useMe } from '../../features/User/hooks/useMe'
import { useUI } from '../../stores/useUIStore'

export function AdminSidebar({ active }: { active: string }) {
  const navigate = useNavigate()
  const { data: festival } = useFestival()
  const { data: festivalDays = [] } = useFestivalDays()
  const { data: me } = useMe()
  const { dark, setDark } = useUI()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const todayStr = now.toISOString().slice(0, 10)
  const currentDayIdx = festivalDays.findIndex((fd) => fd.day === todayStr)
  const currentDay = currentDayIdx >= 0 ? festivalDays[currentDayIdx] : null
  const dayLabel = currentDayIdx >= 0 ? `${currentDayIdx + 1}일차` : null

  const timeStr = now.toTimeString().slice(0, 5)
  let modeLabel: string | null = null
  if (currentDay) {
    const ds = currentDay.dayStart?.slice(0, 5)
    const de = currentDay.dayEnd?.slice(0, 5)
    const ns = currentDay.nightStart?.slice(0, 5)
    const ne = currentDay.nightEnd?.slice(0, 5)
    if (ds && de && timeStr >= ds && timeStr < de) modeLabel = '주간 모드'
    else if (ns && ne && timeStr >= ns && timeStr < ne) modeLabel = '야간 모드'
  }

  const timeDisplay = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const items: Array<{
    id: string
    label: string
    icon: (c?: string) => ReactElement
    badge: number | null
    to: string
  }> = [
    {
      id: 'home',
      label: '대시보드',
      icon: I.home,
      badge: null,
      to: ROUTES.HOME,
    },
    {
      id: 'festival',
      label: '축제 설정',
      icon: I.settings,
      badge: null,
      to: ROUTES.ADMIN.FESTIVAL,
    },
    {
      id: 'booths',
      label: '부스 배치',
      icon: I.map,
      badge: 77,
      to: ROUTES.ADMIN.BOOTHS,
    },
    {
      id: 'trucks',
      label: '푸드트럭',
      icon: I.truck,
      badge: 11,
      to: ROUTES.ADMIN.TRUCKS,
    },
    {
      id: 'booth-requests',
      label: '부스 신청 관리',
      icon: I.user,
      badge: null,
      to: ROUTES.ADMIN.BOOTH_REQUESTS,
    },
    {
      id: 'timetable',
      label: '공연 타임테이블',
      icon: I.clock,
      badge: null,
      to: ROUTES.ADMIN.TIMETABLE,
    },
    {
      id: 'notices',
      label: '공지/이벤트',
      icon: I.megaphone,
      badge: null,
      to: ROUTES.ADMIN.NOTICES,
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
        onClick={() => navigate(ROUTES.ADMIN.FESTIVAL)}
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
            {festival?.name ?? '축제'}
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

      <div className="mb-2 flex rounded-xl border border-border bg-surface-alt p-0.5">
        <button
          type="button"
          onClick={() => setDark(false)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-1.5 text-[11px] font-bold transition-colors',
            !dark
              ? 'bg-surface text-ink shadow-sm'
              : 'text-ink-40 hover:text-ink-60'
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          라이트
        </button>
        <button
          type="button"
          onClick={() => setDark(true)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-1.5 text-[11px] font-bold transition-colors',
            dark
              ? 'bg-surface text-ink shadow-sm'
              : 'text-ink-40 hover:text-ink-60'
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          다크
        </button>
      </div>

      <div className="mb-2 rounded-[14px] bg-cta p-3 text-cta-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'size-1.75 rounded-full',
                dayLabel
                  ? 'bg-mint shadow-[0_0_0_3px_rgba(169,229,231,0.2)]'
                  : 'bg-white/40'
              )}
            />
            <span className="text-[11px] font-bold tracking-[0.3px]">LIVE</span>
          </div>
          <span className="text-[11px] opacity-70">{timeDisplay}</span>
        </div>
        <div className="mt-1.5 text-[13px] font-bold tracking-[-0.2px]">
          {dayLabel
            ? [dayLabel, modeLabel].filter(Boolean).join(' · ')
            : (festival?.name ?? '축제 준비 중')}
        </div>
        <div className="mt-0.5 text-[11px] opacity-60">
          {dayLabel ? todayStr : '운영 시간 외'}
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-pop text-xs font-extrabold text-white">
          {me?.name?.[0] ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-ink">
            {me?.name ?? '관리자'}
          </div>
          <div className="text-[10px] text-ink-60">
            {me?.role === 'FESTIVAL_ADMIN'
              ? '총 관리자'
              : me?.role === 'BOOTH_MANAGER'
                ? '부스 관리자'
                : '관리자'}
          </div>
        </div>
      </div>
    </aside>
  )
}
