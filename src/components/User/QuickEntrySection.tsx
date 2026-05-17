import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, PhotoSlot } from '../../tokens'
import { SectionHeader } from './SectionHeader'

const BOOTHS = [
  {
    n: 38,
    name: '체대 곱창집',
    tag: '야식',
    area: '진리관 앞',
    wait: 1,
    tone: 'mint',
  },
  {
    n: 67,
    name: '청춘 만두',
    tag: '분식',
    area: '학생회관 옆',
    wait: 0,
    tone: 'leaf',
  },
  {
    n: 6,
    name: '학생회 굿즈샵',
    tag: '판매',
    area: '베어드홀',
    wait: 0,
    tone: 'coral',
  },
  {
    n: 53,
    name: '아랍어 비빔',
    tag: '식사',
    area: '한경직 앞',
    wait: 2,
    tone: 'sun',
  },
]

export function QuickEntrySection({
  dark = false,
  compact = false,
}: {
  dark?: boolean
  compact?: boolean
}) {
  const navigate = useNavigate()

  return (
    <>
      {compact ? (
        <div className="flex items-center gap-3 px-5 pb-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-bold tracking-[0.3px] text-ink-40">
            빠른 입장 가능한 부스
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : (
        <SectionHeader
          title="지금 바로 입장 가능"
          sub="대기 2팀 이하 · 빠르게 방문해보세요"
          dark={dark}
        />
      )}
      <div
        className={`flex gap-3 overflow-x-auto px-5 pb-1 ${compact ? 'mb-0' : 'mb-6'}`}
      >
        {BOOTHS.map((b) => {
          const badgeBg =
            b.wait === 0
              ? FESTI_TOKENS.pop
              : b.wait === 1
                ? '#A3E635'
                : FESTI_TOKENS.sun
          return (
            <button
              key={b.n}
              type="button"
              onClick={() => navigate('/booth')}
              className="w-36 shrink-0 rounded-[20px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.97]"
            >
              <div className="relative mb-2.5">
                <PhotoSlot label="" tone={b.tone} ratio="1/1" radius={14} />
                <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.85)] px-2 py-0.75 text-[11px] font-bold text-white">
                  #{b.n}
                </div>
                <div
                  className="absolute right-2 bottom-2 rounded-full px-2 py-0.75 text-[11px] font-bold text-[#141A1F]"
                  style={{ background: badgeBg }}
                >
                  {b.wait === 0 ? '바로 입장' : `${b.wait}팀`}
                </div>
              </div>
              <div className="text-sm font-bold leading-[1.2] tracking-[-0.3px] text-ink">
                {b.name}
              </div>
              <div className="mt-1 text-[11px] text-ink-60">
                {b.tag} · {b.area}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
