import { Switch } from '../shared/Switch'

export function NotificationSettings({
  rows,
  values,
  onChange,
}: {
  rows: { label: string; sub: string }[]
  values?: boolean[]
  onChange?: (index: number) => void
}) {
  return (
    <>
      {rows.map((row, i, arr) => (
        <div
          key={i}
          className={`flex items-center gap-2.5 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
        >
          <div className="flex-1">
            <div className="text-sm font-bold tracking-[-0.3px] text-ink">
              {row.label}
            </div>
            <div className="mt-0.5 text-[11px] text-ink-60">{row.sub}</div>
          </div>
          <Switch
            on={values ? values[i] : true}
            onClick={onChange ? () => onChange(i) : undefined}
          />
        </div>
      ))}
    </>
  )
}
