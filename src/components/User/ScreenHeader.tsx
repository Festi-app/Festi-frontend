import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { I } from '../../tokens'

// ── 서브화면 공통 헤더 ────────────────────────────────────────────────────────

export function ScreenHeader({
  title,
  right,
}: {
  title: string
  right?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className="shrink-0 border-b border-border bg-surface px-5 pt-13.5 pb-4">
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="size-6 text-ink"
        >
          {I.chev(undefined, 'l')}
        </button>
        <div className="flex-1 text-[17px] font-extrabold tracking-[-0.4px] text-ink">
          {title}
        </div>
        {right}
      </div>
    </div>
  )
}

// ── 섹션 서브헤더 ─────────────────────────────────────────────────────────────

export function SubHeader({ title, right }: { title: string; right?: string }) {
  return (
    <div className="mt-5.5 mb-3 flex items-end justify-between">
      <div className="text-[17px] leading-none font-extrabold tracking-[-0.4px] text-ink">
        {title}
      </div>
      {right && (
        <div className="text-xs font-semibold text-ink-60">{right}</div>
      )}
    </div>
  )
}
