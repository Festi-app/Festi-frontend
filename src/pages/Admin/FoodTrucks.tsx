import { useState } from 'react'
import { FESTI_TOKENS, I } from '../../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'
import type {
  FoodTruck,
  MenuItem,
  TruckDay,
  TruckTime,
} from '../../stores/useTruckPlacementStore'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Map view ──────────────────────────────────────────────────────────────────

function TruckMapView({ trucks }: { trucks: FoodTruck[] }) {
  const [time, setTime] = useState<TruckTime>('야간')
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const {
    assignments,
    slotCounts,
    zoneRotations,
    setSlotCount,
    setAssignment,
    removeAssignment,
    cleanupZoneSlots,
  } = useTruckPlacementStore()

  const zone = TRUCK_ZONES.find((z) => z.id === selectedZone)

  function assignKey(t: TruckTime, zoneId: string, slot: number) {
    return `${t}:${zoneId}:${slot}`
  }

  function assignedTruck(zoneId: string, slot: number) {
    const id = assignments[assignKey(time, zoneId, slot)]
    return trucks.find((t) => t.id === id) ?? null
  }

  function assign(truckId: string) {
    if (selectedZone === null || selectedSlot === null) return
    setAssignment(assignKey(time, selectedZone, selectedSlot), truckId)
    setSelectedSlot(null)
  }

  function unassign(zoneId: string, slot: number) {
    removeAssignment(assignKey(time, zoneId, slot))
  }

  function assignedTruckIds() {
    return new Set(
      Object.entries(assignments)
        .filter(([k]) => k.startsWith(time + ':'))
        .map(([, v]) => v)
    )
  }

  function changeSlotCount(zoneId: string, delta: number) {
    const current = slotCounts[zoneId] ?? 1
    const next = Math.max(1, Math.min(8, current + delta))
    if (next === current) return
    setSlotCount(zoneId, next)
    if (next < current) {
      cleanupZoneSlots(zoneId, next)
      if (
        selectedZone === zoneId &&
        selectedSlot !== null &&
        selectedSlot >= next
      ) {
        setSelectedSlot(null)
      }
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* ── Zone list panel ── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
        {/* Time toggle */}
        <div className="flex gap-1 border-b border-border p-3">
          {(['주간', '야간'] as TruckTime[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTime(t)
                setSelectedZone(null)
                setSelectedSlot(null)
              }}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                time === t
                  ? 'bg-cta text-cta-ink'
                  : 'bg-surface-alt text-ink-60'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Zone list */}
        <div className="flex-1 overflow-y-auto p-2">
          {TRUCK_ZONES.map((z) => {
            const count = slotCounts[z.id]
            const filled = Array.from(
              { length: count },
              (_, i) => !!assignments[assignKey(time, z.id, i)]
            )
            const filledCount = filled.filter(Boolean).length
            const sel = selectedZone === z.id
            return (
              <div
                key={z.id}
                onClick={() => {
                  setSelectedZone(z.id)
                  setSelectedSlot(null)
                }}
                className={cn(
                  'mb-1 w-full cursor-pointer rounded-xl px-3 py-2.5 transition-colors',
                  sel
                    ? 'bg-surface-alt ring-1 ring-inset ring-border'
                    : 'hover:bg-surface-alt/60'
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: z.color }}
                  />
                  <span className="text-[13px] font-bold text-ink">
                    {z.label}
                  </span>
                  <span className="ml-auto text-[11px] text-ink-40">
                    {filledCount}/{count}
                  </span>
                </div>
                <div className="mt-0.5 pl-4.5 text-[11px] text-ink-60">
                  {z.name}
                </div>

                {/* Section count controls — visible when zone selected */}
                {sel && (
                  <div
                    className="mt-2 flex flex-col gap-1.5 pl-4.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-7 text-[10px] text-ink-40">섹션</span>
                      <button
                        type="button"
                        disabled={count <= 1}
                        onClick={() => changeSlotCount(z.id, -1)}
                        className="flex size-4 items-center justify-center rounded bg-border text-[11px] font-bold text-ink-60 hover:bg-surface-alt disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-[12px] font-bold text-ink">
                        {count}
                      </span>
                      <button
                        type="button"
                        disabled={count >= 8}
                        onClick={() => changeSlotCount(z.id, 1)}
                        className="flex size-4 items-center justify-center rounded bg-border text-[11px] font-bold text-ink-60 hover:bg-surface-alt disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Slot pills */}
                <div className="mt-1.5 flex flex-wrap gap-1 pl-4.5">
                  {filled.map((f, i) => (
                    <span
                      key={i}
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                        f ? 'text-white' : 'bg-border text-ink-40'
                      )}
                      style={f ? { background: z.color } : {}}
                    >
                      {i + 1}번
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Map area ── */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#E8F4F5]">
        <div
          className="relative h-full min-h-0"
          style={{ aspectRatio: '822 / 590', maxWidth: '100%' }}
        >
          <img
            src={soongsilTruckMap}
            alt="숭실대 푸드트럭 배치 지도"
            className="h-full w-full"
            draggable={false}
          />

          {/* Zone overlays */}
          {TRUCK_ZONES.map((z) => {
            const selZone = selectedZone === z.id
            const rotate = zoneRotations[z.id] ?? z.rotate
            const slots = Array.from({ length: slotCounts[z.id] }, (_, i) => i)
            return (
              <div
                key={z.id}
                className="absolute"
                style={{
                  left: z.left,
                  top: z.top,
                  width: z.width,
                  height: z.height,
                  transform: `rotate(${rotate}deg)`,
                  transformOrigin: 'center',
                }}
              >
                <div
                  className={cn(
                    'flex h-full overflow-hidden rounded-sm border border-[rgba(20,26,31,0.22)] shadow-[0_6px_16px_rgba(0,0,0,0.18)]',
                    z.dir === 'row' ? 'flex-row' : 'flex-col'
                  )}
                  style={{ background: z.color }}
                >
                  {slots.map((idx) => {
                    const truck = assignedTruck(z.id, idx)
                    const selSlot = selZone && selectedSlot === idx
                    const isLast = idx === slots.length - 1
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedZone(z.id)
                          setSelectedSlot(idx)
                        }}
                        title={`${z.label} ${idx + 1}번${truck ? ` · ${truck.name}` : ''}`}
                        className={cn(
                          'flex min-h-0 min-w-0 flex-1 items-center justify-center text-[8px] font-extrabold transition-[background,box-shadow]',
                          selSlot
                            ? 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.95)]'
                            : 'hover:brightness-110'
                        )}
                        style={{
                          background: truck ? '#2E363C' : 'transparent',
                          color: truck ? '#fff' : FESTI_TOKENS.ink,
                          ...(isLast
                            ? {}
                            : z.dir === 'row'
                              ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                              : {
                                  borderBottom: '1px solid rgba(20,26,31,0.18)',
                                }),
                        }}
                      >
                        {truck ? truck.name.slice(0, 3) : `${idx + 1}`}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Assignment panel ── */}
      <aside className="flex w-64 shrink-0 flex-col border-l border-border bg-surface">
        {zone && selectedSlot !== null ? (
          <>
            <div className="border-b border-border px-4 py-3">
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-ink-40">
                배정 · {zone.label} {selectedSlot + 1}번
              </div>
              <div className="mt-0.5 text-[13px] font-bold text-ink">
                {zone.name}
              </div>
            </div>

            {/* Currently assigned */}
            {assignedTruck(zone.id, selectedSlot) && (
              <div className="mx-3 mt-3 flex items-center justify-between rounded-xl border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[11px] text-ink-40">현재 배정</div>
                  <div className="text-[13px] font-bold text-ink">
                    {assignedTruck(zone.id, selectedSlot)!.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => unassign(zone.id, selectedSlot)}
                  className="text-[11px] font-semibold text-alert"
                >
                  해제
                </button>
              </div>
            )}

            <div className="px-4 pb-2 pt-3 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              업체 선택
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {trucks.map((truck) => {
                const already = assignedTruckIds().has(truck.id)
                const current =
                  assignedTruck(zone.id, selectedSlot)?.id === truck.id
                return (
                  <button
                    key={truck.id}
                    type="button"
                    disabled={already && !current}
                    onClick={() => assign(truck.id)}
                    className={cn(
                      'mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors',
                      current
                        ? 'bg-cta/10 ring-1 ring-inset ring-cta/40'
                        : already
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-surface-alt'
                    )}
                  >
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                      style={{ background: zone.color }}
                    >
                      {truck.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-ink truncate">
                        {truck.name}
                      </div>
                      <div className="text-[10px] text-ink-40">
                        {truck.days.map((d) => `${d}일`).join('·')} ·{' '}
                        {truck.startTime}~{truck.endTime}
                      </div>
                    </div>
                    {current && (
                      <span className="size-4 shrink-0 text-cta">
                        {I.check('#00C6E0')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        ) : zone ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-ink-40">
            <div className="size-8">{I.map()}</div>
            <div className="text-[13px] font-semibold">슬롯을 선택하세요</div>
            <div className="text-[11px]">{zone.label} 내 번호를 클릭</div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-ink-40">
            <div className="size-8">{I.map()}</div>
            <div className="text-[13px] font-semibold">구역을 선택하세요</div>
            <div className="text-[11px]">지도 또는 좌측 목록 클릭</div>
          </div>
        )}
      </aside>
    </div>
  )
}

function uid() {
  return Math.random().toString(36).slice(2)
}

// ── AdminFoodTrucks ───────────────────────────────────────────────────────────

export function AdminFoodTrucks() {
  const [view, setView] = useState<'목록' | '배치도'>('목록')
  const { trucks, setTrucks } = useTruckPlacementStore()
  const [selectedId, setSelectedId] = useState<string>(trucks[0]?.id ?? '')
  const [notice, setNotice] = useState('업체를 선택해 정보를 수정하세요')

  const selected = trucks.find((t) => t.id === selectedId) ?? trucks[0]

  function updateTruck(patch: Partial<Omit<FoodTruck, 'id'>>) {
    if (!selected) return
    setTrucks(
      trucks.map((t) => (t.id === selected.id ? { ...t, ...patch } : t))
    )
  }

  function addTruck() {
    const newId = uid()
    const newTruck: FoodTruck = {
      id: newId,
      name: '새 업체',
      days: [1, 2, 3],
      startTime: '10:00',
      endTime: '20:00',
      note: '',
      menus: [],
    }
    setTrucks([...trucks, newTruck])
    setSelectedId(newId)
  }

  function deleteTruck(id: string) {
    const nextTrucks = trucks.filter((t) => t.id !== id)
    setTrucks(nextTrucks)
    if (selectedId === id) setSelectedId(nextTrucks[0]?.id ?? '')
  }

  function addMenu() {
    if (!selected) return
    updateTruck({
      menus: [...selected.menus, { id: uid(), name: '', price: '' }],
    })
  }

  function updateMenu(menuId: string, patch: Partial<MenuItem>) {
    if (!selected) return
    updateTruck({
      menus: selected.menus.map((m) =>
        m.id === menuId ? { ...m, ...patch } : m
      ),
    })
  }

  function deleteMenu(menuId: string) {
    if (!selected) return
    updateTruck({ menus: selected.menus.filter((m) => m.id !== menuId) })
  }

  function save() {
    if (!selected) return
    setNotice(`${selected.name} 정보를 저장했어요`)
  }

  if (!selected) {
    return (
      <AdminShell active="trucks">
        <AdminTopBar
          title="푸드트럭"
          sub="등록된 업체가 없어요"
          right={
            <AdminBtn primary icon={I.plus('#fff')} onClick={addTruck}>
              업체 추가
            </AdminBtn>
          }
        />
      </AdminShell>
    )
  }

  return (
    <AdminShell active="trucks">
      <AdminTopBar
        title="푸드트럭"
        sub={`총 ${trucks.length}개 업체 · ${notice}`}
        right={
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex gap-0.5 rounded-xl border border-border bg-surface-alt p-0.5">
              {(['목록', '배치도'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors',
                    view === v ? 'bg-surface text-ink shadow-sm' : 'text-ink-60'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {view === '목록' && (
              <AdminBtn primary icon={I.check('#fff')} onClick={save}>
                저장
              </AdminBtn>
            )}
          </div>
        }
      />

      {view === '배치도' ? (
        <TruckMapView trucks={trucks} />
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Truck list ── */}
          <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-ink-40">
                업체 목록
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {trucks.map((truck) => (
                <button
                  key={truck.id}
                  type="button"
                  onClick={() => setSelectedId(truck.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors',
                    selectedId === truck.id
                      ? 'bg-cta/10 text-cta'
                      : 'text-ink hover:bg-surface-alt'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold">
                      {truck.name}
                    </div>
                    <div className="text-[11px] text-ink-40">
                      {truck.menus.length}개 메뉴
                      {truck.days.length > 0 &&
                        ` · ${truck.days.map((d) => `${d}일`).join('·')}`}
                      {truck.startTime &&
                        ` · ${truck.startTime}~${truck.endTime}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={addTruck}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-[12px] font-bold text-ink-60 hover:bg-surface-alt"
              >
                <div className="size-3.5">{I.plus(FESTI_TOKENS.ink40)}</div>
                업체 추가
              </button>
            </div>
          </aside>

          {/* ── Editor ── */}
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg p-6">
            <div className="mx-auto w-full max-w-xl">
              {/* Truck name + note */}
              <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[15px] font-extrabold text-ink">
                    업체 정보
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTruck(selected.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-alert"
                  >
                    <div className="size-3.5">
                      {I.trash(FESTI_TOKENS.alert)}
                    </div>
                    삭제
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className=" text-[11px] font-bold text-ink-60">
                    업체 이름
                  </div>
                  <input
                    value={selected.name}
                    onChange={(e) => updateTruck({ name: e.target.value })}
                    placeholder="업체 이름"
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[14px] font-bold text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                  />

                  <div>
                    <div className="mb-2 text-[11px] font-bold text-ink-60">
                      운영 날짜{' '}
                      <span className="font-normal text-ink-40">
                        (중복 선택)
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {([1, 2, 3] as TruckDay[]).map((d) => {
                        const on = selected.days.includes(d)
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() =>
                              updateTruck({
                                days: on
                                  ? selected.days.filter((x) => x !== d)
                                  : [...selected.days, d].sort(),
                              })
                            }
                            className={cn(
                              'flex-1 rounded-xl border py-2 text-[12px] font-bold transition-colors',
                              on
                                ? 'border-cta bg-cta/10 text-cta'
                                : 'border-border bg-bg text-ink-40'
                            )}
                          >
                            {d}일차
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-[11px] font-bold text-ink-60">
                      운영 시간
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={selected.startTime}
                        onChange={(e) =>
                          updateTruck({ startTime: e.target.value })
                        }
                        className="flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink focus:border-cta focus:outline-none"
                      />
                      <span className="shrink-0 text-[12px] text-ink-40">
                        ~
                      </span>
                      <input
                        type="time"
                        value={selected.endTime}
                        onChange={(e) =>
                          updateTruck({ endTime: e.target.value })
                        }
                        className="flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink focus:border-cta focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                      특이사항{' '}
                      <span className="font-normal text-ink-40">(선택)</span>
                    </div>
                    <input
                      value={selected.note}
                      onChange={(e) => updateTruck({ note: e.target.value })}
                      placeholder="예: 우천 시 미운영"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[15px] font-extrabold text-ink">
                    메뉴{' '}
                    <span className="ml-1 text-[13px] font-semibold text-ink-40">
                      {selected.menus.length}개
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addMenu}
                    className="flex items-center gap-1 text-[12px] font-bold text-cta"
                  >
                    <div className="size-3.5">{I.plus(FESTI_TOKENS.coral)}</div>
                    메뉴 추가
                  </button>
                </div>

                {selected.menus.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-ink-40">
                    메뉴가 없어요. 위 버튼으로 추가하세요.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-1">
                      <div className="text-[11px] font-bold text-ink-40">
                        메뉴명
                      </div>
                      <div className="w-40 text-[11px] font-bold text-ink-40">
                        가격
                      </div>
                      <div className="size-6" />
                    </div>
                    {selected.menus.map((menu, idx) => (
                      <div
                        key={menu.id}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-2"
                      >
                        <input
                          value={menu.name}
                          onChange={(e) =>
                            updateMenu(menu.id, { name: e.target.value })
                          }
                          placeholder={`메뉴 ${idx + 1}`}
                          className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                        />
                        <input
                          value={menu.price}
                          onChange={(e) =>
                            updateMenu(menu.id, { price: e.target.value })
                          }
                          placeholder="가격"
                          className="w-40 rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteMenu(menu.id)}
                          className="flex size-6 shrink-0 items-center justify-center rounded-lg text-ink-40 hover:text-alert"
                        >
                          <div className="size-3.5">
                            {I.trash(FESTI_TOKENS.ink40)}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
                <div className="mb-3 text-[13px] font-extrabold text-ink-60">
                  미리보기
                </div>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[1fr_2fr] border-b border-border bg-surface-alt">
                    <div className="px-4 py-2.5 text-[12px] font-extrabold text-ink">
                      업체 이름
                    </div>
                    <div className="border-l border-border px-4 py-2.5 text-[12px] font-extrabold text-ink">
                      메뉴 (가격)
                    </div>
                  </div>
                  {selected.menus.length === 0 ? (
                    <div className="px-4 py-3 text-[12px] text-ink-40">
                      메뉴 없음
                    </div>
                  ) : (
                    <div className="grid grid-cols-[1fr_2fr]">
                      <div className="flex items-center border-b border-border px-4 py-3">
                        <div className="text-[13px] font-bold text-ink">
                          {selected.name || '—'}
                          {selected.days.length > 0 && (
                            <div className="text-[10px] font-normal text-ink-40">
                              {selected.days.map((d) => `${d}일차`).join('·')}
                              {selected.startTime &&
                                ` ${selected.startTime}~${selected.endTime}`}
                            </div>
                          )}
                          {selected.note && (
                            <div className="text-[10px] font-normal text-ink-40">
                              {selected.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className=" flex flex-col items-start justify-center border-b border-border border-l px-4 py-3 text-[13px] text-ink">
                        {selected.menus.map((m) => (
                          <div key={m.id}>
                            {m.name || '—'}
                            {m.price && (
                              <span className="text-ink-60"> ({m.price})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </AdminShell>
  )
}
