import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { DayNightToggle } from '../../components/User/DayNightToggle'
import { FestiterMark, I, PhotoSlot } from '../../tokens'

// ── Top status bar color wash ─────────────────────────────────────────────────

export function FestiStatusWash({
  color = '#A9E5E7',
  height = 58,
}: {
  color?: string
  height?: number
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 z-1"
      style={{ height, background: color }}
    />
  )
}

// ── Section header ────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  sub,
  more = false,
  onMore,
}: {
  title: string
  sub: string
  dark?: boolean
  more?: boolean
  onMore?: () => void
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-5">
      <div>
        <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
          {title}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">{sub}</div>
      </div>
      {more && (
        <button
          type="button"
          onClick={onMore}
          className="flex items-center gap-0.5 text-[13px] font-semibold text-ink-60"
        >
          전체 <div className="size-3">{I.chev(undefined, 'r')}</div>
        </button>
      )}
    </div>
  )
}

// ── Booth card ────────────────────────────────────────────────────────────────

export function BoothCard({
  n,
  name,
  tag,
  wait,
  tone: ph,
  onClick,
}: {
  n: number
  name: string
  tag: string
  wait: string
  tone: string
  dark?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-38 shrink-0 rounded-[20px] border border-border bg-surface p-2.5 text-left"
    >
      <div className="relative mb-2.5">
        <PhotoSlot label="" tone={ph} ratio="1/1" radius={14} />
        <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.85)] px-2 py-0.75 text-[11px] font-bold text-white">
          #{n}
        </div>
        <div className="absolute right-2 bottom-2 rounded-full bg-alert px-2 py-0.75 text-[11px] font-bold text-white">
          {wait}
        </div>
      </div>
      <div className="text-sm leading-[1.2] font-bold tracking-[-0.3px] text-ink">
        {name}
      </div>
      <div className="mt-1 text-[11px] text-ink-60">{tag} · 진리관 앞</div>
    </button>
  )
}

// ── Screen: Home ─────────────────────────────────────────────────────────────

export function MobileHome({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const markColor = dark ? '#F2F5F7' : '#141A1F'

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {/* Hero header */}
      <div className="relative shrink-0 border-b border-border bg-surface px-5 pt-13.5 pb-6">
        {/* nav row */}
        <div className="mt-2 mb-5.5 flex items-center justify-between">
          <FestiterMark size={22} color={markColor} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="size-10 rounded-full bg-surface-alt p-2.5 text-ink-80"
            >
              {I.search()}
            </button>
            <button
              type="button"
              onClick={() => navigate('/waiting')}
              className="relative size-10 rounded-full bg-surface-alt p-2.5 text-ink-80"
            >
              {I.bell()}
              <div className="absolute top-2 right-2 size-2.25 rounded-full bg-pop shadow-[0_0_0_2px_#fff] dark:shadow-[0_0_0_2px_#1a1e23]" />
            </button>
          </div>
        </div>

        {/* Live chip + greeting */}
        <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-ink py-1 pr-2.5 pl-1 text-xs font-bold tracking-[-0.2px] text-white">
          <span className="rounded-full bg-pop px-2 py-0.75 text-[10px] font-extrabold tracking-[0.3px] text-[#141A1F]">
            LIVE
          </span>
          2일차 · 봄축제 둘째 날
        </div>
        <div className="text-[30px] leading-[1.15] font-extrabold tracking-[-1px] text-ink">
          오늘은 어떤 부스를
          <br />
          가볼까요?
        </div>

        <DayNightToggle />
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto pt-4.5 pb-32">
        {/* Live waiting strip */}
        <div className="mb-5.5 px-5">
          <div className="relative flex items-center gap-3.5 overflow-hidden rounded-[20px] bg-cta p-4 text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]">
            <div className="absolute -top-7.5 -right-7.5 size-30 rounded-full bg-white/10" />
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20 font-festi text-lg font-extrabold text-white">
              34
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[11px] font-semibold opacity-75">
                웨이팅 진행 중
              </div>
              <div className="text-[15px] font-bold tracking-[-0.3px]">
                경영대 주점 · 앞에 4팀
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/waiting')}
              className="rounded-full bg-white px-3.5 py-2 text-[13px] font-extrabold text-cta"
            >
              현황
            </button>
          </div>
        </div>

        {/* 오늘 인기 부스 */}
        <SectionHeader
          title="오늘 인기 부스"
          sub="베어드홀 광장 · 78팀 방문 중"
          dark={dark}
        />
        <div className="mb-6 flex gap-3 overflow-x-auto px-5">
          {[
            {
              n: 16,
              name: '컴공과 칵테일바',
              tag: '음료',
              wait: '7팀',
              tone: 'rose',
            },
            {
              n: 24,
              name: '경영대 호프',
              tag: '주점',
              wait: '12팀',
              tone: 'leaf',
            },
            {
              n: 38,
              name: '체대 곱창집',
              tag: '야식',
              wait: '3팀',
              tone: 'mint',
            },
            {
              n: 47,
              name: '미디어부 라멘',
              tag: '면류',
              wait: '5팀',
              tone: 'sun',
            },
          ].map((b, i) => (
            <BoothCard
              key={i}
              {...b}
              dark={dark}
              onClick={() => navigate('/booth')}
            />
          ))}
        </div>

        {/* 푸드트럭 */}
        <SectionHeader
          title="푸드트럭"
          sub="총 11대 · 한경직 기념관 앞"
          dark={dark}
          more
          onMore={() => navigate('/trucks')}
        />
        <div className="flex flex-col gap-2.5 px-5">
          {[
            {
              name: '브라더스 츄러스',
              sub: '츄러스 · 아이스크림',
              price: '4,000원~',
              tone: 'coral',
            },
            {
              name: '도쿄 타코야끼',
              sub: '타코야끼 · 야끼소바',
              price: '6,000원~',
              tone: 'sun',
            },
            {
              name: '훈제 통삼겹',
              sub: '꼬치 · 통삼겹',
              price: '7,000원~',
              tone: 'rose',
            },
          ].map((f, i) => (
            <button
              type="button"
              onClick={() => navigate('/trucks')}
              key={i}
              className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-2.5 text-left"
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-[14px]">
                <PhotoSlot label="" tone={f.tone} radius={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold tracking-[-0.3px] text-ink">
                  {f.name}
                </div>
                <div className="mt-0.5 text-xs text-ink-60">{f.sub}</div>
                <div className="mt-1 text-xs font-bold text-coral">
                  {f.price}
                </div>
              </div>
              <div className="size-4 text-ink-40">{I.chev(undefined, 'r')}</div>
            </button>
          ))}
        </div>
      </div>

      <FestiTabBar active="home" dark={dark} />
    </div>
  )
}
