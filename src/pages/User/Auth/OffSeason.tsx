import { FestivMark, FestivWordmark } from '../../../components/Logo'
import { ROUTES } from '../../../constants/routes'
import { useFestivalStore } from '../../../stores/useFestivalStore'
import { useTimetableStore } from '../../../stores/useTimetableStore'
import { FESTIV_TOKENS } from '../../../tokens'
import { getDDayInfo } from '../../../utils/getDayInfo'
import { useNavigate } from 'react-router-dom'


const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const

function formatFestivalDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd} ${DAY_KO[d.getDay()]}`
}

export function UserOffSeason({ dark = false }: { dark?: boolean }) {
  const { startDate, endDate } = useFestivalStore()
  const { festivalName } = useTimetableStore()
  const dday = getDDayInfo(startDate, endDate)
  const navigate = useNavigate()

  const bg = dark
    ? `linear-gradient(160deg, #1A2028 0%, #0F1216 100%)`
    : `linear-gradient(160deg, ${FESTIV_TOKENS.mintSoft} 0%, #fff 70%)`

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-8 font-festi"
      style={{ background: bg }}
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-[28px] bg-coral shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,198,224,0.25)]">
        <FestivMark color="#fff" size={48} />
      </div>

      <FestivWordmark size={28} color={dark ? '#F2F5F7' : FESTIV_TOKENS.ink} />

      <div className="mt-4 text-center">
        <div className="text-[13px] font-semibold text-ink-60">
          {festivalName}
        </div>
        <div className="mt-0.5 text-[13px] font-medium text-ink-60">
          {formatFestivalDate(startDate)} — {formatFestivalDate(endDate)}
        </div>
      </div>

      <div
        className="mt-8 flex flex-col items-center justify-center rounded-3xl px-10 py-6"
        style={{
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,198,224,0.07)',
          border: `1.5px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,198,224,0.2)'}`,
        }}
      >
        {dday.type === 'before' ? (
          <>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-coral">
              D-day
            </div>
            <div className="mt-1 text-[56px] font-extrabold leading-none tracking-[-2px] text-ink">
              {dday.days}
            </div>
            <div className="mt-1.5 text-[13px] font-semibold text-ink-60">
              일 후 축제가 시작돼요
            </div>
          </>
        ) : (
          <>
            <div className="text-[24px] font-extrabold tracking-[-0.5px] text-ink">
              축제가 끝났어요.
            </div>
            <div className="mt-2 text-[13px] font-medium text-ink-60">
              다음 축제에서 또 만나요!
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(ROUTES.HOME)}
        className="mt-6 rounded-2xl border border-border bg-surface px-6 py-3 text-[13px] font-bold text-ink-80"
      >
        축제 미리 구경하기
      </button>

      <div className="absolute bottom-10 flex flex-col items-center gap-1.5 text-ink-60">
        <span className="text-[12px] font-medium">축제를 더 즐겁게,</span>
        <FestivWordmark
          size={14}
          color={dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60}
        />
      </div>
    </div>
  )
}
