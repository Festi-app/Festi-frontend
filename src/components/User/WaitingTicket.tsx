import { FESTI_TOKENS, PhotoSlot, Pill } from '../../tokens'
import { FestMark } from '../FestLogo'

// const STAR_PATH =
//   'M50,2 L50.6,48.6 L83.9,16.1 L51.4,49.4 L98,50 L51.4,50.6 L83.9,83.9 L50.6,51.4 L50,98 L49.4,51.4 L16.1,83.9 L48.6,50.6 L2,50 L48.6,49.4 L16.1,16.1 L49.4,48.6 Z'

export function WaitingTicketCard({
  dark = false,
  boothName,
  boothId,
  boothTone,
  registered,
  waitNo,
  callNo,
  progressPct,
  aheadTeams,
  etaMin,
  onCancel,
  onClick,
}: {
  dark?: boolean
  boothName: string
  boothId: number
  boothTone: string
  registered: string
  waitNo: number
  callNo: number
  progressPct: number
  aheadTeams: number
  etaMin: number
  onCancel: () => void
  onClick?: () => void
}) {
  const bgColor = dark ? '#0F1216' : '#F2F3F4'
  const cardColor = dark ? '#1A3137' : FESTI_TOKENS.ink
  const cardText = dark ? '#EAF6F7' : '#FFFFFF'

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick()
          : undefined
      }
      className={`relative overflow-hidden rounded-[28px] p-5.5 ${onClick ? 'cursor-pointer transition-transform duration-100 active:scale-[0.98]' : ''}`}
      style={{
        background: cardColor,
        color: cardText,
        border: dark ? '1px solid #2F353B' : 'none',
      }}
    >
      {/* 배경 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${FESTI_TOKENS.mint}55 0%, transparent 55%),
                       radial-gradient(circle at 20% 100%, ${FESTI_TOKENS.pop}33 0%, transparent 50%)`,
        }}
      />

      {/*/!* 별 워터마크 *!/*/}
      {/*<svg*/}
      {/*  width={200}*/}
      {/*  height={200}*/}
      {/*  viewBox="0 0 100 100"*/}
      {/*  className="pointer-events-none absolute -top-7 -right-5 opacity-[0.13]"*/}
      {/*>*/}
      {/*  <path fill="white" d={STAR_PATH} />*/}
      {/*</svg>*/}

      {/* 로고 워터마크 */}
      <div className="pointer-events-none absolute -top-7 -right-5 opacity-[0.13]">
        <FestMark color="white" size={200} />
      </div>

      {/* 대기번호 + 호출번호 */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <Pill
            color="rgba(169,229,231,0.18)"
            ink={FESTI_TOKENS.mint}
            style={{ fontSize: 11 }}
          >
            {aheadTeams <= 3 && (
              <span className="mr-1 inline-block size-1.5 animate-[festi-blink_1.6s_ease-in-out_infinite] rounded-full bg-mint" />
            )}
            대기번호
          </Pill>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <div className="font-festi text-[96px] leading-none font-extrabold tracking-[-4px] text-mint">
            {waitNo}
          </div>
          <div>
            <div className="text-[13px] font-semibold opacity-70">
              현재 호출
            </div>
            <div className="mt-0.5 text-[34px] leading-none font-extrabold tracking-[-1px]">
              {callNo}
            </div>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="mt-4.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#a9e5e7_0%,#22c36a_100%)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex justify-between text-xs font-semibold">
            <span className="opacity-70">
              앞에 <strong className="text-white">{aheadTeams}팀</strong> 남음
            </span>
            <span className="opacity-70">
              예상 대기 <strong className="text-white">~{etaMin}분</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 티켓 퍼포레이션 */}
      <div className="relative -mx-5.5 mt-5 mb-3.5 h-px border-t border-dashed border-white/20">
        <div
          className="absolute -top-3 -left-3 size-6 rounded-full"
          style={{ background: bgColor }}
        />
        <div
          className="absolute -top-3 -right-3 size-6 rounded-full"
          style={{ background: bgColor }}
        />
      </div>

      {/* 부스 정보 + 취소 */}
      <div className="relative flex items-center gap-3">
        <div className="size-11 shrink-0 overflow-hidden rounded-xl">
          <PhotoSlot label="" tone={boothTone} radius={12} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold tracking-[-0.3px]">
            {boothName}
          </div>
          <div className="mt-0.5 text-[11px] opacity-70">
            #{boothId} · {registered}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCancel()
          }}
          className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold"
        >
          취소
        </button>
      </div>
    </div>
  )
}
