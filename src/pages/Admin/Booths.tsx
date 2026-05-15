import { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import { FESTI_TOKENS, I, Pill } from '../../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'
import soongsilMap from '../../assets/soongsil-map.png'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ZoneDef {
  id: string
  name: string
  start: number
  end: number
  dir: 'row' | 'column'
  color: string
  left: string
  top: string
  width: string
  height: string
}

interface PermissionEntry {
  id: string
  zoneId: string
  sections: number[]
  orgId: string
  orgName: string
  color: string
}

interface OrgAccount {
  id: string
  name: string
  type: '동아리' | '학생회' | '부서'
  color: string
}

// ── Zone & Org constants ──────────────────────────────────────────────────────

const ZONES: ZoneDef[] = [
  {
    id: 'A',
    name: '진리관 앞',
    start: 1,
    end: 14,
    dir: 'row',
    color: FESTI_TOKENS.mint,
    left: '24%',
    top: '31%',
    width: '62%',
    height: '4.5%',
  },
  {
    id: 'B',
    name: '중앙 가로줄',
    start: 15,
    end: 26,
    dir: 'row',
    color: FESTI_TOKENS.coral,
    left: '28%',
    top: '38.5%',
    width: '48%',
    height: '4.5%',
  },
  {
    id: 'C',
    name: '동측 세로줄',
    start: 27,
    end: 42,
    dir: 'column',
    color: FESTI_TOKENS.mint,
    left: '76%',
    top: '40%',
    width: '7%',
    height: '39%',
  },
  {
    id: 'D',
    name: '외측 세로줄',
    start: 43,
    end: 58,
    dir: 'column',
    color: FESTI_TOKENS.sun,
    left: '83.5%',
    top: '40%',
    width: '7%',
    height: '39%',
  },
  {
    id: 'E',
    name: '하단 가로줄',
    start: 59,
    end: 70,
    dir: 'row',
    color: FESTI_TOKENS.coral,
    left: '28%',
    top: '81%',
    width: '48.5%',
    height: '4.5%',
  },
  {
    id: 'F',
    name: '서측 세로줄',
    start: 71,
    end: 76,
    dir: 'column',
    color: FESTI_TOKENS.mint,
    left: '23%',
    top: '48%',
    width: '5%',
    height: '30%',
  },
  {
    id: 'G',
    name: '시계탑',
    start: 77,
    end: 77,
    dir: 'row',
    color: FESTI_TOKENS.grape,
    left: '22%',
    top: '38%',
    width: '4%',
    height: '4.5%',
  },
]

const ORG_LIST: OrgAccount[] = [
  { id: 'org1', name: '컴퓨터학부', type: '동아리', color: FESTI_TOKENS.coral },
  {
    id: 'org2',
    name: '경영대학생회',
    type: '학생회',
    color: FESTI_TOKENS.mint,
  },
  { id: 'org3', name: '사범대학생회', type: '학생회', color: FESTI_TOKENS.sun },
  { id: 'org4', name: '의약학부', type: '동아리', color: FESTI_TOKENS.grape },
  {
    id: 'org5',
    name: '법과대학생회',
    type: '학생회',
    color: FESTI_TOKENS.rose,
  },
  {
    id: 'org6',
    name: '글로벌통상학과',
    type: '동아리',
    color: FESTI_TOKENS.leaf,
  },
  { id: 'org7', name: '미디어학부', type: '동아리', color: FESTI_TOKENS.pop },
]

function selectionShadow(
  idx: number,
  lo: number,
  hi: number,
  dir: 'row' | 'column'
) {
  const w = '3px'
  const c = 'rgba(255,255,255,0.95)'
  const parts: string[] = []
  if (dir === 'row') {
    parts.push(`inset 0 ${w} 0 0 ${c}`, `inset 0 -${w} 0 0 ${c}`)
    if (idx === lo) parts.push(`inset ${w} 0 0 0 ${c}`)
    if (idx === hi) parts.push(`inset -${w} 0 0 0 ${c}`)
  } else {
    parts.push(`inset ${w} 0 0 0 ${c}`, `inset -${w} 0 0 0 ${c}`)
    if (idx === lo) parts.push(`inset 0 ${w} 0 0 ${c}`)
    if (idx === hi) parts.push(`inset 0 -${w} 0 0 ${c}`)
  }
  return parts.join(', ')
}

// ── Segmented ─────────────────────────────────────────────────────────────────

export function Segmented({
  value,
  options,
  icons,
  onChange,
}: {
  value: string
  options: string[]
  icons?: Array<(c?: string) => ReactElement>
  dark?: boolean
  onChange?: (value: string) => void
}) {
  return (
    <div className="inline-flex rounded-[10px] border border-border bg-surface-alt p-0.75">
      {options.map((option, index) => {
        const selected = option === value
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange?.(option)}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold tracking-[-0.2px]',
              selected
                ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(15,42,51,0.06)]'
                : 'text-ink-60'
            )}
          >
            {icons?.[index] && (
              <div className="size-3.25">{icons[index]()}</div>
            )}
            {option}
          </button>
        )
      })}
    </div>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────

