import { useState } from 'react'
import { FESTI_TOKENS, I } from '../../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  name: string
  price: string
}

interface FoodTruck {
  id: string
  name: string
  note: string
  menus: MenuItem[]
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const SEED: FoodTruck[] = [
  {
    id: '1',
    name: '골드',
    note: '',
    menus: [{ id: 'm1', name: '소프트아이스크림컵·콘', price: '4,500' }],
  },
  {
    id: '2',
    name: '캡틴',
    note: '',
    menus: [
      { id: 'm2', name: '타코야끼', price: '6,000' },
      { id: 'm3', name: '회오리감자', price: '5,000' },
    ],
  },
  {
    id: '3',
    name: '안녕',
    note: '',
    menus: [
      { id: 'm4', name: '떡볶이', price: '5,000' },
      { id: 'm5', name: '순대', price: '5,000' },
      { id: 'm6', name: '어묵4p', price: '5,000' },
      { id: 'm7', name: '어묵2p', price: '3,000' },
    ],
  },
  {
    id: '4',
    name: '일광',
    note: '',
    menus: [
      { id: 'm8', name: '칠리/크림 새우', price: '10,000' },
      { id: 'm9', name: '반반새우', price: '15,000' },
    ],
  },
  {
    id: '5',
    name: '가마솥',
    note: '',
    menus: [
      { id: 'm10', name: '닭강정', price: '소 10,000 / 중 15,000 / 대 18,000' },
    ],
  },
  {
    id: '6',
    name: '아라',
    note: '',
    menus: [{ id: 'm11', name: '닭꼬치', price: '5,000' }],
  },
  {
    id: '7',
    name: '청춘',
    note: '',
    menus: [
      { id: 'm12', name: '야끼소바', price: '10,000' },
      { id: 'm13', name: '오꼬노미야끼', price: '10,000' },
      { id: 'm14', name: '소바빵', price: '6,000' },
    ],
  },
  {
    id: '8',
    name: '부엉이푸드',
    note: '',
    menus: [{ id: 'm15', name: '불초밥/새우초밥', price: '12,000' }],
  },
  {
    id: '9',
    name: '달리는푸드',
    note: '14, 15일 운영',
    menus: [
      { id: 'm16', name: '츄러스', price: '4,000' },
      { id: 'm17', name: '젤라또', price: '4,500' },
      { id: 'm18', name: '아츄', price: '6,000' },
    ],
  },
  {
    id: '10',
    name: '에페스케밥',
    note: '',
    menus: [
      { id: 'm19', name: '케밥 (닭고기/양고기/믹스)', price: '8,000~10,000' },
      {
        id: 'm20',
        name: '박스 케밥 (닭고기/양고기/믹스)',
        price: '13,000~15,000',
      },
      { id: 'm21', name: '터키 아이스크림', price: '5,000~6,000' },
    ],
  },
]

function uid() {
  return Math.random().toString(36).slice(2)
}

// ── AdminFoodTrucks ───────────────────────────────────────────────────────────

export function AdminFoodTrucks() {
  const [trucks, setTrucks] = useState<FoodTruck[]>(SEED)
  const [selectedId, setSelectedId] = useState<string>(SEED[0].id)
  const [notice, setNotice] = useState('업체를 선택해 정보를 수정하세요')

  const selected = trucks.find((t) => t.id === selectedId)!

  function updateTruck(patch: Partial<Omit<FoodTruck, 'id'>>) {
    setTrucks((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, ...patch } : t))
    )
  }

  function addTruck() {
    const newId = uid()
    const newTruck: FoodTruck = {
      id: newId,
      name: '새 업체',
      note: '',
      menus: [],
    }
    setTrucks((prev) => [...prev, newTruck])
    setSelectedId(newId)
  }

  function deleteTruck(id: string) {
    setTrucks((prev) => prev.filter((t) => t.id !== id))
    if (selectedId === id)
      setSelectedId(trucks.find((t) => t.id !== id)?.id ?? '')
  }

  function addMenu() {
    updateTruck({
      menus: [...selected.menus, { id: uid(), name: '', price: '' }],
    })
  }

  function updateMenu(menuId: string, patch: Partial<MenuItem>) {
    updateTruck({
      menus: selected.menus.map((m) =>
        m.id === menuId ? { ...m, ...patch } : m
      ),
    })
  }

  function deleteMenu(menuId: string) {
    updateTruck({ menus: selected.menus.filter((m) => m.id !== menuId) })
  }

  function save() {
    setNotice(`${selected.name} 정보를 저장했어요`)
  }

  return (
    <AdminShell active="trucks">
      <AdminTopBar
        title="푸드트럭"
        sub={`총 ${trucks.length}개 업체 · ${notice}`}
        right={
          <AdminBtn primary icon={I.check('#fff')} onClick={save}>
            저장
          </AdminBtn>
        }
      />

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
                    {truck.note && ` · ${truck.note}`}
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
                  <div className="size-3.5">{I.trash(FESTI_TOKENS.alert)}</div>
                  삭제
                </button>
              </div>

              <div className="mb-3">
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                  업체 이름
                </div>
                <input
                  value={selected.name}
                  onChange={(e) => updateTruck({ name: e.target.value })}
                  placeholder="업체 이름"
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[14px] font-bold text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-bold text-ink-60">
                  운영 특이사항{' '}
                  <span className="font-normal text-ink-40">(선택)</span>
                </div>
                <input
                  value={selected.note}
                  onChange={(e) => updateTruck({ note: e.target.value })}
                  placeholder="예: 14, 15일만 운영"
                  className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
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
                        {selected.note && (
                          <div className="text-[10px] font-normal text-ink-40">
                            ({selected.note})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-b border-border border-l px-4 py-3 text-[13px] text-ink">
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
    </AdminShell>
  )
}
