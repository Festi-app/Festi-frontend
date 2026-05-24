import { useState, useEffect } from 'react'
import { FESTIV_TOKENS, I } from '../../tokens'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { cn } from '../../lib/cn'
import soongsilTruckMap from '../../assets/soongsil-truck-map.png'
import {
  TRUCK_ZONES,
  useTruckPlacementStore,
} from '../../stores/useTruckPlacementStore'
import type { FoodTruck, TruckTime } from '../../stores/useTruckPlacementStore'
import { useBooths } from '../../features/Booth/hooks/useBooths'
import { useBooth } from '../../features/Booth/hooks/useBooth'
import { useUpdateFoodTruck } from '../../features/Booth/hooks/useUpdateFoodTruck'
import { useDeleteFoodTruck } from '../../features/Booth/hooks/useDeleteFoodTruck'
import { useCreateBooth } from '../../features/Booth/hooks/useCreateBooth'
import { useMenus } from '../../features/Menu/hooks/useMenus'
import { useCreateMenu } from '../../features/Menu/hooks/useCreateMenu'
import { useUpdateMenu } from '../../features/Menu/hooks/useUpdateMenu'
import { useDeleteMenu } from '../../features/Menu/hooks/useDeleteMenu'
import { postMenu } from '../../features/Menu/apis/postMenu'
import type { MenusResponseDto } from '../../features/Menu/types/MenusResponseDto'

