import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS } from '../../tokens'
import { FestivMark, FestivWordmark } from '../../components/Logo'

const FESTIVAL_START = new Date('2026-05-20T00:00:00')
const PREVIEW_START = new Date('2026-05-17T00:00:00')

function getDDayInfo() {
  const now = new Date()
  if (now < FESTIVAL_START) {
    const diff = Math.ceil(
      (FESTIVAL_START.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    const canPreview = now >= PREVIEW_START
    return { type: 'before' as const, days: diff, canPreview }
  }
  return { type: 'after' as const, days: 0, canPreview: false }
}

export function MobileOffSeason({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const dday = getDDayInfo()

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

      {dday.canPreview && (
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mt-6 rounded-[18px] px-8 py-3.5 text-[14px] font-extrabold tracking-[-0.3px] text-white shadow-[0_8px_22px_rgba(0,198,224,0.35)] transition-transform duration-100 active:scale-[0.97]"
          style={{ background: FESTIV_TOKENS.coral }}
        >
          축제 미리 즐기기
        </button>
      )}

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
