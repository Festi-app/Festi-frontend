import { useState } from 'react'
import { FESTIV_TOKENS, I } from '../../tokens'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { AdminModal } from '../../components/Admin/AdminModal'
import { AdminToast } from '../../components/Admin/AdminToast'
import { cn } from '../../lib/cn'
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
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'

// ── operatingHours 파싱/빌드 헬퍼 ────────────────────────────────────────────
// 저장 포맷: "1일차·2일차 10:00~20:00"

const TIME_RE = /^\d{2}:\d{2}$/

function parseOH(oh: string | null | undefined) {
  if (!oh) return { days: [] as number[], start: '10:00', end: '20:00' }
  const spaceIdx = oh.lastIndexOf(' ')
  const timePart = spaceIdx >= 0 ? oh.slice(spaceIdx + 1) : oh
  const dayPart = spaceIdx >= 0 ? oh.slice(0, spaceIdx) : ''
  const days = dayPart
    ? dayPart
        .split('·')
        .map((s) => parseInt(s))
        .filter((n) => !isNaN(n))
    : []
  const [rawStart, rawEnd] = timePart.split('~').map((s) => s.trim())
  const start = TIME_RE.test(rawStart ?? '') ? rawStart : '10:00'
  const end = TIME_RE.test(rawEnd ?? '') ? rawEnd : '20:00'
  return { days, start, end }
}

function buildOH(days: number[], start: string, end: string) {
  const time = `${start}~${end}`
  if (days.length === 0) return time
  return (
    days
      .sort((a, b) => a - b)
      .map((d) => `${d}일차`)
      .join('·') +
    ' ' +
    time
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
        className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={handleBlur}
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
  onDelete,
}: {
  boothId: string
  onCreated?: (id: string, name: string) => void
  onDelete?: () => void
}) {
  const isNew = boothId === 'new'
  const { data: booth, isLoading } = useBooth(isNew ? null : boothId)

  if (!isNew && isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center text-[13px] text-ink-40">
        불러오는 중...
      </main>
    )
  }

  return (
    <TruckEditorForm
      boothId={boothId}
      isNew={isNew}
      booth={booth}
      onCreated={onCreated}
      onDelete={onDelete}
    />
  )
}

