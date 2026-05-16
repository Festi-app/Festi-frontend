import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTI_TOKENS, I } from '../../tokens'
import { FestHeaderLogo } from '../../components/FestLogo'

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  error,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  maxLength?: number
  error?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="mb-4">
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

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <div className="mb-4">
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

export function MobileOnboarding({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const wordmarkColor = dark ? '#F2F5F7' : FESTI_TOKENS.ink

  const errors = {
    name: submitted && name.trim().length === 0 ? '이름을 입력해주세요' : '',
    email:
      submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? '이메일 형식을 확인해주세요'
        : '',
    password:
      submitted && password.length < 6 ? '비밀번호는 6자 이상이어야 해요' : '',
    passwordConfirm:
      submitted && passwordConfirm !== password
        ? '비밀번호가 일치하지 않아요'
        : '',
    phone:
      submitted && phone.replace(/-/g, '').length < 10
        ? '전화번호를 정확히 입력해주세요'
        : '',
  }

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const isValid =
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 6 &&
    passwordConfirm === password &&
    phone.replace(/-/g, '').length >= 10

  function handleSubmit() {
    setSubmitted(true)
    if (!isValid) return
    setShowToast(true)
    setTimeout(() => navigate('/home'), 1800)
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden font-festi"
      style={{ background: dark ? '#0F1216' : '#F2F3F4' }}
    >
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-36 pt-14">
        {/* 로고 + 타이틀 */}
        <div className="mb-8 mt-6">
          <FestHeaderLogo size={26} />
          <div className="mt-4 text-[26px] font-extrabold leading-tight tracking-[-0.6px] text-ink">
            축제를 더 즐겁게,
            <br />
            <FestHeaderLogo size={26} color={wordmarkColor} />
            <span>와 함께해요</span>
          </div>
          <div className="mt-2 text-[14px] text-ink-60">
            간단한 정보를 입력하고 시작해보세요
          </div>
        </div>

        {/* 폼 */}
        <div
          className="rounded-[20px] border border-border p-5 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]"
          style={{ background: dark ? '#1A1E23' : '#FFFFFF' }}
        >
          <InputField
            label="이름"
            placeholder="실명을 입력하세요"
            value={name}
            onChange={setName}
            error={errors.name}
          />
          <InputField
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />
          <PasswordField
            label="비밀번호"
            placeholder="6자 이상 입력하세요"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
          <PasswordField
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={errors.passwordConfirm}
          />
          <InputField
            label="전화번호"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(v) => setPhone(formatPhone(v))}
            error={errors.phone}
          />
        </div>

        {/* 약관 동의 안내 */}
        <div className="mt-4 px-1 text-center text-[12px] leading-relaxed text-ink-40">
          가입 시{' '}
          <span className="font-semibold text-ink-60">서비스 이용약관</span> 및{' '}
          <span className="font-semibold text-ink-60">개인정보 처리방침</span>에
          <br />
          동의하는 것으로 간주됩니다.
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        className="absolute inset-x-0 bottom-0 border-t border-border px-5 pb-10 pt-3"
        style={{ background: dark ? '#0F1216' : '#F2F3F4' }}
      >
        <button
          type="button"
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] py-4 text-[16px] font-extrabold tracking-[-0.3px] active:opacity-80"
          style={{
            background: isValid
              ? FESTI_TOKENS.coral
              : dark
                ? '#252A30'
                : '#D3DBDE',
            color: isValid ? '#fff' : dark ? '#5E676D' : '#8C949A',
            boxShadow: isValid ? '0 8px 22px rgba(0,198,224,0.35)' : undefined,
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          {isValid && <div className="size-5 opacity-80">{I.check()}</div>}
          가입하기
        </button>
      </div>

      {/* 완료 토스트 */}
      {showToast && (
        <div
          className="absolute inset-x-0 bottom-32 z-50 flex justify-center px-5"
          style={{
            animation:
              'festi-toast-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
          }}
        >
          <div className="flex items-center gap-2.5 rounded-2xl bg-[#141A1F] px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            <div
              className="flex size-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: FESTI_TOKENS.pop }}
            >
              <div className="size-3.5 text-white">{I.check()}</div>
            </div>
            <span className="text-[14px] font-bold tracking-[-0.2px] text-white">
              회원가입이 완료되었어요!
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes festi-toast-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
