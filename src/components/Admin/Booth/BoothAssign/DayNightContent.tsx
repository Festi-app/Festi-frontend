import { ZONES, NIGHT_ZONES } from '../../../../data/zones'
import {
  useBoothSectionStore,
  type PermDay,
  type PermTime,
  type BoothMapMode,
} from '../../../../stores/useBoothSectionStore'
import { FESTIV_TOKENS, I, Pill } from '../../../../tokens'
import { cn } from '../../../../lib/cn'
import { type OrgAccount } from '../boothShared'

const ALL_ZONES = [...ZONES, ...NIGHT_ZONES]

export function DayNightContent({
  orgs,
  selectedDay,
  onDayChange,
  activeMode,
}: {
  orgs: OrgAccount[]
  selectedDay: PermDay
  onDayChange: (d: PermDay) => void
  activeMode: BoothMapMode
}) {
  const { permissions, removePermission } = useBoothSectionStore()
  const time: PermTime = activeMode === '야간' ? '야간' : '주간'

  const slotOrgs = orgs.filter((o) =>
    o.applications.some((a) => a.day === selectedDay && a.time === time)
  )

  return (
    <>
      {/* Day selector */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          일자 선택
        </div>
        <div className="flex gap-1">
          {([1, 2, 3] as PermDay[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDayChange(d)}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                selectedDay === d
                  ? 'bg-cta text-white'
                  : 'bg-surface-alt text-ink-60'
              )}
            >
              {d}일차
            </button>
          ))}
        </div>
      </div>

      {/* Slot orgs */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          {selectedDay}일차 {time} 신청 ({slotOrgs.length}개)
        </div>
        {slotOrgs.length === 0 ? (
          <div className="py-2 text-center text-[11px] text-ink-40">
            신청 부스 없음
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {slotOrgs.map((org) => {
              const assigned = permissions
                .filter(
                  (p) =>
                    p.orgId === org.id &&
                    p.day === selectedDay &&
                    p.time === time
                )
                .reduce((sum, p) => sum + p.sections.length, 0)
              return (
                <div
                  key={org.id}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={{
                    background: assigned > 0 ? `${org.color}15` : undefined,
                  }}
                >
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: org.color }}
                  />
                  <span className="flex-1 truncate text-[12px] font-bold text-ink">
                    {org.name}
                  </span>
                  {assigned > 0 ? (
                    <Pill color={`${org.color}22`} ink={org.color}>
                      {assigned}칸
                    </Pill>
                  ) : (
                    <span className="text-[10px] text-ink-40">미배정</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Permission list */}
      <div className="flex-1 overflow-y-auto p-4">
        {permissions.length === 0 ? (
          <div className="py-8 text-center text-[12px] text-ink-40">
            아직 권한이 부여된 부스가 없어요
            <br />
            구역을 드래그해보세요
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              배정 목록 ({permissions.length}건)
            </div>
            {permissions.map((p) => {
              const zone = ALL_ZONES.find((z) => z.id === p.zoneId)!
              const showCategory = p.time === '주간'
              return (
                <div key={p.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-0.5 size-2.5 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-bold text-ink">
                          {p.orgName}
                        </span>
                        {showCategory && (
                          <span className="shrink-0 rounded-md bg-surface-alt px-1.5 py-0.5 text-[10px] font-bold text-ink-60">
                            {p.category}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-60">
                        {zone?.id ?? p.zoneId} · {p.day}일차 {p.time} ·{' '}
                        {p.sections.length}개 섹션
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePermission(p.id)}
                      className="ml-1 mt-0.5 shrink-0"
                    >
                      <div className="size-4">
                        {I.trash(FESTIV_TOKENS.ink40)}
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
