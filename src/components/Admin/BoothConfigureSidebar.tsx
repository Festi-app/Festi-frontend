import { ZONES, NIGHT_ZONES } from '../../data/zones'
import { I } from '../../tokens'

export function BoothConfigureSidebar({
  zoneDivisions,
  setZoneDivisions,
  mapMode,
  onSave,
}: {
  zoneDivisions: Record<string, number>
  setZoneDivisions: (
    fn: (prev: Record<string, number>) => Record<string, number>
  ) => void
  mapMode: '주간' | '야간'
  onSave: () => void
}) {
  const zones = mapMode === '주간' ? ZONES : NIGHT_ZONES
  const total = zones.reduce((a, z) => a + zoneDivisions[z.id], 0)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="text-[15px] font-extrabold text-ink">구역 설정</div>
        <div className="mt-0.5 text-[11px] text-ink-60">
          구역별 세부 섹션 개수를 설정하세요
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {zones.map((zone) => {
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
                <span className="text-[11px] text-ink-40">구역 {zone.id}</span>
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
                  <input
                    type="text"
                    inputMode="numeric"
                    value={val}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10)
                      if (!isNaN(n) && n >= 1)
                        setZoneDivisions((prev) => ({ ...prev, [zone.id]: n }))
                      else if (e.target.value === '')
                        setZoneDivisions((prev) => ({ ...prev, [zone.id]: 0 }))
                    }}
                    className="w-9 rounded-lg border border-ink-20 bg-transparent text-center text-[13px] font-extrabold text-ink focus:border-cta focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoneDivisions((prev) => ({
                        ...prev,
                        [zone.id]: prev[zone.id] + 1,
                      }))
                    }
                    className="flex size-6 items-center justify-center rounded-lg border border-ink-20 text-base leading-none text-ink-60"
                  >
                    +
                  </button>
                </div>
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
