import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const WAITING_COLORS = [
  { bg: '#00C6E0', shadow: 'rgba(0,198,224,0.4)', text: '#fff' },
  { bg: '#A78BFA', shadow: 'rgba(167,139,250,0.4)', text: '#fff' },
  { bg: '#F472B6', shadow: 'rgba(244,114,182,0.4)', text: '#fff' },
]

const ACTIVE_WAITINGS = [
  { id: 1, boothNo: 34, boothName: '경영대 주점', ahead: 4, colorIdx: 0 },
  { id: 2, boothNo: 16, boothName: '컴공과 칵테일 바', ahead: 1, colorIdx: 1 },
  { id: 3, boothNo: 47, boothName: '미디어부 라멘', ahead: 7, colorIdx: 2 },
]

export function WaitingCarousel() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIdx(idx)
  }

  if (ACTIVE_WAITINGS.length === 0) return null

  return (
    <div className="mb-5.5">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {ACTIVE_WAITINGS.map((w) => {
          const c = WAITING_COLORS[w.colorIdx % WAITING_COLORS.length]
          return (
            <div
              key={w.id}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'start',
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/waiting/detail')}
                className="relative flex w-full items-center gap-3.5 overflow-hidden rounded-[20px] p-4 text-left transition-transform duration-100 active:scale-[0.98]"
                style={{
                  background: c.bg,
                  color: c.text,
                  boxShadow: `0 8px 22px ${c.shadow}`,
                }}
              >
                <div className="absolute -top-7.5 -right-7.5 size-30 rounded-full bg-white/10" />
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20 font-festi text-lg font-extrabold text-white">
                  {w.boothNo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[11px] font-semibold opacity-75">
                    웨이팅 진행 중
                  </div>
                  <div className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.3px]">
                    {w.ahead <= 3 && (
                      <span
                        className="inline-block size-1.5 shrink-0 rounded-full bg-white"
                        style={{
                          animation: 'festi-ping 1.4s ease-in-out infinite',
                        }}
                      />
                    )}
                    {w.boothName} · 앞에 {w.ahead}팀
                  </div>
                </div>
                <div
                  className="rounded-full bg-white px-3.5 py-2 text-[13px] font-extrabold"
                  style={{ color: c.bg }}
                >
                  현황
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {ACTIVE_WAITINGS.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5">
          {ACTIVE_WAITINGS.map((w, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === activeIdx ? 16 : 6,
                height: 6,
                background:
                  WAITING_COLORS[w.colorIdx % WAITING_COLORS.length].bg,
                opacity: i === activeIdx ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
