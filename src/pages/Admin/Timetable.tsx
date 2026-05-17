import { useState } from 'react'
import { FESTI_TOKENS, I } from '../../tokens'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import {
  useTimetableStore,
  type TimetableSlot,
} from '../../stores/useTimetableStore'
import { cn } from '../../lib/cn'
import { toMin } from '../../lib/time'

const DAYS = [1, 2, 3] as const

const EMPTY_FORM = { time: '', end: '', name: '', artist: '' }

// ── Slot row ──────────────────────────────────────────────────────────────────

function SlotRow({
  slot,
  isFirst,
  isLast,
  isNow,
  day,
}: {
  slot: TimetableSlot
  isFirst: boolean
  isLast: boolean
  isNow: boolean
  day: number
}) {
  const { updateSlot, deleteSlot, moveSlot } = useTimetableStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...slot })

  function save() {
    if (!draft.time || !draft.end || !draft.name || !draft.artist) return
    updateSlot(day, slot.id, {
      time: draft.time,
      end: draft.end,
      name: draft.name,
      artist: draft.artist,
    })
    setEditing(false)
  }

  function cancel() {
    setDraft({ ...slot })
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
      {/* 시간 */}
      <div
        className={cn(
          'w-12 shrink-0 font-mono text-[13px] font-extrabold tabular-nums',
          isNow ? 'text-pop' : 'text-ink-60'
        )}
      >
        {slot.time}
      </div>

      {/* 공연 정보 — 클릭하면 편집 모드 */}
      <button
        type="button"
        onClick={() => {
          setDraft({ ...slot })
          setEditing(true)
        }}
        className="min-w-0 flex-1 cursor-pointer text-left"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-bold tracking-[-0.3px] text-ink group-hover:text-cta">
            {slot.name}
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
          {slot.artist}
          <span className="ml-1.5 text-ink-40">
            {slot.time} — {slot.end}
          </span>
        </div>
      </button>

      {/* 순서 이동 */}
      <div className="flex shrink-0 flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => moveSlot(day, slot.id, 'up')}
          disabled={isFirst}
          className="flex size-5 items-center justify-center rounded text-ink-40 hover:bg-border disabled:opacity-20"
        >
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
            <path
              d="M2 8l4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => moveSlot(day, slot.id, 'down')}
          disabled={isLast}
          className="flex size-5 items-center justify-center rounded text-ink-40 hover:bg-border disabled:opacity-20"
        >
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 편집 / 삭제 */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setDraft({ ...slot })
            setEditing(true)
          }}
          className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-ink-40 transition-colors hover:border-cta hover:text-cta"
        >
          <div className="size-3.5">{I.edit()}</div>
        </button>
        <button
          type="button"
          onClick={() => deleteSlot(day, slot.id)}
          className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-ink-40 transition-colors hover:border-alert hover:text-alert"
        >
          <div className="size-3.5">{I.trash()}</div>
        </button>
      </div>
    </div>
  )
}

// ── Add slot form ─────────────────────────────────────────────────────────────

