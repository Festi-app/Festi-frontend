import { useState } from 'react'
import { tabBarPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { I, PhotoSlot } from '../../tokens'
import { DAY_BOOTHS, NIGHT_BOOTHS, TRUCK_BOOTHS } from '../../data/booths'
import { getZoneName } from '../../data/zones'
import { formatSections } from '../../lib/format'
import { useTimetableStore } from '../../stores/useTimetableStore'
import { SectionHeader } from '../../components/User/SectionHeader'
import { WaitingCarousel } from '../../components/User/WaitingCarousel'
import { NoticeSheet } from '../../components/User/NoticeSheet'
import { DayDropdown } from '../../components/User/DayDropdown'
import { TimetableCard } from '../../components/User/TimetableCard'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'

// ── Booth preview card ────────────────────────────────────────────────────────

function BoothListCard({
  name,
  tone,
  zoneName,
  sections,
  description,
  onClick,
}: {
  name?: string
  tone?: string
  zoneName?: string
  sections?: number[]
  description?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[18px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.98]"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-[14px]">
        <PhotoSlot label="" tone={tone} radius={14} ratio="1/1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold tracking-[-0.3px] text-ink">
          {name}
        </div>
        <div className="mt-0.5 text-xs text-ink-60">
          {zoneName}
          {sections && sections.length > 0 && <> #{formatSections(sections)}</>}
        </div>
        {description && (
          <div className="mt-1 truncate text-[11px] text-ink-40">
            {description}
          </div>
        )}
      </div>
      <div className="mt-0.5 size-4 text-ink-40">{I.chev(undefined, 'r')}</div>
    </button>
  )
}

// ── Screen: Home ─────────────────────────────────────────────────────────────

export function MobileHome({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { venue, currentDay, nowMin, days } = useTimetableStore()
  const [timetableDay, setTimetableDay] = useState(currentDay)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [timetableTip, setTimetableTip] = useState(false)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {/* Scrollable body */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-none"
        style={{
          animation: 'festi-fade-in 0.2s ease both',
          paddingBottom: tabBarPb,
        }}
      >
        {/* Hero header */}
        <div className="relative border-b border-border bg-surface px-5 pt-5 pb-6">
          {/* Live chip + 공지 버튼 */}
          <div className="mb-3.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-ink py-1 pr-2.5 pl-1 text-xs font-bold tracking-[-0.2px] text-bg">
              <span className="rounded-full bg-pop px-2 py-0.75 text-[10px] font-extrabold tracking-[0.3px] text-ink">
                LIVE
              </span>
              2026 봄축제 · DAY {currentDay}
            </div>
            <button
              type="button"
              onClick={() => setNoticeOpen(true)}
              className="size-10 rounded-full bg-surface-alt p-2.5 text-ink-80"
            >
              {I.megaphone()}
            </button>
          </div>
          <div className="text-[30px] leading-[1.15] font-extrabold tracking-[-1px] text-ink">
            오늘은 어떤 부스를
            <br />
            가볼까요?
          </div>
        </div>
        <div className="pt-4.5">
          {/* Live waiting strip */}
          <WaitingCarousel />

          {/* 지금 바로 입장 가능 */}
          <QuickEntrySection />

          {/* 주간 부스 */}
          <SectionHeader
            title="주간 부스"
            sub="오늘 운영 중인 부스"
            dark={dark}
            more
            onMore={() => navigate('/booths?type=day')}
            className="mt-5"
          />
          <div className="mb-6 flex flex-col gap-2.5 px-5">
            {DAY_BOOTHS.slice(0, 3).map((b) => (
              <BoothListCard
                key={b.id}
                name={b.name}
                tone={b.tone}
                zoneName={getZoneName(b.zoneId, b.type)}
                sections={b.sections}
                description={b.description}
                onClick={() => navigate(`/booth?type=day&id=${b.id}`)}
              />
            ))}
          </div>

          {/* 야간 부스 */}
          <SectionHeader
            title="야간 부스"
            sub="오늘 밤 운영 중인 부스"
            dark={dark}
            more
            onMore={() => navigate('/booths?type=night')}
          />
          <div className="mb-6 flex flex-col gap-2.5 px-5">
            {NIGHT_BOOTHS.slice(0, 3).map((b) => (
              <BoothListCard
                key={b.id}
                name={b.name}
                tone={b.tone}
                zoneName={getZoneName(b.zoneId, b.type)}
                sections={b.sections}
                description={b.description}
                onClick={() => navigate(`/booth?type=night&id=${b.id}`)}
              />
            ))}
          </div>

          {/* 공연 타임테이블 */}
          <div className="mb-3 flex items-end justify-between px-5">
            <div>
              <div className="flex items-center gap-1.5">
                <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
                  공연 타임테이블
                </div>
                <button
                  type="button"
                  onClick={() => setTimetableTip((v) => !v)}
                  className="relative flex size-4 items-center justify-center rounded-full border border-ink-20 text-[9px] font-bold text-ink-40"
                >
                  i
                  {timetableTip && (
                    <div className="absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-ink px-3 py-2 text-left text-[11px] font-semibold leading-normal text-white shadow-lg">
                      현장상황에 따라 달라질 수 있습니다
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-ink" />
                    </div>
                  )}
                </button>
              </div>
              <div className="mt-0.5 text-xs text-ink-60">{venue}</div>
            </div>
            <DayDropdown
              value={timetableDay}
              onChange={setTimetableDay}
              currentDay={currentDay}
            />
          </div>

          <div className="mb-6 px-5">
            <TimetableCard
              key={timetableDay}
              slots={days[timetableDay] ?? []}
              timetableDay={timetableDay}
              currentDay={currentDay}
              nowMin={nowMin}
            />
          </div>

          {/* 푸드트럭 */}
          <SectionHeader
            title="푸드트럭"
            sub="한경직 기념관 앞 · 총 6대"
            dark={dark}
            more
            onMore={() => navigate('/booths?type=truck')}
          />
          <div className="flex flex-col gap-2.5 px-5">
            {TRUCK_BOOTHS.slice(0, 3).map((t) => (
              <BoothListCard
                key={t.id}
                name={t.name}
                tone={t.tone}
                zoneName={getZoneName(t.zoneId, t.type)}
                sections={t.sections}
                description={t.description}
                onClick={() => navigate(`/booth?type=truck&id=${t.id}`)}
              />
            ))}
          </div>
        </div>{' '}
        {/* pt-4.5 */}
      </div>{' '}
      {/* scroll body */}
      <FestiTabBar active="home" dark={dark} />
      {noticeOpen && <NoticeSheet onClose={() => setNoticeOpen(false)} />}
    </div>
  )
}
