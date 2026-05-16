import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { ScreenHeader, SubHeader } from '../../components/User/ScreenHeader'

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

        <SubHeader title="메뉴" right="총 6종" />
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

        <SubHeader title="부스 소개" />
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
          className="flex items-center w-full justify-between rounded-[20px] bg-cta px-5 py-4 text-left text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)] transition-transform duration-100 active:scale-[0.98]"
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

export function MobileFoodTrucks() {
  const navigate = useNavigate()
  const trucks = [
    {
      name: '브라더스 츄러스',
      spec: '츄러스 · 아이스크림',
      price: '4,000원',
      hours: '12:00 ~ 21:00',
      tone: 'coral',
      open: true,
      tag: '디저트',
    },
    {
      name: '도쿄 타코야끼',
      spec: '타코야끼 · 야끼소바',
      price: '6,000원',
      hours: '15:00 ~ 22:00',
      tone: 'sun',
      open: true,
      tag: '분식',
    },
    {
      name: '훈제 통삼겹',
      spec: '통삼겹 · 꼬치',
      price: '7,000원',
      hours: '17:00 ~ 23:00',
      tone: 'rose',
      open: true,
      tag: '구이',
    },
    {
      name: '청춘 만두',
      spec: '왕만두 · 떡볶이',
      price: '5,000원',
      hours: '13:00 ~ 21:00',
      tone: 'leaf',
      open: true,
      tag: '분식',
    },
    {
      name: '코코넛 라떼',
      spec: '음료 전문',
      price: '4,500원',
      hours: '11:00 ~ 20:00',
      tone: 'mint',
      open: true,
      tag: '음료',
    },
    {
      name: '심야 라멘바',
      spec: '돈코츠 · 미소',
      price: '8,000원',
      hours: '18:00 ~ 23:00',
      tone: 'grape',
      open: false,
      tag: '면류',
    },
  ]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title="푸드트럭" />

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5 pb-27.5">
        <div className="flex flex-col gap-3">
          {trucks.map((tr, i) => (
            <button
              type="button"
              onClick={() => navigate('/truck')}
              key={i}
              className={`overflow-hidden rounded-[20px] border border-border bg-surface transition-transform duration-100 active:scale-[0.98] ${
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
                    <div className="text-[11px] text-ink-40">{tr.hours}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <FestiTabBar active="home" />
    </div>
  )
}

// ── Screen: Food Truck Detail ─────────────────────────────────────────────────

export function MobileTruckDetail({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [favorite, setFavorite] = useState(false)
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      {/* Photo hero */}
      <div className="relative h-72">
        <PhotoSlot
          label="cover · food truck"
          tone="sun"
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
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-2 -mt-7 h-[calc(100%-288px+28px)] overflow-auto rounded-t-[28px] bg-surface px-5 pt-5 pb-10">
        <div className="mb-2 flex gap-1.5">
          <Pill color={FESTI_TOKENS.sun} ink={FESTI_TOKENS.ink}>
            디저트
          </Pill>
          <Pill color={surfaceAlt} ink={ink80}>
            한경직 기념관 앞
          </Pill>
        </div>
        <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
          브라더스 츄러스
        </div>
        <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
          바삭한 츄러스와 부드러운 아이스크림의 만남,
          <br />
          축제의 달달한 순간을 함께해요 🍦
        </div>

        {/* Meta strip */}
        <div className="mt-4 rounded-2xl bg-surface-alt py-3">
          <div className="text-center">
            <div className="text-[11px] font-semibold text-ink-60">
              운영 시간
            </div>
            <div className="mt-1 text-[17px] font-extrabold tracking-[-0.3px] text-ink">
              ~21시
            </div>
            <div className="mt-0.5 text-[10px] text-ink-40">12시 오픈</div>
          </div>
        </div>

        <SubHeader title="메뉴" right="총 4종" />
        <div className="flex flex-col gap-2.5">
          {[
            {
              name: '오리지널 츄러스',
              desc: '시나몬 슈가',
              price: 4000,
              t: 'sun',
              best: true,
            },
            {
              name: '초코 츄러스',
              desc: '초코 디핑 소스',
              price: 4500,
              t: 'coral',
              best: false,
            },
            {
              name: '소프트 아이스크림',
              desc: '바닐라 / 초코',
              price: 3000,
              t: 'mint',
              best: false,
            },
            {
              name: '츄러스 + 아이스크림 세트',
              desc: '가장 인기',
              price: 6500,
              t: 'rose',
              best: true,
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
                  {m.best && (
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

        <SubHeader title="트럭 소개" />
        <div className="rounded-2xl bg-surface-alt p-3.5 text-[13px] leading-[1.55] text-ink-80">
          2018년부터 대학 축제를 함께해온 브라더스 츄러스입니다.
          <br />
          매일 오전 반죽을 새로 만들어 바삭하고 신선한
          <br />
          츄러스를 제공해 드려요.
        </div>
      </div>
    </div>
  )
}