export function Chip({
  label,
  badge,
  active,
  onClick,
}: {
  label: string
  badge?: string
  active?: boolean
  dark?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.25 rounded-full border px-2.75 py-1.75 text-xs font-bold tracking-[-0.2px]',
        active
          ? 'border-cta bg-cta text-cta-ink'
          : 'border-border bg-surface text-ink-80'
      )}
    >
      {label}
      {badge && (
        <span
          className={cn(
            'rounded-full p-1.5  text-[10px]',
            active ? 'bg-pop text-white' : 'bg-surface-alt text-ink-60'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

// ── Permission Modal ──────────────────────────────────────────────────────────

function PermissionModal({
  zoneId,
  sections,
  orgs,
  permissions,
  onClose,
  onAssign,
}: {
  zoneId: string
  sections: number[]
  orgs: OrgAccount[]
  permissions: PermissionEntry[]
  onClose: () => void
  onAssign: (orgId: string) => void
}) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const zone = ZONES.find((z) => z.id === zoneId)!
  const sectionNums = sections.map((s) => zone.start + s)

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
        {/* header */}
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="flex-1">
            <div className="text-[17px] font-extrabold tracking-[-0.3px] text-ink">
              권한 부여
            </div>
            <div className="mt-0.5 text-xs text-ink-60">
              {zone.name} · {sectionNums.length}개 섹션 선택됨
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

        {/* org list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
            부스 관리자 선택
          </div>
          <div className="flex flex-col gap-1.5">
            {orgs.map((org) => {
              const alreadyHas = permissions.some(
                (p) => p.orgId === org.id && p.zoneId === zoneId
              )
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setSelectedOrgId(org.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                    selectedOrgId === org.id
                      ? 'border-transparent'
                      : 'border-border'
                  )}
                  style={
                    selectedOrgId === org.id
                      ? { background: `${org.color}22`, borderColor: org.color }
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
        </div>

        {/* footer */}
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
            onClick={() => selectedOrgId && onAssign(selectedOrgId)}
            disabled={!selectedOrgId}
            className="flex-1 rounded-xl bg-coral py-3 text-sm font-extrabold text-white disabled:opacity-40"
          >
            권한 부여
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Configure Sidebar ─────────────────────────────────────────────────────────

function ConfigureSidebar({
  zoneDivisions,
  setZoneDivisions,
  onSave,
}: {
  zoneDivisions: Record<string, number>
  setZoneDivisions: (
    fn: (prev: Record<string, number>) => Record<string, number>
  ) => void
  onSave: () => void
}) {
  const total = Object.values(zoneDivisions).reduce((a, b) => a + b, 0)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="text-[15px] font-extrabold text-ink">구역 설정</div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          구역별 세부 섹션 개수를 설정하세요
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {ZONES.map((zone) => {
          const max = zone.end - zone.start + 1
          const val = zoneDivisions[zone.id]
          return (
            <div key={zone.id} className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: zone.color }}
                />
                <span className="flex-1 text-[13px] font-extrabold text-ink">
                  {zone.name}
                </span>
                <span className="text-[11px] text-ink-40">
                  {zone.start}–{zone.end}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-ink-60">섹션 수</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setZoneDivisions((prev) => ({
                        ...prev,
                        [zone.id]: Math.max(1, prev[zone.id] - 1),
                      }))
                    }
                    className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-base leading-none text-ink-60"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-[14px] font-extrabold text-ink">
                    {val}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setZoneDivisions((prev) => ({
                        ...prev,
                        [zone.id]: Math.min(max, prev[zone.id] + 1),
                      }))
                    }
                    className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-base leading-none text-ink-60"
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full"
                style={{ background: `${zone.color}33` }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-150"
                  style={{
                    background: zone.color,
                    width: `${(val / max) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-1 text-right text-[10px] text-ink-40">
                최대 {max}개
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-2.5 text-center text-[12px] text-ink-60">
          총 <strong className="text-ink">{total}개</strong> 섹션
        </div>
        <button
          type="button"
          onClick={onSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral py-3 text-[14px] font-extrabold text-white"
        >
          <div className="size-4">{I.check('#fff')}</div>
          저장 · 권한 부여 단계로
        </button>
      </div>
    </aside>
  )
}

// ── Assign Sidebar ────────────────────────────────────────────────────────────

function AssignSidebar({
  permissions,
  onRemovePermission,
  onBack,
}: {
  permissions: PermissionEntry[]
  onRemovePermission: (id: string) => void
  onBack: () => void
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-ink-60"
        >
          ← 구역 설정으로
        </button>
        <div className="text-[15px] font-extrabold text-ink">
          부스 권한 부여
        </div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          지도에서 드래그해 구역을 선택하세요
        </div>
      </div>

      {/* Registered orgs */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
          등록된 부스 관리자
        </div>
        <div className="flex flex-col gap-1">
          {ORG_LIST.map((org) => {
            const assigned = permissions
              .filter((p) => p.orgId === org.id)
              .reduce((sum, p) => sum + p.sections.length, 0)
            return (
              <div
                key={org.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5',
                  assigned === 0 && 'bg-surface-alt'
                )}
                style={
                  assigned > 0 ? { background: `${org.color}15` } : undefined
                }
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
      </div>

      {/* Assigned permissions */}
      <div className="flex-1 overflow-y-auto p-4">
        {permissions.length === 0 ? (
          <div className="py-8 text-center text-[12px] text-ink-40">
            아직 권한이 부여된 부스가 없어요
            <br />
            지도에서 구역을 드래그해보세요
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              배정 목록 ({permissions.length}건)
            </div>
            {permissions.map((p) => {
              const zone = ZONES.find((z) => z.id === p.zoneId)!
              return (
                <div key={p.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-0.5 size-2.5 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-ink">
                        {p.orgName}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-60">
                        {zone.name} · {p.sections.length}개 섹션
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemovePermission(p.id)}
                      className="ml-1 mt-0.5 shrink-0"
                    >
                      <div className="size-4">
                        {I.trash(FESTI_TOKENS.ink40)}
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}

// ── AdminBooths ───────────────────────────────────────────────────────────────

export function AdminBooths({ dark = false }: { dark?: boolean }) {
  const [step, setStep] = useState<'configure' | 'assign'>('configure')
  const [zoneDivisions, setZoneDivisions] = useState<Record<string, number>>(
    () => Object.fromEntries(ZONES.map((z) => [z.id, z.end - z.start + 1]))
  )
  const [permissions, setPermissions] = useState<PermissionEntry[]>([])
  const [dragState, setDragState] = useState<{
    zoneId: string | null
    startIdx: number | null
    currentIdx: number | null
    active: boolean
  }>({ zoneId: null, startIdx: null, currentIdx: null, active: false })
  const dragStateRef = useRef(dragState)
  useEffect(() => {
    dragStateRef.current = dragState
  })
  const [assignModal, setAssignModal] = useState<{
    zoneId: string
    sections: number[]
  } | null>(null)
  const [notice, setNotice] = useState('구역별 섹션 개수를 설정하고 저장하세요')

  function handleMapMouseUp() {
    if (
      step === 'assign' &&
      dragState.active &&
      dragState.zoneId &&
      dragState.startIdx !== null &&
      dragState.currentIdx !== null
    ) {
      const lo = Math.min(dragState.startIdx, dragState.currentIdx)
      const hi = Math.max(dragState.startIdx, dragState.currentIdx)
      const zoneId = dragState.zoneId
      const sections = Array.from(
        { length: hi - lo + 1 },
        (_, i) => lo + i
      ).filter(
        (idx) =>
          !permissions.some(
            (p) => p.zoneId === zoneId && p.sections.includes(idx)
          )
      )
      if (sections.length > 0) setAssignModal({ zoneId, sections })
    }
    setDragState({
      zoneId: null,
      startIdx: null,
      currentIdx: null,
      active: false,
    })
  }

  function handlePermissionAssign(orgId: string) {
    if (!assignModal) return
    const org = ORG_LIST.find((o) => o.id === orgId)!
    setPermissions((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        zoneId: assignModal.zoneId,
        sections: assignModal.sections,
        orgId,
        orgName: org.name,
        color: org.color,
      },
    ])
    setAssignModal(null)
    setNotice(`${org.name}에 권한을 부여했어요`)
  }

  return (
    <AdminShell active="booths" dark={dark}>
      <AdminTopBar
        title="부스 배치"
        sub={`${step === 'configure' ? '구역 설정' : '권한 부여'} · ${notice}`}
        dark={dark}
        right={
          step === 'configure' ? (
            <AdminBtn
              dark={dark}
              primary
              icon={I.check('#fff')}
              onClick={() => {
                setStep('assign')
                setNotice('지도에서 구역을 드래그해 권한을 부여하세요')
              }}
            >
              저장 · 권한 부여
            </AdminBtn>
          ) : (
            <>
              <AdminBtn
                dark={dark}
                icon={I.edit(FESTI_TOKENS.ink60)}
                onClick={() => {
                  setStep('configure')
                  setNotice('구역별 섹션 개수를 설정하고 저장하세요')
                }}
              >
                구역 재설정
              </AdminBtn>
              <AdminBtn
                dark={dark}
                primary
                icon={I.check('#fff')}
                onClick={() => setNotice('권한 설정을 저장했어요')}
              >
                저장
              </AdminBtn>
            </>
          )
        }
      />

      <div className="flex min-h-0 flex-1">
        {step === 'configure' ? (
          <ConfigureSidebar
            zoneDivisions={zoneDivisions}
            setZoneDivisions={setZoneDivisions}
            onSave={() => {
              setStep('assign')
              setNotice('지도에서 구역을 드래그해 권한을 부여하세요')
            }}
          />
        ) : (
          <AssignSidebar
            permissions={permissions}
            onRemovePermission={(id) =>
              setPermissions((prev) => prev.filter((p) => p.id !== id))
            }
            onBack={() => {
              setStep('configure')
              setNotice('구역별 섹션 개수를 설정하고 저장하세요')
            }}
          />
        )}

        {/* ── Map ── */}
        <main
          className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#E8F4F5] dark:bg-[#0B1A1F]"
          onMouseUp={handleMapMouseUp}
          onMouseLeave={handleMapMouseUp}
        >
          {/* Wrapper = exact image aspect ratio. h-full fills main, width auto-calculated. */}
          <div
            className={cn('relative h-full min-h-0 transition-transform')}
            style={{ aspectRatio: '1072 / 998', maxWidth: '100%' }}
          >
            <img
              src={soongsilMap}
              alt=""
              className="h-full w-full dark:brightness-[0.6] dark:saturate-[0.8]"
            />

            {/* ── Zone overlays ── */}
            {ZONES.map((zone) => {
              // configure: admin-set section count  /  assign: original full cell count
              const divisions =
                step === 'configure'
                  ? zoneDivisions[zone.id]
                  : zone.end - zone.start + 1
              return (
                <div
                  key={zone.id}
                  className="absolute z-4 flex rounded-sm"
                  style={{
                    left: zone.left,
                    top: zone.top,
                    width: zone.width,
                    height: zone.height,
                    flexDirection: zone.dir,
                    background: zone.color,
                    border: `1.5px solid rgba(20,26,31,0.22)`,
                  }}
                >
                  {Array.from({ length: divisions }, (_, idx) => {
                    // in assign step idx == absolute zone number offset (0-based)
                    const perm = permissions.find(
                      (p) => p.zoneId === zone.id && p.sections.includes(idx)
                    )
                    const si = dragState.startIdx
                    const ci = dragState.currentIdx
                    const inDrag =
                      step === 'assign' &&
                      dragState.active &&
                      dragState.zoneId === zone.id &&
                      si !== null &&
                      ci !== null &&
                      idx >= Math.min(si, ci) &&
                      idx <= Math.max(si, ci)
                    // keep scaled while modal is open for this zone's selected sections
                    const isModalSelected =
                      assignModal !== null &&
                      assignModal.zoneId === zone.id &&
                      assignModal.sections.includes(idx)
                    const isScaled = inDrag || isModalSelected

                    let selLo: number | null = null
                    let selHi: number | null = null
                    if (inDrag && si !== null && ci !== null) {
                      selLo = Math.min(si, ci)
                      selHi = Math.max(si, ci)
                    } else if (isModalSelected && assignModal) {
                      selLo = Math.min(...assignModal.sections)
                      selHi = Math.max(...assignModal.sections)
                    }

                    const isLast = idx === divisions - 1
                    // hide internal dividers inside the selection — outer border handles it
                    const dividerStyle =
                      isLast || isScaled
                        ? {}
                        : zone.dir === 'row'
                          ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                          : { borderBottom: '1px solid rgba(20,26,31,0.18)' }

                    return (
                      <div
                        key={idx}
                        className={cn(
                          'relative flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[9px] font-extrabold',
                          'transition-[background,box-shadow] duration-100',
                          perm ? 'text-white' : 'text-ink',
                          !isScaled &&
                            step === 'assign' &&
                            'hover:ring-[2.5px] hover:ring-inset hover:ring-white/90',
                          step === 'assign'
                            ? 'cursor-crosshair'
                            : 'cursor-default'
                        )}
                        style={{
                          background: perm
                            ? perm.color
                            : isScaled
                              ? 'rgba(0,0,0,0.22)'
                              : 'transparent',
                          boxShadow:
                            isScaled && selLo !== null && selHi !== null
                              ? selectionShadow(idx, selLo, selHi, zone.dir)
                              : undefined,
                          ...dividerStyle,
                        }}
                        onMouseDown={
                          step === 'assign'
                            ? (e) => {
                                e.preventDefault()
                                setDragState({
                                  zoneId: zone.id,
                                  startIdx: idx,
                                  currentIdx: idx,
                                  active: true,
                                })
                              }
                            : undefined
                        }
                        onMouseEnter={
                          step === 'assign'
                            ? () => {
                                if (
                                  dragStateRef.current.active &&
                                  dragStateRef.current.zoneId === zone.id
                                ) {
                                  setDragState((prev) => ({
                                    ...prev,
                                    currentIdx: idx,
                                  }))
                                }
                              }
                            : undefined
                        }
                      >
                        {zone.start + idx}
                        {perm && (
                          <div className="absolute bottom-0.5 right-0.5 size-1 rounded-full bg-white/70" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {/* ── Zone labels ── */}
            {ZONES.map((zone) => (
              <div
                key={`label-${zone.id}`}
                className="pointer-events-none absolute z-5"
                style={{ left: zone.left, top: `calc(${zone.top} - 16px)` }}
              >
                <div
                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.25 py-px text-[9px] font-extrabold text-ink"
                  style={{ background: `${zone.color}EE` }}
                >
                  <span className="inline-block size-1.25 rounded-full bg-ink opacity-40" />
                  {zone.name}
                </div>
              </div>
            ))}

            {/* ── Assign hint banner ── */}
            {step === 'assign' && (
              <div
                className="absolute bottom-6 left-6 rounded-[14px] border px-4 py-2.5 text-[12px] font-semibold text-ink-60 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)] backdrop-blur-xl"
                style={{
                  background: `${FESTI_TOKENS.coral}18`,
                  borderColor: `${FESTI_TOKENS.coral}44`,
                }}
              >
                <span className="text-ink">구역을 드래그</span>해 선택 후
                동아리/학생회를 배정하세요
              </div>
            )}
          </div>
          {/* end map wrapper */}
        </main>
      </div>

      {/* ── Permission modal ── */}
      {assignModal && (
        <PermissionModal
          zoneId={assignModal.zoneId}
          sections={assignModal.sections}
          orgs={ORG_LIST}
          permissions={permissions}
          onClose={() => setAssignModal(null)}
          onAssign={handlePermissionAssign}
        />
      )}
    </AdminShell>
  )
}
