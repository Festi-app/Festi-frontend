import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { DayNightToggle } from '../../components/User/DayNightToggle'
import { FESTI_TOKENS, I, PhotoSlot } from '../../tokens'
import { AppHeader } from '../../components/User/ScreenHeader'
import { useDayNightStore } from '../../stores/useDayNightStore'
import { SectionHeader } from '../../components/User/SectionHeader'
import { WaitingCarousel } from '../../components/User/WaitingCarousel'
import { NoticeSheet } from '../../components/User/NoticeSheet'


// ── Timetable data ────────────────────────────────────────────────────────────

type Slot = {
  time: string
  end: string
  name: string
  artist: string
  now?: boolean
}

const TIMETABLE: Record<number, Slot[]> = {
  1: [
    {
      time: '14:00',
      end: '15:30',
      name: '오프닝 세레모니',
      artist: '총학생회',
    },
    {
      time: '15:30',
      end: '17:00',
      name: '버스킹 1부',
      artist: '어쿠스틱 트리오',
    },
    {
      time: '17:00',
      end: '18:30',
      name: '댄스 퍼포먼스',
      artist: '중앙 댄스동아리',
    },
    {
      time: '18:30',
      end: '20:00',
      name: '인디 밴드 공연',
      artist: '블루문 밴드',
    },
  ],
  2: [
    {
      time: '17:00',
      end: '18:30',
      name: '오프닝 퍼포먼스',
      artist: '총학생회',
      now: true,
    },
    {
      time: '18:30',
      end: '20:00',
      name: '밴드 공연',
      artist: '소울 인 더 박스',
    },
    {
      time: '20:00',
      end: '21:30',
      name: '버스킹',
      artist: '어쿠스틱 듀오 봄날',
    },
    {
      time: '21:30',
      end: '23:00',
      name: '피날레 공연',
      artist: '스페셜 게스트',
    },
  ],
  3: [
    { time: '16:00', end: '17:30', name: '오후 버스킹', artist: '재즈 앙상블' },
    { time: '17:30', end: '19:00', name: '록 밴드 공연', artist: '더 선셋' },
    { time: '19:00', end: '20:30', name: '힙합 스테이지', artist: 'MC 봄바람' },
    {
      time: '20:30',
      end: '22:30',
      name: '클로징 페스타',
      artist: '전체 출연진',
    },
  ],
}

// 목업 현재 시각: 17:45 (2일차 기준)
const NOW_MIN = 17 * 60 + 45
const CURRENT_DAY = 2

// ── Screen: Home ─────────────────────────────────────────────────────────────

