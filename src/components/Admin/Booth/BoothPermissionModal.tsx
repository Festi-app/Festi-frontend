import { useState } from 'react'
import {
  type OrgAccount,
  type BoothCategory,
  type PermDay,
  type PermTime,
} from './boothShared'
import type { BoothPermission } from '../../../stores/useBoothSectionStore'
import { cn } from '../../../lib/cn'
import { Pill } from '../../../tokens'
import { NIGHT_ZONES, ZONES } from '../../../data/zones'

export function BoothPermissionModal({
  zoneId,
  sections,
  day,
  time,
  orgs,
  permissions,
  onClose,
  onAssign,
}: {
  zoneId: string
  sections: number[]
  day: PermDay
  time: PermTime
  orgs: OrgAccount[]
  permissions: BoothPermission[]
  onClose: () => void
  onAssign: (orgId: string, category: BoothCategory) => void
}) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] =
    useState<BoothCategory | null>(time === '야간' ? '활동' : null)
  const zone = [...ZONES, ...NIGHT_ZONES].find((z) => z.id === zoneId)!
  const sectionNums = sections.map((s) => s + 1)
  const filteredOrgs = orgs.filter((o) =>
    o.applications.some((a) => a.day === day && a.time === time)
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(20,26,31,0.55)' }}
      onMouseDown={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col rounded-t-3xl bg-surface sm:rounded-2xl"
        style={{
          maxHeight: '80vh',
          boxShadow: '0 24px 64px rgba(20,26,31,0.3)',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="flex-1">
            <div className="text-[17px] font-extrabold tracking-[-0.3px] text-ink">
              권한 부여
            </div>
            <div className="mt-0.5 text-xs text-ink-60">
              {zone.id} · {day}일차 {time} · {sectionNums.length}개 섹션
              {sectionNums.length <= 6 && ` (${sectionNums.join(', ')}번)`}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-surface-alt text-base text-ink-60"
          >
            ✕
          </button>
        </div>

        {time !== '야간' && (
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 유형
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['정보', '체험', '마켓', '활동'] as BoothCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'rounded-xl py-2 text-[12px] font-bold transition-all',
                      selectedCategory === cat
                        ? 'bg-cta text-cta-ink'
                        : 'bg-surface-alt text-ink-60 hover:bg-surface-alt/80'
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            {day}일차 {time} 신청 부스 관리자
          </div>
          {filteredOrgs.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-ink-40">
              해당 일자·시간으로 신청한 부스가 없어요
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filteredOrgs.map((org) => {
                const alreadyHas = permissions.some(
                  (p) => p.orgId === org.id && p.zoneId === zoneId
                )
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      setSelectedOrgId(org.id)
                      if (org.dayCategory) setSelectedCategory(org.dayCategory)
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                      selectedOrgId === org.id
                        ? 'border-transparent'
                        : 'border-border'
                    )}
                    style={
                      selectedOrgId === org.id
                        ? {
                            background: `${org.color}22`,
                            borderColor: org.color,
                          }
                        : {}
                    }
                  >
                    <div
                      className="size-3 shrink-0 rounded-full"
                      style={{ background: org.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-ink">
                        {org.name}
                      </div>
                      {alreadyHas && (
                        <div className="text-[10px] text-ink-60">
                          이미 이 구역에 섹션 보유
                        </div>
                      )}
                    </div>
                    <Pill color={`${org.color}22`} ink={org.color}>
                      {org.type}
                    </Pill>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-ink-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() =>
              selectedOrgId &&
              selectedCategory &&
              onAssign(selectedOrgId, selectedCategory)
            }
            disabled={!selectedOrgId || (time !== '야간' && !selectedCategory)}
            className="flex-1 rounded-xl bg-coral py-3 text-sm font-extrabold text-white disabled:opacity-40"
          >
            권한 부여
          </button>
        </div>
      </div>
    </div>
  )
}
