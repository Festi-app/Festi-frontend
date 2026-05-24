import { useState } from 'react'
import { FESTIV_TOKENS, I } from '../../tokens'
import { useBoothAdminStore } from '../../stores/useBoothAdminStore'
import { useFestival } from '../../features/Festival/hooks/useFestival'
import { useUpdateFestival } from '../../features/Festival/hooks/useUpdateFestival'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { useUpdateFestivalDay } from '../../features/Festival/hooks/useUpdateFestivalDay'
import { useCreateFestivalDay } from '../../features/Festival/hooks/useCreateFestivalDay'
import type { FestivalDayResponseDto } from '../../features/Festival/types/FestivalDayResponseDto'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { cn } from '../../lib/cn'
import { TimeRow } from '../../components/Admin/Festival/TimeRow'
import { Card } from '../../components/Admin/Festival/Card'

// ── Screen: Festival Settings ─────────────────────────────────────────────────

interface DayConfig {
  id: string
  d: string
  date: string
  dayStart: string
  dayEnd: string
  nightStart: string
  nightEnd: string
}

const WD_KO = ['일', '월', '화', '수', '목', '금', '토']

function formatDayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${mo}.${da} ${WD_KO[d.getDay()]}`
}

function apiDayToConfig(
  apiDay: FestivalDayResponseDto,
  idx: number
): DayConfig {
  return {
    id: apiDay.id,
    d: `${idx + 1}일차`,
    date: formatDayDate(apiDay.day),
    dayStart: apiDay.dayStart,
    dayEnd: apiDay.dayEnd,
    nightStart: apiDay.nightStart,
    nightEnd: apiDay.nightEnd,
  }
}

export function AdminFestival({ dark = false }: { dark?: boolean }) {
  const accounts = useBoothAdminStore((s) => s.accounts)
  const setBoothLocation = useBoothAdminStore((s) => s.setBoothLocation)
  const rejectAccount = useBoothAdminStore((s) => s.rejectAccount)

  const [dotMenuId, setDotMenuId] = useState<string | null>(null)
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null
  )
  const [locationDraft, setLocationDraft] = useState('')
  const approvedBooths = accounts.filter((a) => a.status === 'approved')

  const { data: festival } = useFestival()
  const { data: festivalDays = [] } = useFestivalDays()
  const updateFestival = useUpdateFestival()
  const updateFestivalDay = useUpdateFestivalDay()
  const createFestivalDay = useCreateFestivalDay()

  // override = null이면 API 값 그대로 사용, 유저가 수정하면 override에 저장
  const [nameOverride, setNameOverride] = useState<string | null>(null)
  const [startDateOverride, setStartDateOverride] = useState<string | null>(
    null
  )
  const [endDateOverride, setEndDateOverride] = useState<string | null>(null)
  const [dayOverrides, setDayOverrides] = useState<DayConfig[] | null>(null)
  const [notice, setNotice] = useState('기본 정보와 일정, 운영 시간을 관리해요')
  const [selectedDay, setSelectedDay] = useState('1일차')

  const festivalName = nameOverride ?? festival?.name ?? ''
  const startDate = startDateOverride ?? festival?.startDate ?? ''
  const endDate = endDateOverride ?? festival?.endDate ?? ''

  // festivalDays API 연동 전: startDate/endDate로 일차 자동 생성
  const generatedDays: DayConfig[] = (() => {
    if (!startDate || !endDate) return []
    const s = new Date(startDate + 'T00:00:00')
    const e = new Date(endDate + 'T00:00:00')
    const total = Math.round((e.getTime() - s.getTime()) / 86400000) + 1
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(startDate + 'T00:00:00')
      d.setDate(d.getDate() + i)
      const mo = String(d.getMonth() + 1).padStart(2, '0')
      const da = String(d.getDate()).padStart(2, '0')
      const existing = festivalDays[i]
      return existing
        ? apiDayToConfig(existing, i)
        : {
            id: '',
            d: `${i + 1}일차`,
            date: `${mo}.${da} ${WD_KO[d.getDay()]}`,
            dayStart: '10:00',
            dayEnd: '18:00',
            nightStart: '18:00',
            nightEnd: '22:00',
          }
    })
  })()
  const days: DayConfig[] = dayOverrides ?? generatedDays

  function updateDayTime(
    d: string,
    key: keyof Pick<
      DayConfig,
      'dayStart' | 'dayEnd' | 'nightStart' | 'nightEnd'
    >,
    val: string
  ) {
    setDayOverrides((prev) =>
      (prev ?? generatedDays).map((day) =>
        day.d === d ? { ...day, [key]: val } : day
      )
    )
  }

  function handleSave() {
    updateFestival.mutate(
      {
        name: festivalName,
        startDate,
        endDate,
        description: festival?.description ?? undefined,
      },
      {
        onSuccess: () => {
          setNameOverride(null)
          setStartDateOverride(null)
          setEndDateOverride(null)
          setDayOverrides(null)
          setNotice('저장 완료 · 사용자 화면에 반영됐어요')
        },
        onError: () => setNotice('저장에 실패했어요. 다시 시도해주세요'),
      }
    )
    days.forEach((day, idx) => {
      if (day.id) {
        const originalDay = festivalDays.find((fd) => fd.id === day.id)
        if (!originalDay) return
        updateFestivalDay.mutate({
          festivalDayId: day.id,
          body: {
            day: originalDay.day,
            dayStart: day.dayStart,
            dayEnd: day.dayEnd,
            nightStart: day.nightStart,
            nightEnd: day.nightEnd,
          },
        })
      } else if (startDate) {
        const d = new Date(startDate + 'T00:00:00')
        d.setDate(d.getDate() + idx)
        const isoDate = d.toISOString().slice(0, 10)
        createFestivalDay.mutate({
          day: isoDate,
          dayStart: day.dayStart,
          dayEnd: day.dayEnd,
          nightStart: day.nightStart,
          nightEnd: day.nightEnd,
        })
      }
    })
  }

  function handleCancel() {
    setNameOverride(null)
    setStartDateOverride(null)
    setEndDateOverride(null)
    setDayOverrides(null)
    setNotice('변경사항을 취소했어요')
  }

  return (
    <AdminShell active="festival">
      <AdminTopBar
        title="축제 설정"
        sub={notice}
        right={
          <>
            <AdminBtn ghost onClick={handleCancel}>
              변경사항 취소
            </AdminBtn>
            <AdminBtn primary icon={I.check('#fff')} onClick={handleSave}>
              저장
            </AdminBtn>
          </>
        }
      />

      <div className="grid grid-cols-[1.4fr_1fr] gap-5 overflow-auto p-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* 축제 이름 */}
          <Card dark={dark} title="축제 이름">
            <input
              type="text"
              value={festivalName}
              onChange={(e) => setNameOverride(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink focus:border-cta focus:outline-none"
            />
          </Card>

          {/* 일정 + 일자별 운영 시간 */}
          <Card dark={dark} title="일정 · 운영 시간">
            {/* Dates */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                  시작일
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDateOverride(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink focus:border-cta focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                  종료일
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDateOverride(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink focus:border-cta focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              일자별 운영 시간
            </div>
            <div className="flex flex-col gap-2.5">
              {days.length === 0 && (
                <div className="rounded-[14px] border border-dashed border-border bg-surface-alt py-4 text-center text-[12px] text-ink-40">
                  시작일과 종료일을 먼저 설정하세요
                </div>
              )}
              {days.map((day) => {
                const selected = day.d === selectedDay
                return (
                  <div
                    key={day.d}
                    onClick={() => setSelectedDay(day.d)}
                    className={cn(
                      'cursor-pointer rounded-[14px] border',
                      selected
                        ? 'border-coral bg-coral-soft text-[#141A1F]'
                        : 'border-border bg-surface-alt text-ink'
                    )}
                  >
                    {/* Row header (always read-only) */}
                    <div className="grid grid-cols-[92px_1fr_1fr_28px] items-center gap-3 p-3">
                      <div>
                        <div
                          className={cn(
                            'text-sm font-extrabold tracking-[-0.3px]',
                            selected ? 'text-[#141A1F]' : 'text-ink'
                          )}
                        >
                          {day.d}
                        </div>
                        <div
                          className={cn(
                            'mt-0.5 text-[11px]',
                            selected ? 'text-[#5E676D]' : 'text-ink-60'
                          )}
                        >
                          {day.date}
                        </div>
                      </div>
                      <TimeRow
                        ico={I.sun}
                        label="주간"
                        range={`${day.dayStart} — ${day.dayEnd}`}
                        selected={selected}
                      />
                      <TimeRow
                        ico={I.moon}
                        label="야간"
                        range={`${day.nightStart} — ${day.nightEnd}`}
                        selected={selected}
                      />
                      <div />
                    </div>

                    {/* Inline time editor for selected row */}
                    {selected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="grid grid-cols-2 gap-3 border-t border-[rgba(20,26,31,0.1)] px-3 pb-3 pt-2.5"
                      >
                        {/* 주간 */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold text-[#5E676D]">
                            <span className="size-3">{I.sun()}</span>주간 운영
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={day.dayStart}
                              onChange={(e) =>
                                updateDayTime(day.d, 'dayStart', e.target.value)
                              }
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                            <span className="text-[11px] text-[#5E676D]">
                              —
                            </span>
                            <input
                              type="time"
                              value={day.dayEnd}
                              onChange={(e) =>
                                updateDayTime(day.d, 'dayEnd', e.target.value)
                              }
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                          </div>
                        </div>
                        {/* 야간 */}
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold text-[#5E676D]">
                            <span className="size-3">{I.moon()}</span>야간 운영
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={day.nightStart}
                              onChange={(e) =>
                                updateDayTime(
                                  day.d,
                                  'nightStart',
                                  e.target.value
                                )
                              }
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                            <span className="text-[11px] text-[#5E676D]">
                              —
                            </span>
                            <input
                              type="time"
                              value={day.nightEnd}
                              onChange={(e) =>
                                updateDayTime(day.d, 'nightEnd', e.target.value)
                              }
                              className="flex-1 rounded-lg border border-[rgba(20,26,31,0.15)] bg-white/70 px-2 py-1.5 font-mono text-[12px] font-bold text-[#141A1F] focus:border-coral focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* 권한 관리 */}
          <Card dark={dark} title="권한 관리">
            {/* 총 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              총 관리자
            </div>
            <div className="mb-3 flex flex-col gap-1">
              {[
                { name: '김총학', role: '최고관리자', color: 'bg-[#141A1F]' },
                { name: '박운영', role: '부관리자', color: 'bg-grape' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5"
                >
                  <div
                    className={cn(
                      'flex size-7.5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white',
                      p.color
                    )}
                  >
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-ink">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-ink-60">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 부스 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 관리자 ({approvedBooths.length})
            </div>
            <div className="flex flex-col gap-1">
              {approvedBooths.length === 0 && (
                <div className="py-4 text-center text-[12px] text-ink-40">
                  승인된 부스 관리자가 없어요
                </div>
              )}
              {approvedBooths.map((acc) => {
                const loc = [acc.dayLocation, acc.nightLocation]
                  .filter(Boolean)
                  .join(' · ')
                const isOpen = dotMenuId === acc.id
                const isEditing = editingLocationId === acc.id
                return (
                  <div key={acc.id} className="relative">
                    <div className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5">
                      <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-cta/15 text-[11px] font-extrabold text-cta">
                        {acc.orgName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-ink">
                          {acc.orgName}
                        </div>
                        <div className="text-[11px] text-ink-60">
                          {acc.representativeName}
                          {loc && ` · ${loc}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDotMenuId(isOpen ? null : acc.id)}
                        className="size-6 text-ink-40"
                      >
                        {I.dots()}
                      </button>
                    </div>

                    {/* Dot menu */}
                    {isOpen && !isEditing && (
                      <div className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocationId(acc.id)
                            setLocationDraft(loc)
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[12px] font-bold text-ink hover:bg-surface-alt"
                        >
                          <span className="size-3.5">{I.map()}</span>
                          위치 수정
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            rejectAccount(acc.id)
                            setDotMenuId(null)
                            setNotice(`${acc.orgName} 권한을 삭제했어요`)
                          }}
                          className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[12px] font-bold text-alert hover:bg-alert/5"
                        >
                          <span className="size-3.5">
                            {I.trash(FESTIV_TOKENS.alert)}
                          </span>
                          권한 삭제
                        </button>
                      </div>
                    )}

                    {/* Inline location edit */}
                    {isEditing && (
                      <div className="mt-1 flex gap-1.5 rounded-xl border border-cta/40 bg-bg px-3 py-2">
                        <input
                          autoFocus
                          value={locationDraft}
                          onChange={(e) => setLocationDraft(e.target.value)}
                          placeholder="예: A구역 3번 · N2구역 1번"
                          className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-ink-40 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const parts = locationDraft
                              .split('·')
                              .map((s) => s.trim())
                            if (acc.operatingTimes.includes('주간') && parts[0])
                              setBoothLocation(acc.id, '주간', parts[0])
                            if (acc.operatingTimes.includes('야간') && parts[1])
                              setBoothLocation(acc.id, '야간', parts[1])
                            setEditingLocationId(null)
                            setDotMenuId(null)
                            setNotice(`${acc.orgName} 위치를 수정했어요`)
                          }}
                          className="shrink-0 rounded-lg bg-cta px-2.5 py-1 text-[11px] font-bold text-white"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocationId(null)
                            setDotMenuId(null)
                          }}
                          className="shrink-0 rounded-lg border border-border px-2 py-1 text-[11px] font-bold text-ink-60"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
