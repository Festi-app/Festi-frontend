import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, FestiterMark } from '../../tokens'

export function MobileSplash() {
  const navigate = useNavigate()
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setOut(true)
      setTimeout(() => navigate('/home', { replace: true }), 400)
    }, 2000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center font-festi"
      style={{
        background: `linear-gradient(160deg, ${FESTI_TOKENS.mintSoft} 0%, #fff 60%)`,
        opacity: out ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* 로고 */}
      <div
        style={{
          animation: 'splash-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
          animationDelay: '0.1s',
        }}
      >
        <div
          className="mb-5 flex size-20 items-center justify-center rounded-[28px] shadow-[0_12px_40px_rgba(0,198,224,0.25)]"
          style={{ background: FESTI_TOKENS.coral }}
        >
          <FestiterMark size={28} mono color="#fff" />
        </div>
      </div>

      {/* 워드마크 */}
      <div
        style={{
          animation: 'splash-fade-up 0.5s ease both',
          animationDelay: '0.35s',
        }}
      >
        <FestiterMark size={30} />
      </div>

      {/* 슬로건 */}
      <div
        className="mt-2 text-[13px] font-medium tracking-[-0.1px] text-ink-60"
        style={{
          animation: 'splash-fade-up 0.5s ease both',
          animationDelay: '0.5s',
        }}
      >
        축제를 더 즐겁게
      </div>

      {/* 로딩 도트 */}
      <div
        className="absolute bottom-16 flex gap-1.5"
        style={{
          animation: 'splash-fade-up 0.4s ease both',
          animationDelay: '0.7s',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-1.5 rounded-full"
            style={{
              background: FESTI_TOKENS.coral,
              animation: `splash-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splash-pop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-dot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40%            { opacity: 1;    transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
