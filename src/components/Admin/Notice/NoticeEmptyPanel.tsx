import { FESTIV_TOKENS, I } from '../../../tokens'

export function NoticeEmptyPanel({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div
        className="flex size-14 items-center justify-center rounded-2xl"
        style={{ background: FESTIV_TOKENS.coralSoft }}
      >
        <div className="size-7">{I.megaphone(FESTIV_TOKENS.coral)}</div>
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
