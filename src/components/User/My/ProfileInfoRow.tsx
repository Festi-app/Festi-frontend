export function ProfileInfoRow({
  label,
  value,
  editable = false,
  editing = false,
  inputValue,
  inputType = 'text',
  onChange,
  onEdit,
  onSave,
  saveDisabled,
}: {
  label: string
  value: string
  editable?: boolean
  editing?: boolean
  inputValue?: string
  inputType?: 'text' | 'tel' | 'email'
  onChange?: (v: string) => void
  onEdit?: () => void
  onSave?: () => void
  saveDisabled?: boolean
}) {
  return (
    <div className="flex h-14 items-center gap-3 px-4">
      <div className="w-18 shrink-0 text-[13px] font-semibold text-ink-60">
        {label}
      </div>
      {editing && editable ? (
        <input
          type={inputType}
          value={inputValue}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave?.()}
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-[16px] font-bold tracking-[-0.3px] text-ink outline-none"
        />
      ) : (
        <div
          className={`min-w-0 flex-1 text-[15px] font-bold tracking-[-0.3px] ${editable ? 'text-ink' : 'text-ink-60'}`}
        >
          {value}
        </div>
      )}
      {editable &&
        (editing ? (
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className="shrink-0 rounded-full border border-transparent bg-cta px-3 py-1.5 text-[12px] font-extrabold text-cta-ink disabled:opacity-40"
          >
            저장
          </button>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-[12px] font-bold text-ink-80"
          >
            수정
          </button>
        ))}
    </div>
  )
}
