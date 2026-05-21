import { useState } from 'react'

export function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
  className?: string
}) {
  const [show, setShow] = useState(false)
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
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] font-medium tracking-[-0.2px] text-ink outline-none placeholder:text-ink-40"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="size-4.5 shrink-0 text-ink-40"
        >
          {show ? (
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path
                d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path
                d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-1.5 text-[12px] font-medium text-alert">{error}</div>
      )}
    </div>
  )
}
