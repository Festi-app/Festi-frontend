import { useState, useMemo, useEffect } from 'react'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { FESTIV_TOKENS, I } from '../../tokens'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { cn } from '../../lib/cn'
import { toMin } from '../../lib/time'
import { useFestival } from '../../features/Festival/hooks/useFestival'
import { useFestivalTimelines } from '../../features/Festival/hooks/useFestivalTimelines'
import { useCreateFestivalTimeline } from '../../features/Festival/hooks/useCreateFestivalTimeline'
import { useUpdateFestivalTimeline } from '../../features/Festival/hooks/useUpdateFestivalTimeline'
import { useDeleteFestivalTimeline } from '../../features/Festival/hooks/useDeleteFestivalTimeline'
import type { TimelineResponseDto } from '../../features/Festival/types/TimelineResponseDto'

const EMPTY_FORM = { time: '', end: '', name: '', artist: '' }

function toApiTime(t: string): string {
  // input type="time" returns "HH:MM", API expects "HH:MM:SS"
  return t.length === 5 ? `${t}:00` : t
}

// ── Slot row ──────────────────────────────────────────────────────────────────

function SlotRow({
  slot,
  festivalDayId,
  isNow,
}: {
  slot: TimelineResponseDto
  festivalDayId: string
  isNow: boolean
}) {
  const updateTimeline = useUpdateFestivalTimeline()
  const deleteTimeline = useDeleteFestivalTimeline()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    time: slot.startTime,
    end: slot.endTime,
    name: slot.title,
    artist: slot.artist,
  })

  function save() {
    if (!draft.time || !draft.end || !draft.name || !draft.artist) return
    updateTimeline.mutate(
      {
        timelineId: slot.id,
        body: {
          festivalDayId,
          title: draft.name,
          artist: draft.artist,
          startTime: toApiTime(draft.time),
          endTime: toApiTime(draft.end),
        },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function cancel() {
    setDraft({
      time: slot.startTime,
      end: slot.endTime,
      name: slot.title,
      artist: slot.artist,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="border-b border-border bg-surface-alt px-5 py-3.5">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <div className="mb-1 text-[11px] font-bold text-ink-60">시작</div>
            <input
              type="time"
              value={draft.time}
              onChange={(e) =>
                setDraft((d) => ({ ...d, time: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[13px] font-bold text-ink focus:border-cta focus:outline-none"
            />
          </div>
          <div>
            <div className="mb-1 text-[11px] font-bold text-ink-60">종료</div>
            <input
              type="time"
              value={draft.end}
              onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[13px] font-bold text-ink focus:border-cta focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="mb-1 text-[11px] font-bold text-ink-60">공연명</div>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="공연명을 입력하세요"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
        </div>
        <div className="mb-3">
          <div className="mb-1 text-[11px] font-bold text-ink-60">
            아티스트 / 팀명
          </div>
          <input
            type="text"
            value={draft.artist}
            onChange={(e) =>
              setDraft((d) => ({ ...d, artist: e.target.value }))
            }
            placeholder="아티스트 또는 팀명"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancel}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-ink-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!draft.time || !draft.end || !draft.name || !draft.artist}
            className="rounded-lg bg-cta px-3 py-1.5 text-[12px] font-bold text-cta-ink disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-4 border-b border-border px-5 py-4 transition-colors',
        isNow ? 'bg-pop/4 hover:bg-pop/6' : 'hover:bg-surface-alt/60'
      )}
    >
      <div
        className={cn(
          'w-12 shrink-0 font-mono text-[13px] font-extrabold tabular-nums',
          isNow ? 'text-pop' : 'text-ink-60'
        )}
      >
        {slot.startTime.slice(0, 5)}
      </div>

      <button
        type="button"
        onClick={() => {
          setDraft({
            time: slot.startTime,
            end: slot.endTime,
            name: slot.title,
            artist: slot.artist,
          })
          setEditing(true)
        }}
        className="min-w-0 flex-1 cursor-pointer text-left"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-bold tracking-[-0.3px] text-ink group-hover:text-cta">
            {slot.title}
          </span>
          {isNow && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold"
              style={{
                background: FESTIV_TOKENS.pop + '22',
                color: FESTIV_TOKENS.pop,
              }}
            >
              진행중
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          {slot.artist}
          <span className="ml-1.5 text-ink-40">
            {slot.startTime.slice(0, 5)} — {slot.endTime.slice(0, 5)}
          </span>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setDraft({
              time: slot.startTime,
              end: slot.endTime,
              name: slot.title,
              artist: slot.artist,
            })
            setEditing(true)
          }}
          className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-ink-40 transition-colors hover:border-cta hover:text-cta"
        >
          <div className="size-3.5">{I.edit()}</div>
        </button>
        <button
          type="button"
          onClick={() => deleteTimeline.mutate(slot.id)}
          className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-ink-40 transition-colors hover:border-alert hover:text-alert"
        >
          <div className="size-3.5">{I.trash()}</div>
        </button>
      </div>
    </div>
  )
}

// ── Add slot form ─────────────────────────────────────────────────────────────

function AddSlotForm({
  festivalDayId,
  onDone,
}: {
  festivalDayId: string
  onDone: () => void
}) {
  const createTimeline = useCreateFestivalTimeline()
  const [form, setForm] = useState(EMPTY_FORM)

  const isValid = form.time && form.end && form.name && form.artist

  function submit() {
    if (!isValid || !festivalDayId) return
    createTimeline.mutate(
      {
        festivalDayId,
        title: form.name,
        artist: form.artist,
        startTime: toApiTime(form.time),
        endTime: toApiTime(form.end),
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM)
          onDone()
        },
      }
    )
  }

  return (
    <div className="border-t-2 border-cta/30 bg-surface px-5 py-4">
      <div className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-cta">
        새 공연 추가
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-[11px] font-bold text-ink-60">시작</div>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-[13px] font-bold text-ink focus:border-cta focus:outline-none"
          />
        </div>
        <div>
          <div className="mb-1 text-[11px] font-bold text-ink-60">종료</div>
          <input
            type="time"
            value={form.end}
            onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-[13px] font-bold text-ink focus:border-cta focus:outline-none"
          />
        </div>
      </div>
      <div className="mb-2">
        <div className="mb-1 text-[11px] font-bold text-ink-60">공연명</div>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="예: 오프닝 퍼포먼스"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <div className="mb-1 text-[11px] font-bold text-ink-60">
          아티스트 / 팀명
        </div>
        <input
          type="text"
          value={form.artist}
          onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
          placeholder="예: 총학생회"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-ink-60"
        >
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!isValid}
          className="flex items-center gap-1 rounded-lg bg-cta px-3 py-1.5 text-[12px] font-bold text-cta-ink disabled:opacity-40"
        >
          <div className="size-3">{I.plus('#fff')}</div>
          추가
        </button>
      </div>
    </div>
  )
}

