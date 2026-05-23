import type { MenuResponseDto } from '../../features/Booth/types/MenuResponseDto'
import { FESTIV_TOKENS, Pill } from '../../tokens'
import { MenuItemCard } from './MenuItemCard'
import { SubHeader } from './ScreenHeader'
import { StatGrid } from './StatGrid'

export function BoothDetailContent({
  dark = false,
  name,
  category = '',
  id,
  sections,
  type,
  catPill,
  operatingHours,
  days,
  description,
  area,
  menus,
  circleColor: circleColorProp,
}: {
  dark?: boolean
  name: string
  category?: string
  id?: string
  sections?: number[]
  type: string
  catPill?: { color: string; ink: string }
  operatingHours?: string
  days?: string[]
  description?: string
  area?: string
  menus?: MenuResponseDto[]
  circleColor?: string
}) {
  const surfaceAlt = dark ? '#252A30' : '#F1F7F8'
  const ink80 = dark ? '#CDD5DA' : '#2E363C'
  const isTruck = type === 'truck'
  const isNight = type === 'night'
  const resolvedMenus = menus ?? []
  const defaultHours = isNight ? '17시 ~ 22시' : isTruck ? '' : '10시 ~ 18시'

  const CAT_SOFT: Record<string, string> = {
    정보: FESTIV_TOKENS.mintSoft ?? '#D4F7F8',
    체험: FESTIV_TOKENS.grapeSoft ?? '#EDE7F8',
    마켓: FESTIV_TOKENS.sunSoft ?? '#FFF3C2',
    활동: FESTIV_TOKENS.popSoft ?? '#D9F2E2',
  }
  const resolvedCatPill =
    catPill ??
    (category && CAT_SOFT[category]
      ? { color: CAT_SOFT[category], ink: '#141A1F' }
      : { color: surfaceAlt, ink: ink80 })

  const CAT_COLOR: Record<string, string> = {
    정보: FESTIV_TOKENS.mint,
    체험: FESTIV_TOKENS.grape,
    마켓: FESTIV_TOKENS.sun,
    활동: FESTIV_TOKENS.pop,
  }
  const circleColor =
    circleColorProp ??
    (isTruck || isNight
      ? FESTIV_TOKENS.alert
      : (CAT_COLOR[category] ?? FESTIV_TOKENS.pop))

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
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
          style={{
            background: circleColor,
            boxShadow: `inset 0 0 0 3px #fff, 0 4px 12px ${circleColor}66`,
          }}
        >
          <span className="text-[13px] font-extrabold text-white">
            #{sections && sections.length > 0 ? sections[0] + 1 : id}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            <Pill color={pillBg} ink={pillInk}>
              {typeLabel}
            </Pill>
            {!isNight && !isTruck && category && (
              <Pill color={resolvedCatPill.color} ink={resolvedCatPill.ink}>
                {category}
              </Pill>
            )}
            {area && (
              <Pill color={surfaceAlt} ink={ink80}>
                {area}
              </Pill>
            )}
            {sections && sections.length > 0 && (
              <Pill color={surfaceAlt} ink={ink80}>
                {'#' + sections.map((s) => s + 1).join('·')}
              </Pill>
            )}
          </div>
          <div className="text-2xl leading-[1.2] font-extrabold tracking-[-0.7px] text-ink">
            {name}
          </div>
          {description && (
            <div className="mt-1.5 text-[13px] leading-normal text-ink-60">
              {description}
            </div>
          )}
        </div>
      </div>

      <StatGrid
        className="mt-4"
        stats={[
          { label: '운영 날짜', value: days ? days.join(', ') : '전일 운영' },
          { label: '운영 시간', value: operatingHours ?? defaultHours },
        ]}
      />

      {resolvedMenus.length > 0 && (
        <>
          <SubHeader title="메뉴" right={`총 ${resolvedMenus.length}종`} />
          <div className="flex flex-col gap-2.5">
            {resolvedMenus.map((m) => (
              <MenuItemCard
                key={m.id}
                name={m.name}
                description={m.description ?? ''}
                price={m.price}
                tone="leaf"
                isSoldOut={m.isSoldOut}
                showImage
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