export function MobileHome({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { isDay } = useDayNightStore()
  const [timetableDay, setTimetableDay] = useState(CURRENT_DAY)
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false)
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
            축제명 · DAY {CURRENT_DAY}
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
          <SectionHeader
            title="지금 바로 입장 가능"
            sub="대기 2팀 이하 · 빠르게 방문해보세요"
            dark={dark}
          />
          <div className="mb-6 flex gap-3 overflow-x-auto px-5 pb-1">
            {[
              {
                n: 38,
                name: '체대 곱창집',
                tag: '야식',
                area: '진리관 앞',
                wait: 1,
                tone: 'mint',
              },
              {
                n: 67,
                name: '청춘 만두',
                tag: '분식',
                area: '학생회관 옆',
                wait: 0,
                tone: 'leaf',
              },
              {
                n: 6,
                name: '학생회 굿즈샵',
                tag: '판매',
                area: '베어드홀',
                wait: 0,
                tone: 'coral',
              },
              {
                n: 53,
                name: '아랍어 비빔',
                tag: '식사',
                area: '한경직 앞',
                wait: 2,
                tone: 'sun',
              },
            ].map((b, i) => {
              // 바로입장: 초록(pop) / 1팀: 라임 / 2팀: 연두·노랑(sun)
              const badgeBg =
                b.wait === 0
                  ? FESTI_TOKENS.pop
                  : b.wait === 1
                    ? '#A3E635'
                    : FESTI_TOKENS.sun
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate('/booth')}
                  className="w-36 shrink-0 rounded-[20px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.97]"
                >
                  <div className="relative mb-2.5">
                    <PhotoSlot label="" tone={b.tone} ratio="1/1" radius={14} />
                    <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.85)] px-2 py-0.75 text-[11px] font-bold text-white">
                      #{b.n}
                    </div>
                    <div
                      className="absolute right-2 bottom-2 rounded-full px-2 py-0.75 text-[11px] font-bold text-[#141A1F]"
                      style={{ background: badgeBg }}
                    >
                      {b.wait === 0 ? '바로 입장' : `${b.wait}팀`}
                    </div>
                  </div>
                  <div className="text-sm font-bold leading-[1.2] tracking-[-0.3px] text-ink">
                    {b.name}
                  </div>
                  <div className="mt-1 text-[11px] text-ink-60">
                    {b.tag} · {b.area}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 공연 타임테이블 */}
          <div className="mb-3 flex items-end justify-between px-5">
            <div>
              <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
                공연 타임테이블
              </div>
              <div className="mt-0.5 text-xs text-ink-60">
                베어드홀 대공연장
              </div>
            </div>
            {/* Day 드롭다운 칩 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDayDropdownOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full border border-border bg-white/80 px-3 py-2 text-[13px] font-bold tracking-[-0.2px] text-ink shadow-[0_1px_8px_rgba(20,26,31,0.10)] backdrop-blur-sm dark:border-white/30 dark:bg-white/15 dark:text-white"
              >
                {timetableDay}일차
                {timetableDay === CURRENT_DAY && (
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: FESTI_TOKENS.pop }}
                  />
                )}
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  fill="none"
                  style={{
                    transform: dayDropdownOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {dayDropdownOpen && (
                <div className="absolute right-0 top-full z-20 mt-1.5 min-w-24 overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_4px_20px_rgba(20,26,31,0.15)] dark:bg-[#1A1E23]">
                  {[1, 2, 3].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => {
                        setTimetableDay(d)
                        setDayDropdownOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-bold tracking-[-0.2px] ${
                        timetableDay === d ? 'text-ink' : 'text-ink-60'
                      }`}
                    >
                      {d}일차
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{
                          background:
                            d === CURRENT_DAY
                              ? FESTI_TOKENS.pop
                              : 'transparent',
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 px-5">
            {/* 슬롯 카드 */}
            {(() => {
              const slots = TIMETABLE[timetableDay]
              const ROW_H = 64
              const toMin = (t: string) => {
                const [h, m] = t.split(':').map(Number)
                return h * 60 + m
              }
              const start = toMin(slots[0].time)
              const end = toMin(slots[slots.length - 1].end)
              const nowPct = Math.min(
                1,
                Math.max(0, (NOW_MIN - start) / (end - start))
              )
              const nowY = nowPct * ROW_H * slots.length
              const showNowBar =
                timetableDay === CURRENT_DAY && NOW_MIN > start && NOW_MIN < end

              return (
                <div
                  key={timetableDay}
                  className="relative overflow-hidden rounded-[20px] border border-border bg-surface"
                  style={{ animation: 'festi-fade-in 0.18s ease both' }}
                >
                  {slots.map((p, i) => {
                    const slotStart = toMin(p.time)
                    const slotEnd = toMin(p.end)
                    const isNow =
                      timetableDay === CURRENT_DAY &&
                      NOW_MIN >= slotStart &&
                      NOW_MIN < slotEnd
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3.5 px-4 ${i < slots.length - 1 ? 'border-b border-border' : ''} ${isNow ? 'bg-pop/4' : ''}`}
                        style={{ height: ROW_H }}
                      >
                        <div
                          className={`w-11 shrink-0 text-[13px] font-extrabold tabular-nums tracking-[-0.3px] ${isNow ? 'text-pop' : 'text-ink-60'}`}
                        >
                          {p.time}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[14px] font-bold tracking-[-0.3px] ${isNow ? 'text-ink' : 'text-ink'}`}
                            >
                              {p.name}
                            </span>
                            {isNow && (
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold"
                                style={{
                                  background: FESTI_TOKENS.pop + '22',
                                  color: FESTI_TOKENS.pop,
                                }}
                              >
                                진행중
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-60">
                            {p.artist}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* 현재 시각 바 */}
                  {showNowBar && (
                    <div
                      className="pointer-events-none absolute right-3 left-0 flex items-center gap-1.5"
                      style={{ top: nowY }}
                    >
                      <div className="h-px flex-1 bg-[linear-gradient(90deg,#22C55E,#00C6E0)]" />
                      <span className="shrink-0 rounded-full bg-[#22C55E] px-2 py-0.5 text-[10px] font-extrabold text-white">
                        지금
                      </span>
                    </div>
                  )}
                </div>
              )
            })()}
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
