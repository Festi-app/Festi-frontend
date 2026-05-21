import { FESTIV_TOKENS } from '../../tokens'
import { FestivMark, FestivWordmark } from '../../components/Logo'
import { useFestivalStore } from '../../stores/useFestivalStore'

function getDDayInfo(startDate: string, endDate: string) {
  const now = new Date()
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T23:59:59')
  if (now < start) {
    const diff = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { type: 'before' as const, days: diff }
  }
  if (now > end) {
    return { type: 'after' as const }
  }
  return { type: 'during' as const }
}

export function MobileOffSeason({ dark = false }: { dark?: boolean }) {
  const { startDate, endDate } = useFestivalStore()
  const dday = getDDayInfo(startDate, endDate)

  const bg = dark
    ? `linear-gradient(160deg, #1A2028 0%, #0F1216 100%)`
    : `linear-gradient(160deg, ${FESTIV_TOKENS.mintSoft} 0%, #fff 70%)`

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-8 font-festi"
      style={{ background: bg }}
    >
      <div
        className="mb-6 flex size-20 items-center justify-center rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,198,224,0.25)]"
        style={{ background: FESTIV_TOKENS.coral }}
      >
        <FestivMark color="#fff" size={48} />
      </div>

      <FestivWordmark size={28} color={dark ? '#F2F5F7' : FESTIV_TOKENS.ink} />

      <div className="mt-4 text-center">
        <div
          className="text-[13px] font-semibold"
          style={{ color: dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60 }}
        >
          2026 봄축제
        </div>
        <div
          className="mt-0.5 text-[13px] font-medium"
          style={{ color: dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60 }}
        >
          05.20 수 — 05.22 금
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
            <div
              className="text-[11px] font-extrabold uppercase tracking-widest"
              style={{ color: FESTIV_TOKENS.coral }}
            >
              D-day
            </div>
            <div
              className="mt-1 text-[56px] font-extrabold leading-none tracking-[-2px]"
              style={{ color: dark ? '#F2F5F7' : FESTIV_TOKENS.ink }}
            >
              {dday.days}
            </div>
            <div
              className="mt-1.5 text-[13px] font-semibold"
              style={{
                color: dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60,
              }}
            >
              일 후 축제가 시작돼요
            </div>
          </>
        ) : (
          <>
            <div
              className="text-[24px] font-extrabold tracking-[-0.5px]"
              style={{ color: dark ? '#F2F5F7' : FESTIV_TOKENS.ink }}
            >
              축제가 끝났어요.
            </div>
            <div
              className="mt-2 text-[13px] font-medium"
              style={{
                color: dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60,
              }}
            >
              다음 축제에서 또 만나요!
            </div>
          </>
        )}
      </div>

      <div
        className="absolute bottom-10 flex flex-col items-center gap-1.5"
        style={{ color: dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60 }}
      >
        <span className="text-[12px] font-medium">축제를 더 즐겁게,</span>
        <FestivWordmark
          size={14}
          color={dark ? FESTIV_TOKENS.ink40 : FESTIV_TOKENS.ink60}
        />
      </div>
    </div>
  )
}
