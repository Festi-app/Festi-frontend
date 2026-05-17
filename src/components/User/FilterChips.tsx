export function FilterChips({
  options,
  active,
  onChange,
}: {
  options: string[]
  active: string
  onChange: (option: string) => void
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {options.map((chip) => (
        <button
          type="button"
          key={chip}
          onClick={() => onChange(chip)}
          className={`whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-bold tracking-[-0.2px] ${
            chip === active
              ? 'border-cta bg-cta text-cta-ink'
              : 'border-border bg-surface text-ink-80'
          }`}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
