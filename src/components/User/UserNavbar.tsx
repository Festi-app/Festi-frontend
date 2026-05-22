import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I } from '../../tokens'
import { ROUTES } from '../../constants/routes'
import { tabBarOuterPb } from '../../lib/safeArea'

const OUTER_STYLE = {
  paddingBottom: tabBarOuterPb,
  touchAction: 'none' as const,
}

export function UserNavBar({
  active = 'home',
  dark = false,
}: {
  active?: string
  dark?: boolean
}) {
  const navigate = useNavigate()
  const muted = dark ? '#8B939B' : '#5E676D'
  const items = [
    { id: 'home', label: '홈', icon: I.home, to: ROUTES.HOME },
    { id: 'map', label: '배치도', icon: I.map, to: ROUTES.MAP },
    { id: 'wait', label: '웨이팅', icon: I.ticket, to: ROUTES.WAITING },
    { id: 'me', label: '마이', icon: I.user, to: ROUTES.MY },
  ]

  return (
    <div
      className="absolute right-0 bottom-0 left-0 z-50 bg-bg px-3"
      style={OUTER_STYLE}
    >
      <div className="flex items-stretch rounded-[28px] border border-[rgba(15,42,51,0.06)] bg-white/90 p-1.5 font-festi shadow-[0_8px_32px_rgba(20,26,31,0.14)] backdrop-blur-xl dark:border-white/5 dark:bg-[#13262D]/90">
        {items.map((it) => {
          const on = it.id === active
          return (
            <button
              type="button"
              key={it.id}
              onClick={() => navigate(it.to)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] py-2 transition ${
                on ? 'bg-mint text-[#141A1F]' : 'text-ink-60'
              }`}
              style={{ color: on ? FESTIV_TOKENS.ink : muted }}
            >
              <div className="size-5.5">{it.icon()}</div>
              <div className="text-[11px] font-bold tracking-[-0.2px]">
                {it.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
