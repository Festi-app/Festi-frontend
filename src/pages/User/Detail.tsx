import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  TRUCK_BOOTHS,
  DAY_BOOTHS,
  NIGHT_BOOTHS,
  NIGHT_BOOTH_MENUS,
  DAY_BOOTH_MENUS,
  TRUCK_BOOTH_MENUS,
} from '../../data/booths'
import type { MenuItem } from '../../data/booths'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { PhotoHero } from '../../components/User/PhotoHero'
import { ScreenHeader, SubHeader } from '../../components/User/ScreenHeader'
import { Toast } from '../../components/shared/Toast'
import { MenuItemCard } from '../../components/User/MenuItemCard'
import { StatGrid } from '../../components/User/StatGrid'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { useWaitingStore } from '../../stores/useWaitingStore'
import { ConfirmModal } from '../../components/User/ConfirmModal'

// ── Reusable booth detail body ────────────────────────────────────────────────

export function BoothDetailContent({
  dark = false,
  name,
  cat = '',
  id,
  type,
  catPill,
  hours,
  days,
  desc,
  area,
  menus,
}: {
  dark?: boolean
  name: string
  cat?: string
  id: number
  type: string
  catPill?: { color: string; ink: string }
  hours?: string
  days?: string[]
  desc?: string
  area?: string
  menus?: MenuItem[]
}) {
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'
  const isTruck = type === 'truck'
  const isNight = type === 'night'
  const resolvedCatPill = catPill ?? { color: surfaceAlt, ink: ink80 }
  const resolvedMenus = menus ?? []
  const defaultHours = isNight ? '17시 ~ 22시' : isTruck ? '' : '10시 ~ 18시'

  const circleColor = isTruck
    ? FESTIV_TOKENS.sun
    : isNight
      ? FESTIV_TOKENS.alert
      : FESTIV_TOKENS.pop
  const pillBg = isTruck
    ? FESTIV_TOKENS.sunSoft
    : isNight
      ? FESTIV_TOKENS.alertSoft
      : FESTIV_TOKENS.popSoft
  const pillInk = isTruck
    ? FESTIV_TOKENS.sun
    : isNight
      ? FESTIV_TOKENS.alert
      : FESTIV_TOKENS.pop
  const typeLabel = isTruck ? '푸드트럭' : isNight ? '야간' : '주간'

  return (
    <>
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
          style={{
            background: circleColor,
            boxShadow: `inset 0 0 0 3px #fff, 0 4px 12px ${circleColor}66`,
          }}
        >
          {id}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            <Pill color={pillBg} ink={pillInk}>
              {typeLabel}
            </Pill>
            {!isNight && !isTruck && cat && (
              <Pill color={resolvedCatPill.color} ink={resolvedCatPill.ink}>
                {cat}
              </Pill>
            )}
            {area && (
              <Pill color={surfaceAlt} ink={ink80}>
                {area}
              </Pill>
            )}
          </div>
          <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
            {name}
          </div>
          {desc && (
            <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
              {desc}
            </div>
          )}
        </div>
      </div>

      <StatGrid
        className="mt-4"
        stats={[
          { label: '운영 날짜', value: days ? days.join(', ') : '전일 운영' },
          { label: '운영 시간', value: hours ?? defaultHours },
        ]}
      />

      {resolvedMenus.length > 0 && (
        <>
          <SubHeader title="메뉴" right={`총 ${resolvedMenus.length}종`} />
          <div className="flex flex-col gap-2.5">
            {resolvedMenus.map((m, i) => (
              <MenuItemCard
                key={i}
                name={m.name}
                desc={m.desc ?? ''}
                price={m.price ?? 0}
                tone={m.tone ?? 'leaf'}
                soldOut={m.soldOut}
                showImage
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

// ── Screen: Booth Detail ──────────────────────────────────────────────────────

export function MobileBoothDetail({
  dark = false,
  type = 'night',
  id,
}: {
  dark?: boolean
  type?: string
  id?: number
}) {
  const navigate = useNavigate()
  const isNight = type === 'night'
  const isTruck = type === 'truck'
  const { isSaved, toggleSave } = useFavoritesStore()
  const { waitings, cancelWaiting } = useWaitingStore()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const boothType = isNight
    ? ('night' as const)
    : isTruck
      ? ('truck' as const)
      : ('day' as const)

  const fallbackId = isNight ? 16 : isTruck ? 1 : 6
  const resolvedId = id ?? fallbackId
  const favorite = isSaved(boothType, resolvedId)
  const alreadyWaiting =
    isNight && waitings.some((w) => w.boothId === resolvedId)

  function toggleFavorite() {
    toggleSave(boothType, resolvedId)
    setToast(favorite ? 'unsaved' : 'saved')
    setTimeout(() => setToast(null), 2000)
  }
  const rawBooth = isNight
    ? NIGHT_BOOTHS.find((b) => b.id === resolvedId)
    : isTruck
      ? TRUCK_BOOTHS.find((t) => t.id === resolvedId)
      : DAY_BOOTHS.find((b) => b.id === resolvedId)
  const boothData = {
    ...(rawBooth ??
      (isNight ? NIGHT_BOOTHS[0] : isTruck ? TRUCK_BOOTHS[0] : DAY_BOOTHS[0])),
    label: isTruck ? 'cover · food truck' : `cover · booth #${resolvedId}`,
  }

  const menus = useMemo(
    () =>
      isNight
        ? NIGHT_BOOTH_MENUS.filter((m) => m.boothId === resolvedId)
        : isTruck
          ? TRUCK_BOOTH_MENUS.filter((m) => m.boothId === resolvedId)
          : DAY_BOOTH_MENUS.filter((m) => m.boothId === resolvedId),
    [isNight, isTruck, resolvedId]
  )

  const heroHeight = isTruck ? 'h-72' : 'h-80'
  const bodyHeight = isTruck
    ? 'h-[calc(100%-288px+28px)]'
    : 'h-[calc(100%-320px+28px)]'

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <PhotoHero
        tone={boothData.tone}
        label={boothData.label}
        height={heroHeight}
        showDots={!isTruck}
        onBack={() => navigate(-1)}
        favorite={favorite}
        onFavorite={toggleFavorite}
      />

      {/* Body */}
      <div
        className={`relative z-2 -mt-7 ${bodyHeight} overflow-auto overscroll-none rounded-t-[28px] bg-surface px-5 pt-5 ${isNight ? 'pb-36' : 'pb-10'}`}
      >
        <BoothDetailContent
          dark={dark}
          name={boothData.name}
          cat={boothData.cat}
          id={boothData.id}
          type={type}
          area={boothData.area}
          hours={boothData.hours}
          days={rawBooth?.days}
          desc={boothData.desc}
          menus={menus}
        />
      </div>

      {/* Sticky CTA - night only */}
      {isNight && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,#ffffff_30%)] px-5 pt-3 pb-7 dark:bg-[linear-gradient(180deg,transparent_0%,#1a1e23_30%)]">
          {boothData.wait == null || boothData.wait === 0 ? (
            <div className="flex w-full items-center justify-between rounded-[20px] bg-pop px-5 py-4">
              <div>
                <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px] text-white">
                  지금 바로 입장해주세요!
                </div>
                <div className="text-[11px] font-semibold text-white/70">
                  대기 없이 바로 입장 가능합니다
                </div>
              </div>
              <div className="size-4.5 text-white">
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <path
                    d="M3 8l3.5 3.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                alreadyWaiting
                  ? setConfirmCancel(true)
                  : navigate(`/waiting/register?id=${boothData.id}`, {
                      replace: true,
                    })
              }
              className={`flex items-center w-full justify-between rounded-[20px] px-5 py-4 text-left transition-transform duration-100 active:scale-[0.98] ${
                alreadyWaiting
                  ? 'bg-[#D0D5D8] text-ink-60 dark:bg-[#2F353B] dark:text-ink-40'
                  : 'bg-cta text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]'
              }`}
            >
              <div>
                <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px]">
                  {alreadyWaiting ? '이미 웨이팅 중' : '웨이팅 걸기'}
                </div>
                <div className="text-[11px] font-semibold opacity-60">
                  {alreadyWaiting
                    ? '웨이팅을 취소할 수 있어요'
                    : `현재 ${boothData.wait}팀 대기`}
                </div>
              </div>
              <div className="size-4.5">
                {I.chev(alreadyWaiting ? undefined : '#fff', 'r')}
              </div>
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmCancel}
        title="웨이팅을 취소할까요?"
        body={
          <>
            {boothData.name} · 웨이팅
            <br />
            취소 후에는 다시 등록해야 합니다.
          </>
        }
        confirmLabel="취소하기"
        onConfirm={() => {
          cancelWaiting(resolvedId)
          setConfirmCancel(false)
        }}
        onClose={() => setConfirmCancel(false)}
      />

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

// ── Screen: Booth List ────────────────────────────────────────────────────────

const BOOTH_LIST_CONFIG = {
  night: { items: NIGHT_BOOTHS, title: '야간 부스', base: '/booth?type=night' },
  day: { items: DAY_BOOTHS, title: '주간 부스', base: '/booth?type=day' },
  truck: { items: TRUCK_BOOTHS, title: '푸드트럭', base: '/booth?type=truck' },
} as const

export function MobileBoothList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isSaved, toggleSave } = useFavoritesStore()
  const type = (searchParams.get('type') ?? 'night') as
    | 'day'
    | 'night'
    | 'truck'

  const { items, title, base: detailBase } = BOOTH_LIST_CONFIG[type]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <ScreenHeader title={title} />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3.5 pb-27.5">
        <div className="flex flex-col gap-3">
          {items.map((b) => {
            const saved = isSaved(type, b.id)
            return (
              <div
                key={b.id}
                onClick={() => navigate(`${detailBase}&id=${b.id}`)}
                className="cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="flex items-start gap-3.5 p-3">
                  <div className="size-24 shrink-0 overflow-hidden rounded-[14px]">
                    <PhotoSlot
                      label=""
                      tone={b.tone}
                      radius={14}
                      ratio="1/1"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-start text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                          {b.name}
                        </div>
                        <div className="mt-0.5 text-start text-xs text-ink-60">
                          {b.area}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(type, b.id)
                        }}
                        className="mt-0.5 size-4.5 shrink-0"
                      >
                        {I.star(
                          saved ? FESTIV_TOKENS.alert : undefined,
                          saved ? FESTIV_TOKENS.alert : 'none'
                        )}
                      </button>
                    </div>
                    {b.desc && (
                      <div
                        className="mt-1 text-start text-[11px] text-ink-40"
                        style={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {b.desc}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <FestiTabBar active="home" />
    </div>
  )
}
