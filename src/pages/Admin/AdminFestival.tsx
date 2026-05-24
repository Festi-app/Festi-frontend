import { useState } from 'react'
import { I } from '../../tokens'
import { AdminToast } from '../../components/Admin/AdminToast'
import { useFestival } from '../../features/Festival/hooks/useFestival'
import { useAdminUsers } from '../../features/User/hooks/useAdminUsers'
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

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return phone
}

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
    dayStart: apiDay.dayStart || '10:00',
    dayEnd: apiDay.dayEnd || '18:00',
    nightStart: apiDay.nightStart || '18:00',
    nightEnd: apiDay.nightEnd || '22:00',
  }
}

export function AdminFestival({ dark = false }: { dark?: boolean }) {
  const { data: festivalAdmins = [] } = useAdminUsers('FESTIVAL_ADMIN')
  const { data: boothManagers = [] } = useAdminUsers('BOOTH_MANAGER')

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
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }
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
              createFestivalDay.mutate({
                day: d.toISOString().slice(0, 10),
                dayStart: day.dayStart,
                dayEnd: day.dayEnd,
                nightStart: day.nightStart,
                nightEnd: day.nightEnd,
              })
            }
          })
          setNameOverride(null)
          setStartDateOverride(null)
          setEndDateOverride(null)
          setDayOverrides(null)
          showToast('저장 완료 · 사용자 화면에 반영됐어요')
        },
        onError: () => showToast('저장에 실패했어요. 다시 시도해주세요', false),
      }
    )
  }

  function handleCancel() {
    setNameOverride(null)
    setStartDateOverride(null)
    setEndDateOverride(null)
    setDayOverrides(null)
    showToast('변경사항을 취소했어요', false)
  }

  return (
    <AdminShell active="festival">
      <AdminTopBar
        title="축제 설정"
        sub="기본 정보와 일정, 운영 시간을 관리해요"
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
          {/* 계정 관리 */}
          <Card dark={dark} title="관리자 계정">
            {/* 총 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              총 관리자 ({festivalAdmins.length})
            </div>
            <div className="mb-3 flex flex-col gap-1">
              {festivalAdmins.length === 0 && (
                <div className="py-4 text-center text-[12px] text-ink-40">
                  총 관리자가 없어요
                </div>
              )}
              {festivalAdmins.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5"
                >
                  <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-[#141A1F] text-[11px] font-extrabold text-white">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-ink">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-ink-60">
                      {formatPhone(user.phone)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 부스 관리자 */}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 관리자 ({boothManagers.length})
            </div>
            <div className="flex flex-col gap-1">
              {boothManagers.length === 0 && (
                <div className="py-4 text-center text-[12px] text-ink-40">
                  부스 관리자가 없어요
                </div>
              )}
              {boothManagers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2.5 rounded-xl bg-surface-alt px-3 py-2.5"
                >
                  <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-cta/15 text-[11px] font-extrabold text-cta">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-ink">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-ink-60">
                      {formatPhone(user.phone)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {toast && (
        <AdminToast
          message={toast.msg}
          variant={toast.ok ? 'success' : 'error'}
        />
      )}
    </AdminShell>
  )
}
