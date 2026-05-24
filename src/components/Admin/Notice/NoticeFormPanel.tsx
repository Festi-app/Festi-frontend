import { I } from '../../../tokens'
import type { NoticeDraft } from './noticeShared'
import { Toggle } from './Toogle'

export type { NoticeDraft }

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
  const TITLE_MAX = 50
  const CONTENT_MAX = 200
  const isValid =
    draft.title.trim().length > 0 &&
    draft.title.length <= TITLE_MAX &&
    draft.content.trim().length > 0 &&
    draft.content.length <= CONTENT_MAX

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
            maxLength={TITLE_MAX}
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-[14px] font-semibold text-ink placeholder-ink-40 focus:border-cta focus:outline-none"
          />
          <div className={`mt-1 text-right text-[11px] ${draft.title.length >= TITLE_MAX ? 'text-alert' : 'text-ink-40'}`}>
            {draft.title.length}/{TITLE_MAX}자
          </div>
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
            maxLength={CONTENT_MAX}
            className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-[14px] leading-relaxed text-ink placeholder-ink-40 focus:border-cta focus:outline-none"
          />
          <div className={`mt-1 text-right text-[11px] ${draft.content.length >= CONTENT_MAX ? 'text-alert' : 'text-ink-40'}`}>
            {draft.content.length}/{CONTENT_MAX}자
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
          className="flex-2 rounded-xl bg-cta py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
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
