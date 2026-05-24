import { useState } from 'react'
import { I } from '../../../tokens'
import { AdminModal } from '../AdminModal'
import { useCreateFestivalTimeline } from '../../../features/Festival/hooks/useCreateFestivalTimeline'

const EMPTY_FORM = { time: '', end: '', name: '', artist: '' }

function toApiTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t
}

export function AddSlotForm({
  festivalDayId,
  onDone,
  onToast,
}: {
  festivalDayId: string
  onDone: () => void
  onToast?: (msg: string) => void
}) {
  const createTimeline = useCreateFestivalTimeline()
  const [form, setForm] = useState(EMPTY_FORM)
  const [timeError, setTimeError] = useState(false)

  const isValid =
    form.time && form.end && form.name && form.artist && festivalDayId

  function submit() {
    if (!isValid || !festivalDayId) return
    if (form.time >= form.end) {
      setTimeError(true)
      return
    }
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
          onToast?.('공연이 추가되었습니다')
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
      {!festivalDayId && (
        <div className="mb-3 rounded-lg bg-alert/10 px-3 py-2 text-[12px] font-semibold text-alert">
          축제 설정에서 일자 정보를 먼저 저장해주세요
        </div>
      )}
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
      <AdminModal
        open={timeError}
        variant="warning"
        title="시간을 확인해주세요"
        body="종료 시간이 시작 시간보다 같거나 빨라요"
        confirmLabel="확인"
        onClose={() => setTimeError(false)}
      />
    </div>
  )
}
