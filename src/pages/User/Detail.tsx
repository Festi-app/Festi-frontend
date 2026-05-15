import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'

// ── Sub-section header (shared with mobile-waiting) ───────────────────────────

export function SubHeader({
  title,
  right,
}: {
  title: string
  right?: string
  dark?: boolean
}) {
  return (
    <div className="mt-5.5 mb-3 flex items-end justify-between">
      <div className="text-[17px] leading-none font-extrabold tracking-[-0.4px] text-ink">
        {title}
      </div>
      {right && (
        <div className="text-xs font-semibold text-ink-60">{right}</div>
      )}
    </div>
  )
}

// ── Screen: Booth Detail ──────────────────────────────────────────────────────

export function MobileBoothDetail({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [favorite, setFavorite] = useState(true)
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      {/* Photo hero */}
      <div className="relative h-80">
        <PhotoSlot
          label="cover · booth #16"
          tone="rose"
          ratio="auto"
          radius={0}
          className="h-full"
          style={{ aspectRatio: 'auto' }}
        />
        <div className="absolute inset-x-0 top-0 h-27.5 bg-[linear-gradient(180deg,rgba(15,42,51,0.4)_0%,rgba(15,42,51,0)_100%)]" />
        <div className="absolute top-13.5 right-4 left-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#141A1F] backdrop-blur-lg"
          >
            <div className="size-4.5">{I.chev(undefined, 'l')}</div>
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFavorite((v) => !v)}
              className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#141A1F] backdrop-blur-lg"
            >
              <div className="size-4.5">
                {I.star(
                  favorite ? FESTI_TOKENS.alert : undefined,
                  favorite ? FESTI_TOKENS.alert : 'none'
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/me')}
              className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#141A1F] backdrop-blur-lg"
            >
              <div className="size-4.5">{I.dots()}</div>
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.25">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${
                i === 0 ? 'w-4.5 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative z-2 -mt-7 h-[calc(100%-320px+28px)] overflow-auto rounded-t-[28px] bg-surface px-5 pt-5 pb-36">
        <div className="mb-2 flex gap-1.5">
          <Pill color={FESTI_TOKENS.alert} ink="#fff">
            야간 주점
          </Pill>
          <Pill color={surfaceAlt} ink={ink80}>
            #16 · 베어드홀 동측
          </Pill>
        </div>
        <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
          컴공과 칵테일 바
        </div>
        <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
          시원한 수제 칵테일과 안주로 오늘 밤을
          <br />
          특별하게 만들어 드려요 🍹
        </div>

        {/* Meta strip */}
        <div className="mt-4 grid grid-cols-2 rounded-2xl bg-surface-alt py-3">
          {[
            { l: '현재 대기', v: '7팀', s: '예상 22분' },
            { l: '운영 시간', v: '~22시', s: '17시 오픈' },
          ].map((x, i) => (
            <div
              key={i}
              className={`text-center ${i < 2 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[11px] font-semibold text-ink-60">{x.l}</div>
              <div className="mt-1 text-[17px] font-extrabold tracking-[-0.3px] text-ink">
                {x.v}
              </div>
              <div className="mt-0.5 text-[10px] text-ink-40">{x.s}</div>
            </div>
          ))}
        </div>

        <SubHeader title="메뉴" right="총 6종" dark={dark} />
        <div className="flex flex-col gap-2.5">
          {[
            {
              name: '청포도 모히토',
              desc: '무알콜 가능',
              price: 6000,
              t: 'leaf',
              hot: true,
            },
            {
              name: '히비스커스 진토닉',
              desc: '시그니처',
              price: 7000,
              t: 'rose',
              hot: false,
            },
            {
              name: '복숭아 슬러시',
              desc: '논알콜',
              price: 5000,
              t: 'sun',
              hot: false,
            },
            {
              name: '안주 - 나초 플래터',
              desc: '치즈 듬뿍',
              price: 8000,
              t: 'coral',
              hot: false,
            },
          ].map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2"
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                <PhotoSlot label="" tone={m.t} radius={12} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-bold tracking-[-0.3px] text-ink">
                    {m.name}
                  </div>
                  {m.hot && (
                    <Pill
                      color={FESTI_TOKENS.pop}
                      ink={FESTI_TOKENS.ink}
                      style={{ fontSize: 10 }}
                    >
                      BEST
                    </Pill>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-ink-60">{m.desc}</div>
                <div className="mt-1 text-sm font-extrabold tracking-[-0.3px] text-ink">
                  {m.price.toLocaleString()}
                  <span className="text-[11px] font-semibold text-ink-60">
                    원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SubHeader title="부스 소개" dark={dark} />
        <div className="rounded-2xl bg-surface-alt p-3.5 text-[13px] leading-[1.55] text-ink-80">
          숭실대 컴퓨터학부 학생회가 운영합니다. 전 메뉴는
          <br />
          학생증 제시 시 1,000원 할인되며, 매일 21시 이후엔
          <br />
          한정 시그니처 메뉴를 추가 공개해요.
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,#ffffff_30%)] px-5 pt-3 pb-7 dark:bg-[linear-gradient(180deg,transparent_0%,#1a1e23_30%)]">
        <button
          type="button"
          onClick={() => navigate('/waiting/register')}
          className="flex items-center w-full justify-between rounded-[20px] bg-cta px-5 py-4 text-left text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]"
        >
          <div>
            <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px]">
              웨이팅 걸기
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold opacity-70">
              현재 7팀 대기
            </div>
          </div>
          <div className="size-4.5">{I.chev('#fff', 'r')}</div>
        </button>
      </div>
    </div>
  )
}

// ── Screen: Food Truck List ───────────────────────────────────────────────────

export function MobileFoodTrucks({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const trucks = [
    {
      name: '브라더스 츄러스',
      spec: '츄러스 · 아이스크림',
      price: '4,000원',
      wait: 0,
      tone: 'coral',
      open: true,
      tag: '디저트',
    },
    {
      name: '도쿄 타코야끼',
      spec: '타코야끼 · 야끼소바',
      price: '6,000원',
      wait: 2,
      tone: 'sun',
      open: true,
      tag: '분식',
    },
    {
      name: '훈제 통삼겹',
      spec: '통삼겹 · 꼬치',
      price: '7,000원',
      wait: 4,
      tone: 'rose',
      open: true,
      tag: '구이',
    },
    {
      name: '청춘 만두',
      spec: '왕만두 · 떡볶이',
      price: '5,000원',
      wait: 0,
      tone: 'leaf',
      open: true,
      tag: '분식',
    },
    {
      name: '코코넛 라떼',
      spec: '음료 전문',
      price: '4,500원',
      wait: 1,
      tone: 'mint',
      open: true,
      tag: '음료',
    },
    {
      name: '심야 라멘바',
      spec: '돈코츠 · 미소',
      price: '8,000원',
      wait: 3,
      tone: 'grape',
      open: false,
      tag: '면류',
    },
  ]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-surface px-5 pt-13.5 pb-4">
        <div className="mt-1.5 mb-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="size-9 text-ink"
          >
            <div className="mt-1.5 size-5.5">{I.chev(undefined, 'l')}</div>
          </button>
          <div className="flex-1 text-lg font-extrabold tracking-[-0.4px] text-ink">
            푸드트럭
          </div>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="size-9 p-2 text-ink-60"
          >
            {I.search()}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5 pb-27.5">
        <div className="flex flex-col gap-3">
          {trucks.map((tr, i) => (
            <button
              type="button"
              onClick={() => navigate('/booth')}
              key={i}
              className={`overflow-hidden rounded-[20px] border border-border bg-surface ${
                tr.open ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5 p-3">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-[14px]">
                  <PhotoSlot
                    label=""
                    tone={tr.tone}
                    radius={14}
                    className="h-full"
                    style={{ aspectRatio: 'auto' }}
                  />
                  {!tr.open && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-[rgba(15,42,51,0.55)] text-xs font-bold text-white">
                      준비중
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 ">
                  <div className="mt-1 text-[15px] text-start font-extrabold tracking-[-0.3px] text-ink">
                    {tr.name}
                  </div>
                  <div className="mt-0.5 text-xs text-start text-ink-60">
                    {tr.spec}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-extrabold tracking-[-0.3px] text-ink">
                      {tr.price}{' '}
                      <span className="text-[11px] font-medium text-ink-60">
                        부터
                      </span>
                    </div>
                    {tr.wait > 0 ? (
                      <div className="rounded-full bg-pop px-2 py-1 text-[11px] font-bold text-[#141A1F]">
                        현장 {tr.wait}팀
                      </div>
                    ) : (
                      <div className="rounded-full bg-pop-soft px-2 py-1 text-[11px] font-bold text-pop">
                        바로 주문 가능
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <FestiTabBar active="home" dark={dark} />
    </div>
  )
}
