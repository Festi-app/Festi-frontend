import { cn } from '../../../../lib/cn'
import type { BoothMapMode } from '../../../../stores/useBoothSectionStore'

export function ModeTabs({
  active,
  onChange,
}: {
  active: BoothMapMode
  onChange: (m: BoothMapMode) => void
}) {
  const modes: BoothMapMode[] = ['주간', '야간', '푸드트럭']
  return (
    <div className="flex gap-1 border-b border-border px-4 py-3">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            'flex-1 rounded-xl py-1.5 text-[12px] font-bold transition-colors',
            active === m ? 'bg-cta text-white' : 'bg-surface-alt text-ink-60'
          )}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