function TruckEditorForm({
  boothId,
  isNew,
  booth,
  onCreated,
  onDelete,
}: {
  boothId: string
  isNew: boolean
  booth: ReturnType<typeof useBooth>['data']
  onCreated?: (id: string, name: string) => void
  onDelete?: () => void
}) {
  const { data: menus = [] } = useMenus(isNew ? '' : boothId)
  const { data: festivalDays = [] } = useFestivalDays()
  const { mutate: updateBooth, isPending: isUpdating } = useUpdateFoodTruck()
  const { mutate: createBooth, isPending: isCreating } = useCreateBooth()
  const { mutate: createMenu } = useCreateMenu(boothId)
  const { mutate: updateMenu } = useUpdateMenu(boothId)
  const { mutate: deleteMenu } = useDeleteMenu(boothId)

  const isSaving = isUpdating || isCreating

  const parsed = parseOH(booth?.operatingHours)
  const [name, setName] = useState(booth?.name ?? '')
  const [description, setDescription] = useState(booth?.description ?? '')
  const [selectedDays, setSelectedDays] = useState<number[]>(parsed.days)
  const [startTime, setStartTime] = useState(parsed.start)
  const [endTime, setEndTime] = useState(parsed.end)
  const [saved, setSaved] = useState(false)

  function toggleDay(d: number) {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }
  const [draftMenus, setDraftMenus] = useState<
    { localId: string; name: string; price: string }[]
  >([])
  const [pendingMenus, setPendingMenus] = useState<
    { localId: string; name: string; price: string }[]
  >([])

  function handleSave() {
    const oh = buildOH(selectedDays, startTime, endTime)
    if (isNew) {
      if (!name.trim()) return
      createBooth(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          operatingHours: oh || undefined,
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
            onCreated?.(created.id, name.trim())
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
          operatingHours: oh || undefined,
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

  function commitPending(localId: string, name: string, price: string) {
    if (!name.trim()) {
      setPendingMenus((prev) => prev.filter((m) => m.localId !== localId))
      return
    }
    createMenu(
      {
        name: name.trim(),
        price: Number(price.replace(/[^0-9]/g, '')) || 0,
        description: null,
        imageUrl: null,
        isSoldOut: false,
        sortOrder: menus.length,
      },
      {
        onSuccess: () =>
          setPendingMenus((prev) => prev.filter((m) => m.localId !== localId)),
      }
    )
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-bg p-6">
      <div className="mx-auto w-full max-w-xl">
        {/* 업체 정보 */}
        <div className="mb-5 rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[15px] font-extrabold text-ink">업체 정보</div>
            <div className="flex items-center gap-2">
              {!isNew && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1 text-[12px] font-bold text-alert"
                >
                  <div className="size-3.5">{I.trash(FESTIV_TOKENS.alert)}</div>
                  삭제
                </button>
              )}
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
                {saved
                  ? '저장됨'
                  : isSaving
                    ? '저장 중...'
                    : isNew
                      ? '업체 추가'
                      : '저장'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* 업체 이름 */}
            <div>
              <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                업체 이름
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="업체 이름"
                className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[14px] font-bold text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>

            {/* 운영 날짜 */}
            {festivalDays.length > 0 && (
              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                  운영 날짜{' '}
                  <span className="font-normal text-ink-40">(중복 선택)</span>
                </div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(festivalDays.length, 3)}, 1fr)`,
                  }}
                >
                  {festivalDays.map((_, i) => {
                    const day = i + 1
                    const on = selectedDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={cn(
                          'rounded-xl border py-2.5 text-[13px] font-bold transition-colors',
                          on
                            ? 'border-cta bg-cta/10 text-cta'
                            : 'border-border bg-bg text-ink-60 hover:border-cta/40'
                        )}
                      >
                        {day}일차
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 운영 시간 */}
            <div>
              <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                운영 시간
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-cta focus:outline-none"
                />
                <span className="shrink-0 text-[13px] text-ink-40">~</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-cta focus:outline-none"
                />
              </div>
            </div>

            {/* 특이사항 */}
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
                {isNew ? draftMenus.length : menus.length + pendingMenus.length}
                개
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isNew) {
                  setDraftMenus((prev) => [
                    ...prev,
                    { localId: crypto.randomUUID(), name: '', price: '' },
                  ])
                } else {
                  setPendingMenus((prev) => [
                    ...prev,
                    { localId: crypto.randomUUID(), name: '', price: '' },
                  ])
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
                  <div className="text-[11px] font-bold text-ink-40">
                    메뉴명
                  </div>
                  <div className="w-28 text-[11px] font-bold text-ink-40">
                    가격
                  </div>
                  <div className="size-6" />
                </div>
                {draftMenus.map((m) => (
                  <div
                    key={m.localId}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-2"
                  >
                    <input
                      value={m.name}
                      onChange={(e) =>
                        setDraftMenus((prev) =>
                          prev.map((d) =>
                            d.localId === m.localId
                              ? { ...d, name: e.target.value }
                              : d
                          )
                        )
                      }
                      placeholder="메뉴명"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                    />
                    <input
                      value={m.price}
                      onChange={(e) =>
                        setDraftMenus((prev) =>
                          prev.map((d) =>
                            d.localId === m.localId
                              ? { ...d, price: e.target.value }
                              : d
                          )
                        )
                      }
                      placeholder="가격"
                      className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraftMenus((prev) =>
                          prev.filter((d) => d.localId !== m.localId)
                        )
                      }
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg text-ink-40 hover:text-alert"
                    >
                      <div className="size-3.5">
                        {I.trash(FESTIV_TOKENS.ink40)}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : menus.length === 0 && pendingMenus.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-ink-40">
              메뉴가 없어요. 위 버튼으로 추가하세요.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {(menus.length > 0 || pendingMenus.length > 0) && (
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-1">
                  <div className="text-[11px] font-bold text-ink-40">
                    메뉴명
                  </div>
                  <div className="w-28 text-[11px] font-bold text-ink-40">
                    가격
                  </div>
                  <div className="size-6" />
                </div>
              )}
              {menus.map((menu) => (
                <MenuRow
                  key={menu.id}
                  menu={menu}
                  onUpdate={(menuId, body) => updateMenu({ menuId, body })}
                  onDelete={(menuId) => deleteMenu(menuId)}
                />
              ))}
              {pendingMenus.map((m) => (
                <div
                  key={m.localId}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-2"
                >
                  <input
                    autoFocus
                    value={m.name}
                    onChange={(e) =>
                      setPendingMenus((prev) =>
                        prev.map((d) =>
                          d.localId === m.localId
                            ? { ...d, name: e.target.value }
                            : d
                        )
                      )
                    }
                    placeholder="메뉴명"
                    className="w-full rounded-xl border border-cta/50 bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                  />
                  <input
                    value={m.price}
                    onChange={(e) =>
                      setPendingMenus((prev) =>
                        prev.map((d) =>
                          d.localId === m.localId
                            ? { ...d, price: e.target.value }
                            : d
                        )
                      )
                    }
                    placeholder="가격"
                    className="w-28 rounded-xl border border-border bg-bg px-3 py-2 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => commitPending(m.localId, m.name, m.price)}
                      disabled={!m.name.trim()}
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-cta text-white disabled:opacity-30"
                    >
                      <div className="size-3">{I.check('#fff')}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingMenus((prev) =>
                          prev.filter((d) => d.localId !== m.localId)
                        )
                      }
                      className="flex size-6 shrink-0 items-center justify-center rounded-lg text-ink-40 hover:text-alert"
                    >
                      <div className="size-3.5">
                        {I.trash(FESTIV_TOKENS.ink40)}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*/!* 미리보기 *!/*/}
        {/*<div className="mt-5 rounded-2xl border border-border bg-surface p-5">*/}
        {/*  <div className="mb-3 text-[13px] font-extrabold text-ink-60">*/}
        {/*    미리보기*/}
        {/*  </div>*/}
        {/*  {menus.length === 0 ? (*/}
        {/*    <div className="py-4 text-center text-[12px] text-ink-40">*/}
        {/*      메뉴가 없어요*/}
        {/*    </div>*/}
        {/*  ) : (*/}
        {/*    <div className="overflow-hidden rounded-xl border border-border">*/}
        {/*      <div className="grid grid-cols-[1fr_auto] border-b border-border bg-surface-alt px-4 py-2">*/}
        {/*        <div className="text-[11px] font-extrabold text-ink-60">메뉴명</div>*/}
        {/*        <div className="text-[11px] font-extrabold text-ink-60">가격</div>*/}
        {/*      </div>*/}
        {/*      {menus.map((m, i) => (*/}
        {/*        <div*/}
        {/*          key={m.id}*/}
        {/*          className={cn(*/}
        {/*            'grid grid-cols-[1fr_auto] items-center px-4 py-2.5',*/}
        {/*            i < menus.length - 1 ? 'border-b border-border' : ''*/}
        {/*          )}*/}
        {/*        >*/}
        {/*          <div className="text-[13px] font-semibold text-ink">{m.name || '—'}</div>*/}
        {/*          <div className="text-[13px] text-ink-60">*/}
        {/*            {m.price > 0 ? `${m.price.toLocaleString()}원` : '—'}*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
      {saved && <AdminToast message="저장되었습니다" />}
    </main>
  )
}

// ── AdminFoodTrucks ───────────────────────────────────────────────────────────

export function AdminFoodTrucks() {
  const { data: booths = [], isLoading } = useBooths({ type: 'FOOD_TRUCK' })
  const { mutate: deleteBooth } = useDeleteFoodTruck()
  const [selectedId, setSelectedId] = useState<string>('')
  const effectiveId = selectedId || booths[0]?.id || ''
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  if (isLoading) {
    return (
      <AdminShell active="trucks">
        <AdminTopBar title="푸드트럭" sub="불러오는 중..." />
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
          <AdminBtn
            primary
            icon={I.plus('#fff')}
            onClick={() => setSelectedId('new')}
          >
            업체 추가
          </AdminBtn>
        }
      />

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
                <div className="truncate text-[13px] font-bold text-cta">
                  새 업체
                </div>
              </div>
            )}
            {booths.map((booth) => (
              <button
                key={booth.id}
                type="button"
                onClick={() => setSelectedId(booth.id)}
                className={cn(
                  'flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-colors',
                  effectiveId === booth.id
                    ? 'bg-cta/10'
                    : 'hover:bg-surface-alt'
                )}
              >
                <div
                  className={cn(
                    'truncate text-[13px] font-bold',
                    effectiveId === booth.id ? 'text-cta' : 'text-ink'
                  )}
                >
                  {booth.name}
                </div>
              </button>
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

        {effectiveId && (
          <TruckEditor
            key={effectiveId}
            boothId={effectiveId}
            onCreated={(id, name) => {
              setSelectedId(id)
              showToast(`${name} 업체가 추가되었습니다`)
            }}
            onDelete={
              effectiveId !== 'new'
                ? () => {
                    const booth = booths.find((b) => b.id === effectiveId)
                    if (booth)
                      setDeleteTarget({ id: booth.id, name: booth.name })
                  }
                : undefined
            }
          />
        )}
      </div>
      <AdminModal
        open={!!deleteTarget}
        variant="warning"
        title={`"${deleteTarget?.name}" 업체를 삭제할까요?`}
        body="삭제된 업체는 복구할 수 없어요."
        confirmLabel="삭제"
        onConfirm={() => {
          if (!deleteTarget) return
          deleteBooth(deleteTarget.id, {
            onSuccess: () => {
              if (effectiveId === deleteTarget.id) setSelectedId('')
              showToast(`"${deleteTarget.name}" 업체가 삭제되었습니다`)
              setDeleteTarget(null)
            },
          })
        }}
        onClose={() => setDeleteTarget(null)}
      />
      {toast && <AdminToast message={toast} />}
    </AdminShell>
  )
}
