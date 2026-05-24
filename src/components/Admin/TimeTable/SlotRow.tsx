import { useState } from 'react'
import { FESTIV_TOKENS, I } from '../../../tokens'
import { cn } from '../../../lib/cn'
import { useUpdateFestivalTimeline } from '../../../features/Festival/hooks/useUpdateFestivalTimeline'
import { useDeleteFestivalTimeline } from '../../../features/Festival/hooks/useDeleteFestivalTimeline'
import type { TimelineResponseDto } from '../../../features/Festival/types/TimelineResponseDto'

function toApiTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t
}

export function SlotRow({
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