// ── Map view (로컬 store 기반 위치 배정 — 별개 기능) ────────────────────────

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
      if (selectedZone === zoneId && selectedSlot !== null && selectedSlot >= next) {
        setSelectedSlot(null)
      }
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex gap-1 border-b border-border p-3">
          {(['주간', '야간'] as TruckTime[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTime(t); setSelectedZone(null); setSelectedSlot(null) }}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-[12px] font-bold transition-colors',
                time === t ? 'bg-cta text-cta-ink' : 'bg-surface-alt text-ink-60'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {TRUCK_ZONES.map((z) => {
            const count = slotCounts[z.id]
            const filled = Array.from({ length: count }, (_, i) => !!assignments[assignKey(time, z.id, i)])
            const filledCount = filled.filter(Boolean).length
            const sel = selectedZone === z.id
            return (
              <div
                key={z.id}
                onClick={() => { setSelectedZone(z.id); setSelectedSlot(null) }}
                className={cn(
                  'mb-1 w-full cursor-pointer rounded-xl px-3 py-2.5 transition-colors',
                  sel ? 'bg-surface-alt ring-1 ring-inset ring-border' : 'hover:bg-surface-alt/60'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: z.color }} />
                  <span className="text-[13px] font-bold text-ink">{z.label}</span>
                  <span className="ml-auto text-[11px] text-ink-40">{filledCount}/{count}</span>
                </div>
                <div className="mt-0.5 pl-4.5 text-[11px] text-ink-60">{z.name}</div>

                {sel && (
                  <div className="mt-2 flex flex-col gap-1.5 pl-4.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-7 text-[10px] text-ink-40">섹션</span>
                      <button type="button" disabled={count <= 1} onClick={() => changeSlotCount(z.id, -1)}
                        className="flex size-4 items-center justify-center rounded bg-border text-[11px] font-bold text-ink-60 hover:bg-surface-alt disabled:opacity-30">−</button>
                      <span className="w-4 text-center text-[12px] font-bold text-ink">{count}</span>
                      <button type="button" disabled={count >= 8} onClick={() => changeSlotCount(z.id, 1)}
                        className="flex size-4 items-center justify-center rounded bg-border text-[11px] font-bold text-ink-60 hover:bg-surface-alt disabled:opacity-30">+</button>
                    </div>
                  </div>
                )}

                <div className="mt-1.5 flex flex-wrap gap-1 pl-4.5">
                  {filled.map((f, i) => (
                    <span key={i} className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold', f ? 'text-white' : 'bg-border text-ink-40')}
                      style={f ? { background: z.color } : {}}>{i + 1}번</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#E8F4F5]">
        <div className="relative h-full min-h-0" style={{ aspectRatio: '822 / 590', maxWidth: '100%' }}>
          <img src={soongsilTruckMap} alt="숭실대 푸드트럭 배치 지도" className="h-full w-full" draggable={false} />
          {TRUCK_ZONES.map((z) => {
            const selZone = selectedZone === z.id
            const rotate = zoneRotations[z.id] ?? z.rotate
            const slots = Array.from({ length: slotCounts[z.id] }, (_, i) => i)
            return (
              <div key={z.id} className="absolute" style={{ left: z.left, top: z.top, width: z.width, height: z.height, transform: `rotate(${rotate}deg)`, transformOrigin: 'center' }}>
                <div className={cn('flex h-full overflow-hidden rounded-sm border border-[rgba(20,26,31,0.22)] shadow-[0_6px_16px_rgba(0,0,0,0.18)]', z.dir === 'row' ? 'flex-row' : 'flex-col')} style={{ background: z.color }}>
                  {slots.map((idx) => {
                    const truck = assignedTruck(z.id, idx)
                    const selSlot = selZone && selectedSlot === idx
                    const isLast = idx === slots.length - 1
                    return (
                      <button key={idx} type="button"
                        onClick={() => { setSelectedZone(z.id); setSelectedSlot(idx) }}
                        title={`${z.label} ${idx + 1}번${truck ? ` · ${truck.name}` : ''}`}
                        className={cn('flex min-h-0 min-w-0 flex-1 items-center justify-center text-[8px] font-extrabold transition-[background,box-shadow]', selSlot ? 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.95)]' : 'hover:brightness-110')}
                        style={{ background: truck ? '#2E363C' : 'transparent', color: truck ? '#fff' : FESTIV_TOKENS.ink, ...(isLast ? {} : z.dir === 'row' ? { borderRight: '1px solid rgba(20,26,31,0.18)' } : { borderBottom: '1px solid rgba(20,26,31,0.18)' }) }}>
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

      <aside className="flex w-64 shrink-0 flex-col border-l border-border bg-surface">
        {zone && selectedSlot !== null ? (
          <>
            <div className="border-b border-border px-4 py-3">
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-ink-40">
                배정 · {zone.label} {selectedSlot + 1}번
              </div>
              <div className="mt-0.5 text-[13px] font-bold text-ink">{zone.name}</div>
            </div>
            {assignedTruck(zone.id, selectedSlot) && (
              <div className="mx-3 mt-3 flex items-center justify-between rounded-xl border border-border bg-bg px-3 py-2">
                <div>
                  <div className="text-[11px] text-ink-40">현재 배정</div>
                  <div className="text-[13px] font-bold text-ink">{assignedTruck(zone.id, selectedSlot)!.name}</div>
                </div>
                <button type="button" onClick={() => unassign(zone.id, selectedSlot)} className="text-[11px] font-semibold text-alert">해제</button>
              </div>
            )}
            <div className="px-4 pb-2 pt-3 text-[11px] font-extrabold uppercase tracking-wide text-ink-40">업체 선택</div>
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {trucks.map((truck) => {
                const already = assignedTruckIds().has(truck.id)
                const current = assignedTruck(zone.id, selectedSlot)?.id === truck.id
                return (
                  <button key={truck.id} type="button" disabled={already && !current} onClick={() => assign(truck.id)}
                    className={cn('mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors', current ? 'bg-cta/10 ring-1 ring-inset ring-cta/40' : already ? 'cursor-not-allowed opacity-40' : 'hover:bg-surface-alt')}>
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white" style={{ background: zone.color }}>{truck.name[0]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-ink">{truck.name}</div>
                    </div>
                    {current && <span className="size-4 shrink-0 text-cta">{I.check('#00C6E0')}</span>}
                  </button>
                )
              })}
            </div>
          </>
        ) : zone ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-ink-40">
            <div className="size-8">{I.map()}</div>
            <div className="text-[13px] font-semibold">슬롯을 선택하세요</div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-ink-40">
            <div className="size-8">{I.map()}</div>
            <div className="text-[13px] font-semibold">구역을 선택하세요</div>
          </div>
        )}
      </aside>
    </div>
  )
}

// ── Menu row (inline edit, save on blur) ─────────────────────────────────────

function MenuRow({
  menu,
  onUpdate,
  onDelete,
}: {
  menu: MenusResponseDto
  onUpdate: (menuId: string, body: Partial<MenusResponseDto>) => void
  onDelete: (menuId: string) => void
}) {
  const [name, setName] = useState(menu.name)
  const [price, setPrice] = useState(String(menu.price))

  function handleBlur() {
    const parsedPrice = Number(price.replace(/[^0-9]/g, '')) || 0
    onUpdate(menu.id, { name, price: parsedPrice })
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        placeholder="메뉴명"
        className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onBlur={handleBlur}
        placeholder="가격"
        className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onDelete(menu.id)}
        className="flex size-6 shrink-0 items-center justify-center rounded-lg text-ink-40 hover:text-alert"
      >
        <div className="size-3.5">{I.trash(FESTIV_TOKENS.ink40)}</div>
      </button>
    </div>
  )
}

// ── Truck editor (remounts on selection change via key) ───────────────────────

function TruckEditor({
  boothId,
  onCreated,
}: {
  boothId: string
  onCreated?: (id: string) => void
}) {
  const isNew = boothId === 'new'
  const { data: booth } = useBooth(isNew ? null : boothId)
  const { data: menus = [] } = useMenus(isNew ? '' : boothId)
  const { mutate: updateBooth, isPending: isUpdating } = useUpdateFoodTruck()
  const { mutate: createBooth, isPending: isCreating } = useCreateBooth()
  const { mutate: createMenu } = useCreateMenu(boothId)
  const { mutate: updateMenu } = useUpdateMenu(boothId)
  const { mutate: deleteMenu } = useDeleteMenu(boothId)

  const isSaving = isUpdating || isCreating

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [operatingHours, setOperatingHours] = useState('')
  const [saved, setSaved] = useState(false)
  const [draftMenus, setDraftMenus] = useState<{ localId: string; name: string; price: string }[]>([])

  useEffect(() => {
    if (booth) {
      setName(booth.name)
      setDescription(booth.description ?? '')
      setOperatingHours(booth.operatingHours ?? '')
    }
  }, [booth])

  function handleSave() {
    if (isNew) {
      if (!name.trim()) return
      createBooth(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          operatingHours: operatingHours.trim() || undefined,
        },
        {
          onSuccess: async (created) => {
            const validMenus = draftMenus.filter((m) => m.name.trim())
            if (validMenus.length > 0) {
              await Promise.all(
                validMenus.map((m, i) =>
                  postMenu(created.id, {
                    name: m.name.trim(),
                    price: Number(m.price.replace(/[^0-9]/g, '')) || 0,
                    description: null,
                    imageUrl: null,
                    isSoldOut: false,
                    sortOrder: i,
                  })
                )
              )
            }
            onCreated?.(created.id)
          },
        }
      )
      return
    }
    updateBooth(
      {
        boothId,
        body: {
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          operatingHours: operatingHours.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        },
      }
    )
  }

  function handleAddMenu() {
    createMenu({
      id: '',
      name: '',
      price: 0,
      description: null,
      imageUrl: null,
      isSoldOut: false,
      sortOrder: menus.length,
    } as MenusResponseDto)
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg p-6">
      <div className="mx-auto w-full max-w-xl">
        {/* 업체 정보 */}
        <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[15px] font-extrabold text-ink">업체 정보</div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || (isNew && !name.trim())}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-extrabold text-white transition-colors disabled:opacity-40',
                saved ? 'bg-pop' : 'bg-cta'
              )}
            >
              <div className="size-3.5">{I.check('#fff')}</div>
              {saved ? '저장됨' : isSaving ? '저장 중...' : isNew ? '업체 추가' : '저장'}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-1.5 text-[11px] font-bold text-ink-60">업체 이름</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="업체 이름"
                className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[14px] font-bold text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold text-ink-60">운영 시간</div>
              <input
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="예: 10:00 ~ 20:00"
                className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                특이사항 <span className="font-normal text-ink-40">(선택)</span>
              </div>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 우천 시 미운영"
                className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[15px] font-extrabold text-ink">
              메뉴{' '}
              <span className="ml-1 text-[13px] font-semibold text-ink-40">
                {isNew ? draftMenus.length : menus.length}개
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isNew) {
                  setDraftMenus((prev) => [...prev, { localId: crypto.randomUUID(), name: '', price: '' }])
                } else {
                  handleAddMenu()
                }
              }}
              className="flex items-center gap-1 text-[12px] font-bold text-cta"
            >
              <div className="size-3.5">{I.plus(FESTIV_TOKENS.coral)}</div>
              메뉴 추가
            </button>
          </div>

          {isNew ? (
            draftMenus.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-ink-40">
                메뉴가 없어요. 위 버튼으로 추가하세요.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-1">
                  <div className="text-[11px] font-bold text-ink-40">메뉴명</div>
                  <div className="w-28 text-[11px] font-bold text-ink-40">가격</div>
                  <div className="size-6" />
                </div>
                {draftMenus.map((m) => (
                  <div key={m.localId} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                    <input
                      value={m.name}
                      onChange={(e) => setDraftMenus((prev) => prev.map((d) => d.localId === m.localId ? { ...d, name: e.target.value } : d))}
                      placeholder="메뉴명"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                    />
                    <input
                      value={m.price}
                      onChange={(e) => setDraftMenus((prev) => prev.map((d) => d.localId === m.localId ? { ...d, price: e.target.value } : d))}
                      placeholder="가격"
                      className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDraftMenus((prev) => prev.filter((d) => d.localId !== m.localId))}
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg text-ink-40 hover:text-alert"
                    >
                      <div className="size-3.5">{I.trash(FESTIV_TOKENS.ink40)}</div>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : menus.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-ink-40">
              메뉴가 없어요. 위 버튼으로 추가하세요.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-1">
                <div className="text-[11px] font-bold text-ink-40">메뉴명</div>
                <div className="w-28 text-[11px] font-bold text-ink-40">가격</div>
                <div className="size-6" />
              </div>
              {menus.map((menu) => (
                <MenuRow
                  key={menu.id}
                  menu={menu}
                  onUpdate={(menuId, body) => updateMenu({ menuId, body })}
                  onDelete={(menuId) => deleteMenu(menuId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 미리보기 */}
        <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 text-[13px] font-extrabold text-ink-60">미리보기</div>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1fr_2fr] border-b border-border bg-surface-alt">
              <div className="px-4 py-2.5 text-[12px] font-extrabold text-ink">업체 이름</div>
              <div className="border-l border-border px-4 py-2.5 text-[12px] font-extrabold text-ink">메뉴 (가격)</div>
            </div>
            {menus.length === 0 ? (
              <div className="px-4 py-3 text-[12px] text-ink-40">메뉴 없음</div>
            ) : (
              <div className="grid grid-cols-[1fr_2fr]">
                <div className="flex items-center border-b border-border px-4 py-3">
                  <div className="text-[13px] font-bold text-ink">
                    {name || '—'}
                    {operatingHours && (
                      <div className="text-[10px] font-normal text-ink-40">{operatingHours}</div>
                    )}
                    {description && (
                      <div className="text-[10px] font-normal text-ink-40">{description}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center border-b border-border border-l px-4 py-3 text-[13px] text-ink">
                  {menus.map((m) => (
                    <div key={m.id}>
                      {m.name || '—'}
                      {m.price > 0 && (
                        <span className="text-ink-60"> ({m.price.toLocaleString()}원)</span>
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
  )
}

// ── AdminFoodTrucks ───────────────────────────────────────────────────────────

export function AdminFoodTrucks() {
  const [view, setView] = useState<'목록' | '배치도'>('목록')
  const { data: booths = [], isLoading } = useBooths({ type: 'FOOD_TRUCK' })
  const { mutate: deleteBooth } = useDeleteFoodTruck()
  const [selectedId, setSelectedId] = useState<string>('')

  useEffect(() => {
    if (booths.length > 0 && !selectedId) {
      setSelectedId(booths[0].id)
    }
  }, [booths, selectedId])

  const storeTrucks = useTruckPlacementStore((s) => s.trucks)

  const viewToggle = (
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
  )

  if (isLoading) {
    return (
      <AdminShell active="trucks">
        <AdminTopBar title="푸드트럭" sub="불러오는 중..." right={viewToggle} />
      </AdminShell>
    )
  }

  const sub = selectedId === 'new' ? '새 업체' : `총 ${booths.length}개 업체`

  return (
    <AdminShell active="trucks">
      <AdminTopBar
        title="푸드트럭"
        sub={sub}
        right={
          <div className="flex items-center gap-2">
            {viewToggle}
            {view === '목록' && (
              <AdminBtn primary icon={I.plus('#fff')} onClick={() => setSelectedId('new')}>
                업체 추가
              </AdminBtn>
            )}
          </div>
        }
      />

      {view === '배치도' ? (
        <TruckMapView trucks={storeTrucks} />
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-ink-40">
                업체 목록
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {selectedId === 'new' && (
                <div className="mb-1 flex w-full items-center gap-2.5 rounded-xl bg-cta/10 px-3 py-2.5">
                  <div className="truncate text-[13px] font-bold text-cta">새 업체</div>
                </div>
              )}
              {booths.map((booth) => (
                <div
                  key={booth.id}
                  className={cn(
                    'group flex w-full items-center gap-1 rounded-xl px-3 py-2.5 transition-colors',
                    selectedId === booth.id ? 'bg-cta/10' : 'hover:bg-surface-alt'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(booth.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className={cn('truncate text-[13px] font-bold', selectedId === booth.id ? 'text-cta' : 'text-ink')}>
                      {booth.name}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`"${booth.name}" 업체를 삭제할까요?`)) return
                      deleteBooth(booth.id, {
                        onSuccess: () => {
                          if (selectedId === booth.id) setSelectedId('')
                        },
                      })
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="삭제"
                  >
                    <div className="size-3.5 text-ink-40 hover:text-alert">{I.trash(FESTIV_TOKENS.ink40)}</div>
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => setSelectedId('new')}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-[12px] font-bold text-ink-60 hover:bg-surface-alt"
              >
                <div className="size-3.5">{I.plus(FESTIV_TOKENS.ink40)}</div>
                업체 추가
              </button>
            </div>
          </aside>

          {selectedId && (
            <TruckEditor
              key={selectedId}
              boothId={selectedId}
              onCreated={(id) => setSelectedId(id)}
            />
          )}
        </div>
      )}
    </AdminShell>
  )
}
