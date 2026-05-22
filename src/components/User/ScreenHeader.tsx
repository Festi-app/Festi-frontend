import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { I } from '../../tokens'
import { FestivMark, FestivWordmark } from '../Logo'

// ── 메인 탭 공통 헤더 ─────────────────────────────────────────────────────────

export function AppHeader({
  dark = false,
  right,
  className,
}: {
  dark?: boolean
  right?: ReactNode
  className?: string
}) {
  const color = dark ? '#FFFFFF' : '#141A1F'
  return (
    <div className={`flex items-center justify-between ${className ?? ''}`}>
      <div className="flex items-center gap-1.5">
        <FestivMark size={25} color={color} />
        <FestivWordmark size={22} color={color} />
      </div>
      {right}
    </div>
  )
}

// ── 메인 탭 페이지 타이틀 ─────────────────────────────────────────────────────

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-[26px] font-extrabold tracking-[-0.7px] text-ink">
      {children}
    </div>
  )
}

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
    <div className="shrink-0 border-b border-border bg-surface px-5 pt-5 pb-4">
      <div className="flex items-center gap-2">
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