// ── Screen: Admin Timetable ───────────────────────────────────────────────────

export function AdminTimetable() {
  const { data: festival } = useFestival()
  const { data: timelines = [] } = useFestivalTimelines()
  const { data: festivalDays = [] } = useFestivalDays()

  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [activeCurrentDay, setActiveCurrentDay] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
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

  // festival 데이터 로딩 후 오늘 날짜 기준 일차로 동기화
  useEffect(() => {
    if (!festival?.startDate) return
    const t = setTimeout(() => setSelectedDay(currentDay), 0)
    return () => clearTimeout(t)
  }, [festival?.startDate, currentDay])

  const totalDays = useMemo(() => {
    if (festivalDays.length > 0) return festivalDays.length
    if (startDate && endDate) {
      const s = new Date(startDate + 'T00:00:00')
      const e = new Date(endDate + 'T00:00:00')
      return Math.round((e.getTime() - s.getTime()) / 86400000) + 1
    }
    return 1
  }, [festivalDays.length, startDate, endDate])

  const DAYS = Array.from({ length: totalDays }, (_, i) => i + 1)

  // 선택된 일차에 해당하는 날짜 문자열로 festivalDay 매핑
  const selectedDayDate = useMemo(() => {
    if (!startDate) return null
    const d = new Date(startDate + 'T00:00:00')
    d.setDate(d.getDate() + selectedDay - 1)
    return d.toISOString().slice(0, 10)
  }, [startDate, selectedDay])

  const selectedDayData = festivalDays.find((fd) => fd.day === selectedDayDate)
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

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ── 왼쪽: 슬롯 편집 ── */}
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
            {slots.length === 0 ? (
              <div className="py-16 text-center text-sm text-ink-40">
                공연 일정이 없어요
              </div>
            ) : (
              slots.map((slot) => {
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
                  />
                )
              })
            )}

            {adding && selectedDayData ? (
              <AddSlotForm
                festivalDayId={selectedDayData.id}
                onDone={() => setAdding(false)}
              />
            ) : (
              <div className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  disabled={!selectedDayData}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-[13px] font-bold text-ink-40 transition-colors hover:border-cta hover:text-cta disabled:opacity-40"
                >
                  <div className="size-4">{I.plus()}</div>
                  공연 추가
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── 오른쪽: 미리보기 ── */}
        <div className="flex w-72 shrink-0 flex-col border-l border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <div className="text-[13px] font-extrabold text-ink">미리보기</div>
            <div className="mt-0.5 text-[11px] text-ink-60">
              사용자 화면에서 보이는 모습
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-extrabold tracking-[-0.4px] text-ink">
                  공연 타임테이블
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-white/80 px-2.5 py-1.5 text-[12px] font-bold text-ink shadow-sm">
                {selectedDay}일차
                {selectedDay === currentDay && (
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: FESTIV_TOKENS.pop }}
                  />
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-border bg-surface">
              {slots.length === 0 ? (
                <div className="py-8 text-center text-[12px] text-ink-40">
                  공연 일정이 없어요
                </div>
              ) : (
                slots.map((slot, i) => {
                  const slotStart = toMin(slot.startTime)
                  const slotEnd = toMin(slot.endTime)
                  const isNow =
                    selectedDay === currentDay &&
                    nowMin >= slotStart &&
                    nowMin < slotEnd
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        'flex items-center gap-3 px-3.5',
                        i < slots.length - 1 ? 'border-b border-border' : '',
                        isNow ? 'bg-pop/4' : ''
                      )}
                      style={{ height: 56 }}
                    >
                      <div
                        className={cn(
                          'w-10 shrink-0 font-mono text-[12px] font-extrabold tabular-nums',
                          isNow ? 'text-pop' : 'text-ink-60'
                        )}
                      >
                        {slot.startTime.slice(0, 5)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="truncate text-[12px] font-bold text-ink">
                            {slot.title}
                          </span>
                          {isNow && (
                            <span
                              className="shrink-0 rounded-full px-1 py-0.25 text-[9px] font-extrabold"
                              style={{
                                background: FESTIV_TOKENS.pop + '22',
                                color: FESTIV_TOKENS.pop,
                              }}
                            >
                              진행중
                            </span>
                          )}
                        </div>
                        <div className="mt-0.25 truncate text-[10px] text-ink-60">
                          {slot.artist}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* 현재 일차 설정 */}
            <div className="mt-4 rounded-[14px] border border-border bg-bg p-3.5">
              <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
                현재 진행 일차
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {DAYS.map((d) => {
                  const active = d === (activeCurrentDay ?? currentDay)
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setActiveCurrentDay(d)
                        setSelectedDay(d)
                      }}
                      className={cn(
                        'rounded-lg py-2 text-[12px] font-bold transition-colors',
                        active
                          ? 'bg-cta text-cta-ink'
                          : 'border border-border bg-surface text-ink-60'
                      )}
                    >
                      {d}일차
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 text-[10px] text-ink-40">
                홈 화면에서 기본으로 보여줄 일차를 선택하세요
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