function AddSlotForm({ day, onDone }: { day: number; onDone: () => void }) {
  const { addSlot } = useTimetableStore()
  const [form, setForm] = useState(EMPTY_FORM)

  const isValid = form.time && form.end && form.name && form.artist

  function submit() {
    if (!isValid) return
    addSlot(day, form)
    setForm(EMPTY_FORM)
    onDone()
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
  const { venue, currentDay, nowMin, days, setVenue, setCurrentDay } =
    useTimetableStore()
  const [selectedDay, setSelectedDay] = useState<number>(currentDay)
  const [adding, setAdding] = useState(false)
  const [venueDraft, setVenueDraft] = useState(venue)
  const [venueEditing, setVenueEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const slots = days[selectedDay] ?? []

  function handleSave() {
    if (venueEditing) {
      setVenue(venueDraft)
      setVenueEditing(false)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminShell active="timetable">
      <AdminTopBar
        title="공연 타임테이블"
        sub={
          saved
            ? '저장 완료 · 사용자 화면에 반영됐어요'
            : '공연 일정을 관리해요'
        }
        right={
          <AdminBtn primary icon={I.check('#fff')} onClick={handleSave}>
            저장
          </AdminBtn>
        }
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ── 왼쪽: 슬롯 편집 ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* 공연장명 */}
          <div className="flex items-center gap-3 border-b border-border bg-surface px-6 py-3.5">
            <div className="size-4 shrink-0 text-ink-40">{I.map()}</div>
            {venueEditing ? (
              <>
                <input
                  autoFocus
                  value={venueDraft}
                  onChange={(e) => setVenueDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setVenue(venueDraft)
                      setVenueEditing(false)
                    }
                    if (e.key === 'Escape') {
                      setVenueDraft(venue)
                      setVenueEditing(false)
                    }
                  }}
                  className="flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVenue(venueDraft)
                    setVenueEditing(false)
                  }}
                  className="text-[12px] font-bold text-cta"
                >
                  완료
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  {venue}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVenueDraft(venue)
                    setVenueEditing(true)
                  }}
                  className="text-[12px] font-bold text-ink-40 hover:text-ink"
                >
                  수정
                </button>
              </>
            )}
          </div>

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
                      style={{ background: FESTI_TOKENS.pop }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* 슬롯 목록 */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-bg">
            {slots.length === 0 ? (
              <div className="py-16 text-center text-sm text-ink-40">
                공연 일정이 없어요
              </div>
            ) : (
              slots.map((slot, i) => {
                const slotStart = toMin(slot.time)
                const slotEnd = toMin(slot.end)
                const isNow =
                  selectedDay === currentDay &&
                  nowMin >= slotStart &&
                  nowMin < slotEnd
                return (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    isFirst={i === 0}
                    isLast={i === slots.length - 1}
                    isNow={isNow}
                    day={selectedDay}
                  />
                )
              })
            )}

            {adding ? (
              <AddSlotForm day={selectedDay} onDone={() => setAdding(false)} />
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

        {/* ── 오른쪽: 미리보기 ── */}
        <div className="flex w-72 shrink-0 flex-col border-l border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <div className="text-[13px] font-extrabold text-ink">미리보기</div>
            <div className="mt-0.5 text-[11px] text-ink-60">
              사용자 화면에서 보이는 모습
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {/* 현재 일차 선택 미리보기 */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-extrabold tracking-[-0.4px] text-ink">
                  공연 타임테이블
                </div>
                <div className="mt-0.5 text-[11px] text-ink-60">{venue}</div>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-white/80 px-2.5 py-1.5 text-[12px] font-bold text-ink shadow-sm">
                {selectedDay}일차
                {selectedDay === currentDay && (
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: FESTI_TOKENS.pop }}
                  />
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-border bg-surface">
              {slots.length === 0 ? (
                <div className="py-8 text-center text-[12px] text-ink-40">
                  공연 없음
                </div>
              ) : (
                slots.map((slot, i) => {
                  const slotStart = toMin(slot.time)
                  const slotEnd = toMin(slot.end)
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
                        {slot.time}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="truncate text-[12px] font-bold text-ink">
                            {slot.name}
                          </span>
                          {isNow && (
                            <span
                              className="shrink-0 rounded-full px-1 py-0.25 text-[9px] font-extrabold"
                              style={{
                                background: FESTI_TOKENS.pop + '22',
                                color: FESTI_TOKENS.pop,
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
              <div className="flex gap-1.5">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setCurrentDay(d)}
                    className={cn(
                      'flex-1 rounded-lg py-2 text-[12px] font-bold transition-colors',
                      d === currentDay
                        ? 'bg-cta text-cta-ink'
                        : 'border border-border bg-surface text-ink-60'
                    )}
                  >
                    {d}일차
                  </button>
                ))}
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
