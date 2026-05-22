import { useState } from 'react'

export function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  error,
  className,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  maxLength?: number
  error?: string
  className?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`mb-4 ${className ?? ''}`}>
      <div className="mb-1.5 text-[13px] font-bold tracking-[-0.2px] text-ink-80">
        {label}
      </div>
      <div
        className={`flex items-center gap-2 rounded-[14px] border px-4 py-3.5 transition-colors ${
          focused
            ? 'border-[#00C6E0] bg-surface shadow-[0_0_0_3px_rgba(0,198,224,0.12)]'
            : error
              ? 'border-alert bg-surface'
              : 'border-border bg-surface-alt'
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1 bg-transparent text-[15px] font-medium tracking-[-0.2px] text-ink outline-none placeholder:text-ink-40"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="size-4.5 shrink-0 text-ink-40"
          >
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      {error && (
        <div className="mt-1.5 text-[12px] font-medium text-alert">{error}</div>
      )}
    </div>
  )
}
