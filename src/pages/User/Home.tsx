import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { DayNightToggle } from '../../components/User/DayNightToggle'
import { I, PhotoSlot } from '../../tokens'
import { AppHeader } from '../../components/User/ScreenHeader'
import { useDayNightStore } from '../../stores/useDayNightStore'
import { useTimetableStore } from '../../stores/useTimetableStore'
import { SectionHeader } from '../../components/User/SectionHeader'
import { WaitingCarousel } from '../../components/User/WaitingCarousel'
import { NoticeSheet } from '../../components/User/NoticeSheet'
import { DayDropdown } from '../../components/User/DayDropdown'
import { TimetableCard } from '../../components/User/TimetableCard'
import { QuickEntrySection } from '../../components/User/QuickEntrySection'

// ── Screen: Home ─────────────────────────────────────────────────────────────

export function MobileHome({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { isDay } = useDayNightStore()
  const { venue, currentDay, nowMin, days } = useTimetableStore()
  const [timetableDay, setTimetableDay] = useState(currentDay)
  const [noticeOpen, setNoticeOpen] = useState(false)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      {/* Scrollable body */}
      <div
        key={isDay ? 'day' : 'night'}
        className="min-h-0 flex-1 overflow-y-auto pb-32"
        style={{ animation: 'festi-fade-in 0.2s ease both' }}
      >
        {/* Hero header */}
        <div className="relative border-b border-border bg-surface px-5 pt-13.5 pb-6">
          <AppHeader
            dark={dark}
            className="mt-2 mb-5.5"
            right={
              <button
                type="button"
                onClick={() => setNoticeOpen(true)}
                className="size-10 rounded-full bg-surface-alt p-2.5 text-ink-80"
              >
                {I.megaphone()}
              </button>
            }
          />

          {/* Live chip + greeting */}
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-ink py-1 pr-2.5 pl-1 text-xs font-bold tracking-[-0.2px] text-bg">
            <span className="rounded-full bg-pop px-2 py-0.75 text-[10px] font-extrabold tracking-[0.3px] text-[#141A1F]">
              LIVE
            </span>
            2026 봄축제 · DAY {currentDay}
          </div>
          <div className="text-[30px] leading-[1.15] font-extrabold tracking-[-1px] text-ink">
            오늘은 어떤 부스를
            <br />
            가볼까요?
          </div>

          <DayNightToggle fullWidth />
        </div>
        <div className="pt-4.5">
          {/* Live waiting strip */}
          <WaitingCarousel />

          {/* 지금 바로 입장 가능 */}
          <QuickEntrySection dark={dark} />

          {/* 공연 타임테이블 */}
          <div className="mb-3 flex items-end justify-between px-5">
            <div>
              <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
                공연 타임테이블
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
            onMore={() => navigate('/trucks')}
          />
          <div className="flex flex-col gap-2.5 px-5">
            {[
              {
                name: '브라더스 츄러스',
                menu: '츄러스 · 아이스크림',
                price: '4,000원~',
                location: '1번 구역',
                tone: 'coral',
              },
              {
                name: '도쿄 타코야끼',
                menu: '타코야끼 · 야끼소바',
                price: '6,000원~',
                location: '2번 구역',
                tone: 'sun',
              },
              {
                name: '훈제 통삼겹',
                menu: '꼬치 · 통삼겹',
                price: '7,000원~',
                location: '3번 구역',
                tone: 'rose',
              },
            ].map((f, i) => (
              <button
                type="button"
                onClick={() => navigate('/truck')}
                key={i}
                className="flex w-full items-center gap-3 rounded-[18px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-[14px]">
                  <PhotoSlot label="" tone={f.tone} radius={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold tracking-[-0.3px] text-ink">
                    {f.name}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-60">{f.menu}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs font-bold text-coral">
                      {f.price}
                    </span>
                    <span className="text-[10px] text-ink-40">
                      · {f.location}
                    </span>
                  </div>
                </div>
                <div className="size-4 text-ink-40">
                  {I.chev(undefined, 'r')}
                </div>
              </button>
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
