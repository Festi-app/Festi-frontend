import { FESTI_TOKENS, I } from '../../tokens'
import { cn } from '../../lib/cn'
import type { NoticeType } from '../../stores/useNoticeStore'

export interface NoticeDraft {
  type: NoticeType
  title: string
  content: string
  pinned: boolean
}

export const EMPTY_DRAFT: NoticeDraft = {
  type: '공지',
  title: '',
  content: '',
  pinned: false,
}

const TYPE_OPTIONS: NoticeType[] = ['공지', '이벤트']

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5.5 w-9 rounded-full transition-colors',
          checked ? 'bg-cta' : 'bg-ink-20'
        )}
      >
        <div
          className={cn(
            'absolute top-0.75 size-4 rounded-full bg-white shadow-sm transition-all',
            checked ? 'left-[18px]' : 'left-0.75'
          )}
        />
      </div>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
    </label>
  )
}

export function NoticeFormPanel({
  mode,
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  mode: 'create' | 'edit'
  draft: NoticeDraft
  onChange: (patch: Partial<NoticeDraft>) => void
  onSave: () => void
  onCancel: () => void
}) {
  const isValid = draft.title.trim().length > 0 && draft.content.trim().length > 0

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <div className="text-[18px] font-extrabold tracking-[-0.4px] text-ink">
          {mode === 'create' ? '새 공지 작성' : '공지 수정'}
        </div>
        <div className="mt-0.5 text-[12px] text-ink-60">
          {mode === 'create'
            ? '작성 후 저장하면 즉시 앱에 반영됩니다'
            : '수정 후 저장하면 즉시 반영됩니다'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Type selector */}
        <div className="mb-5">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            유형
          </div>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ type: t })}
                className={cn(
                  'rounded-xl px-4 py-2 text-[13px] font-bold transition-all',
                  draft.type === t
                    ? t === '공지'
                      ? 'bg-cta text-white'
                      : 'bg-sun text-[#141A1F]'
                    : 'bg-surface-alt text-ink-60'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-5">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            제목
          </div>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="공지 제목을 입력하세요"
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-[14px] font-semibold text-ink placeholder-ink-40 focus:border-cta focus:outline-none"
          />
        </div>

        {/* Content */}
        <div className="mb-5">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            내용
          </div>
          <textarea
            value={draft.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="공지 내용을 입력하세요"
            rows={6}
            className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-[14px] leading-relaxed text-ink placeholder-ink-40 focus:border-cta focus:outline-none"
          />
          <div className="mt-1 text-right text-[11px] text-ink-40">
            {draft.content.length}자
          </div>
        </div>

        {/* Options */}
        <div className="rounded-2xl border border-border bg-surface-alt p-4">
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            게시 옵션
          </div>
          <Toggle
            checked={draft.pinned}
            onChange={(v) => onChange({ pinned: v })}
            label="상단 고정"
          />
        </div>
      </div>

      <div className="flex gap-2 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border py-3 text-[14px] font-bold text-ink-60"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid}
          className="flex-[2] rounded-xl bg-cta py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
        >
          <div className="flex items-center justify-center gap-1.5">
            <div className="size-4">{I.check('#fff')}</div>
            {mode === 'create' ? '공지 등록' : '변경 저장'}
          </div>
        </button>
      </div>
    </div>
  )
}

export function NoticeEmptyPanel({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div
        className="flex size-14 items-center justify-center rounded-2xl"
        style={{ background: FESTI_TOKENS.coralSoft }}
      >
        <div className="size-7">{I.megaphone(FESTI_TOKENS.coral)}</div>
      </div>
      <div>
        <div className="text-[15px] font-extrabold text-ink">
          공지를 선택하거나 새로 등록하세요
        </div>
        <div className="mt-1 text-[12px] text-ink-60">
          왼쪽 목록에서 공지를 클릭하면 수정할 수 있어요
        </div>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="mt-1 rounded-xl bg-cta px-5 py-2.5 text-[13px] font-bold text-white"
      >
        + 새 공지 작성
      </button>
    </div>
  )
}
