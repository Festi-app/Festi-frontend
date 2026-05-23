import { useState } from 'react'
import { tabBarPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { I } from '../../tokens'
import { DAY_BOOTHS, NIGHT_BOOTHS, TRUCK_BOOTHS } from '../../data/booths'
import { getZoneName } from '../../data/zones'
import { useTimetableStore } from '../../stores/useTimetableStore'
import { SectionHeader } from '../../components/User/Home/SectionHeader'
import { WaitingCarousel } from '../../components/User/WaitingCarousel'
import { NoticeSheet } from '../../components/User/Home/NoticeSheet'
import { DayDropdown } from '../../components/User/Home/DayDropdown'
import { TimetableCard } from '../../components/User/Home/TimetableCard'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'
import { UserBoothListCard } from '../../components/User/Home/UserBoothListCard'
import { useFestivalStore } from '../../stores/useFestivalStore'
import { boothListUrl, boothUrl } from '../../constants/routes'

export function UserHome({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { festivalName, venue, currentDay, nowMin, days } = useTimetableStore()
  const { startDate, endDate } = useFestivalStore()
  const [timetableDay, setTimetableDay] = useState(currentDay)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  const diffDays = Math.round((start.getTime() - today.getTime()) / 86400000)
  const isUpcoming = diffDays > 0
  const isEnded = today > end
  const dDayLabel = isUpcoming ? `D-${diffDays}` : `DAY ${1 - diffDays}`
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
              <span
                className="rounded-full px-2 py-0.75 text-[10px] font-extrabold tracking-[0.3px] text-ink"
                style={{
                  background: isUpcoming
                    ? '#A9E5E7'
                    : isEnded
                      ? '#FF5A5A'
                      : '#22C36A',
                }}
              >
                {isUpcoming ? 'UPCOMING' : isEnded ? 'ENDED' : 'LIVE'}
              </span>
              {festivalName}
              {!isEnded && ` · ${dDayLabel}`}
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
            {isUpcoming ? (
              <>
                부스 라인업 <br />
                미리보기 👀
              </>
            ) : isEnded ? (
              <>
                다음 축제에서
                <br />또 만나요!
              </>
            ) : (
              <>
                오늘은 어떤 부스를
                <br />
                가볼까요?
              </>
            )}
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
            onMore={() => navigate(boothListUrl('day'))}
            className="mt-5"
          />
          <div className="mb-6 flex flex-col gap-2.5 px-5">
            {DAY_BOOTHS.slice(0, 3).map((b) => (
              <UserBoothListCard
                key={b.id}
                name={b.name}
                tone={b.tone}
                zoneName={getZoneName(b.zoneId, b.type)}
                sections={b.sections}
                description={b.description}
                onClick={() => navigate(boothUrl('day', b.id))}
              />
            ))}
          </div>

          {/* 야간 부스 */}
          <SectionHeader
            title="야간 부스"
            sub="오늘 밤 운영 중인 부스"
            dark={dark}
            more
            onMore={() => navigate(boothListUrl('night'))}
          />
          <div className="mb-6 flex flex-col gap-2.5 px-5">
            {NIGHT_BOOTHS.slice(0, 3).map((b) => (
              <UserBoothListCard
                key={b.id}
                name={b.name}
                tone={b.tone}
                zoneName={getZoneName(b.zoneId, b.type)}
                sections={b.sections}
                description={b.description}
                onClick={() => navigate(boothUrl('night', b.id))}
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
            onMore={() => navigate(boothListUrl('truck'))}
          />
          <div className="flex flex-col gap-2.5 px-5">
            {TRUCK_BOOTHS.slice(0, 3).map((t) => (
              <UserBoothListCard
                key={t.id}
                name={t.name}
                tone={t.tone}
                zoneName={getZoneName(t.zoneId, t.type)}
                sections={t.sections}
                description={t.description}
                onClick={() => navigate(boothUrl('truck', t.id))}
              />
            ))}
          </div>
        </div>{' '}
        {/* pt-4.5 */}
      </div>{' '}
      {/* scroll body */}
      {noticeOpen && <NoticeSheet onClose={() => setNoticeOpen(false)} />}
    </div>
  )
}
