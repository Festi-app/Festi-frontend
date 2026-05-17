import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { ScreenHeader, SubHeader } from '../../components/User/ScreenHeader'
import { Toast } from '../../components/shared/Toast'
import { PhotoHero } from '../../components/User/PhotoHero'
import { MenuItemCard } from '../../components/User/MenuItemCard'
import { StatGrid } from '../../components/User/StatGrid'

// ── Screen: Booth Detail ──────────────────────────────────────────────────────

export function MobileBoothDetail({
  dark = false,
  alreadyWaiting = false,
}: {
  dark?: boolean
  alreadyWaiting?: boolean
}) {
  const navigate = useNavigate()
  const [favorite, setFavorite] = useState(true)
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  function toggleFavorite() {
    const next = !favorite
    setFavorite(next)
    setToast(next ? 'saved' : 'unsaved')
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <PhotoHero
        tone="rose"
        label="cover · booth #16"
        height="h-80"
        showDots
        onBack={() => navigate(-1)}
        favorite={favorite}
        onFavorite={toggleFavorite}
      />

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

        <StatGrid
          className="mt-4"
          stats={[
            { label: '현재 대기', value: '7팀', sub: '예상 22분' },
            { label: '운영 시간', value: '17시 ~ 22시' },
          ]}
        />

        <SubHeader title="메뉴" right="총 6종" />
        <div className="flex flex-col gap-2.5">
          {[
            {
              name: '청포도 모히토',
              desc: '무알콜 가능',
              price: 6000,
              tone: 'leaf',
              best: true,
            },
            {
              name: '히비스커스 진토닉',
              desc: '시그니처',
              price: 7000,
              tone: 'rose',
              best: false,
            },
            {
              name: '복숭아 슬러시',
              desc: '논알콜',
              price: 5000,
              tone: 'sun',
              best: false,
            },
            {
              name: '안주 - 나초 플래터',
              desc: '치즈 듬뿍',
              price: 8000,
              tone: 'coral',
              best: false,
            },
          ].map((m, i) => (
            <MenuItemCard key={i} {...m} />
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,#ffffff_30%)] px-5 pt-3 pb-7 dark:bg-[linear-gradient(180deg,transparent_0%,#1a1e23_30%)]">
        <button
          type="button"
          disabled={alreadyWaiting}
          onClick={() => navigate('/waiting/register', { replace: true })}
          className={`flex items-center w-full justify-between rounded-[20px] px-5 py-4 text-left transition-transform duration-100 ${
            alreadyWaiting
              ? 'bg-surface-alt text-ink-40 cursor-not-allowed'
              : 'bg-cta text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)] active:scale-[0.98]'
          }`}
        >
          <div>
            <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px]">
              {alreadyWaiting ? '이미 웨이팅 중' : '웨이팅 걸기'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold opacity-70">
              현재 7팀 대기
            </div>
          </div>
          <div className="size-4.5">
            {I.chev(alreadyWaiting ? undefined : '#fff', 'r')}
          </div>
        </button>
      </div>

      {toast && (
        <Toast
          message={
            toast === 'saved' ? '저장되었습니다' : '저장이 취소되었습니다'
          }
          icon={
            toast === 'saved' ? (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert">
                {I.star('#fff', '#fff')}
              </div>
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="#FF6B6B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )
          }
        />
      )}
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
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'

  function toggleFavorite() {
    const next = !favorite
    setFavorite(next)
    setToast(next ? 'saved' : 'unsaved')
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <PhotoHero
        tone="sun"
        label="cover · food truck"
        height="h-72"
        onBack={() => navigate(-1)}
        favorite={favorite}
        onFavorite={toggleFavorite}
      />

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

        <StatGrid
          className="mt-4"
          stats={[
            { label: '운영 시간', value: '12시 ~ 21시', sub: '특이 사항' },
          ]}
        />

        <SubHeader title="메뉴" right="총 4종" />
        <div className="flex flex-col gap-2.5">
          {[
            {
              name: '오리지널 츄러스',
              desc: '시나몬 슈가',
              price: 4000,
              tone: 'sun',
              best: true,
            },
            {
              name: '초코 츄러스',
              desc: '초코 디핑 소스',
              price: 4500,
              tone: 'coral',
              best: false,
            },
            {
              name: '소프트 아이스크림',
              desc: '바닐라 / 초코',
              price: 3000,
              tone: 'mint',
              best: false,
            },
            {
              name: '츄러스 + 아이스크림 세트',
              desc: '가장 인기',
              price: 6500,
              tone: 'rose',
              best: true,
            },
          ].map((m, i) => (
            <MenuItemCard key={i} {...m} />
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

      {toast && (
        <Toast
          bottom="bottom-10"
          message={
            toast === 'saved' ? '저장되었습니다' : '저장이 취소되었습니다'
          }
          icon={
            toast === 'saved' ? (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert">
                {I.star('#fff', '#fff')}
              </div>
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="#FF6B6B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )
          }
        />
      )}
    </div>
  )
}
