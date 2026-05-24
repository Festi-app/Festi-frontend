import { useState, useMemo, useEffect, useCallback } from 'react'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { FESTIV_TOKENS, I } from '../../tokens'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { cn } from '../../lib/cn'
import { toMin } from '../../lib/time'
import { useFestival } from '../../features/Festival/hooks/useFestival'
import { useFestivalTimelines } from '../../features/Festival/hooks/useFestivalTimelines'
import { SlotRow } from '../../components/Admin/TimeTable/SlotRow'
import { AddSlotForm } from '../../components/Admin/TimeTable/AddSlotForm'
import { AdminToast } from '../../components/Admin/AdminToast'

export function AdminTimetable() {
  const { data: festival } = useFestival()
  const { data: timelines = [] } = useFestivalTimelines()
  const { data: festivalDays = [] } = useFestivalDays()

  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const startDate = festival?.startDate ?? ''
  const endDate = festival?.endDate ?? ''
  const currentDay = startDate
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(startDate + 'T00:00:00').getTime()) / 86400000
        ) + 1
      )
    : 1

  useEffect(() => {
    if (!festival?.startDate) return
    const t = setTimeout(() => setSelectedDay(currentDay), 0)
    return () => clearTimeout(t)
  }, [festival?.startDate, currentDay])

  const sortedFestivalDays = useMemo(
    () => [...festivalDays].sort((a, b) => a.day.localeCompare(b.day)),
    [festivalDays]
  )

  const totalDays = useMemo(() => {
    if (sortedFestivalDays.length > 0) return sortedFestivalDays.length
    if (startDate && endDate) {
      const s = new Date(startDate + 'T00:00:00')
      const e = new Date(endDate + 'T00:00:00')
      return Math.round((e.getTime() - s.getTime()) / 86400000) + 1
    }
    return 1
  }, [sortedFestivalDays.length, startDate, endDate])

  const DAYS = Array.from({ length: totalDays }, (_, i) => i + 1)

  const selectedDayData = sortedFestivalDays[selectedDay - 1]
  const slots = timelines
    .filter((t) => t.festivalDay.id === selectedDayData?.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <AdminShell active="timetable">
      <AdminTopBar
        title="공연 타임테이블"
        sub="공연 일정을 관리해요"
        right={<></>}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* 일차 탭 */}
        <div className="flex gap-1 border-b border-border bg-surface px-5 pt-3.5 pb-0">
          {DAYS.map((d) => {
            const on = d === selectedDay
            const isCurrent = d === currentDay
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setSelectedDay(d)
                  setAdding(false)
                }}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-[13px] font-bold tracking-[-0.2px] transition-colors',
                  on
                    ? 'bg-bg text-ink shadow-[0_-1px_0_0_var(--color-border),1px_0_0_0_var(--color-border),-1px_0_0_0_var(--color-border)]'
                    : 'text-ink-60 hover:text-ink'
                )}
              >
                {d}일차
                {isCurrent && (
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: FESTIV_TOKENS.pop }}
                  />
                )}
              </button>
            )
          })}
          {DAYS.length === 0 && (
            <div className="px-4 py-2.5 text-[13px] text-ink-40">
              일차 정보 없음
            </div>
          )}
        </div>

        {/* 슬롯 목록 */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-bg">
          {slots.map((slot) => {
            const slotStart = toMin(slot.startTime)
            const slotEnd = toMin(slot.endTime)
            const isNow =
              selectedDay === currentDay &&
              nowMin >= slotStart &&
              nowMin < slotEnd
            return (
              <SlotRow
                key={slot.id}
                slot={slot}
                festivalDayId={selectedDayData?.id ?? ''}
                isNow={isNow}
                onToast={showToast}
              />
            )
          })}

          {adding ? (
            <AddSlotForm
              festivalDayId={selectedDayData?.id ?? ''}
              onDone={() => setAdding(false)}
              onToast={showToast}
            />
          ) : (
            <div className="px-5 py-4">
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-[13px] font-bold text-ink-40 transition-colors hover:border-cta hover:text-cta"
              >
                <div className="size-4">{I.plus()}</div>
                공연 추가
              </button>
            </div>
          )}
        </div>
      </div>
      {toast && <AdminToast message={toast} />}
    </AdminShell>
  )
}
