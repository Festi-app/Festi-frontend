import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useSubmitBoothApplication } from '../../features/BoothApplication/hooks/useSubmitBoothApplication'
import type { BoothType } from '../../types/common'
import { FestivMark, FestivWordmark } from '../../components/Logo'
import { FESTIV_TOKENS } from '../../tokens'
import { useUI } from '../../stores/useUIStore'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div className="mb-1.5 text-[12px] font-bold text-ink-60">
      {children}
      {required && <span className="ml-0.5 text-alert">*</span>}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
    />
  )
}

const BOOTH_TYPE_OPTIONS: { value: BoothType; label: string; desc: string }[] =
  [
    { value: 'DAY', label: '주간 부스', desc: '낮 시간대 운영하는 일반 부스' },
    { value: 'NIGHT', label: '야간 부스', desc: '야간 운영 주점 부스' },
  ]

const STEPS = ['부스 정보', '상세 내용', '계정 정보']

export function BoothAdminRegister() {
  const { dark } = useUI()
  const navigate = useNavigate()
  const { mutate: submitApplication, isPending: isSubmitting } =
    useSubmitBoothApplication()

  const [step, setStep] = useState(1)

  // Step 1 — 부스 기본 정보
  const [boothType, setBoothType] = useState<BoothType>('DAY')
  const [name, setName] = useState('')

  // Step 2 — 상세 내용
  const [description, setDescription] = useState('')

  // Step 3 — 계정 정보
  const [userId, setUserId] = useState('')
  const [repName, setRepName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isLoading = isSubmitting

  function canAdvance() {
    if (step === 1) return name.trim().length > 0
    if (step === 2) return true
    return false
  }

  function handleSubmit() {
    if (
      !userId.trim() ||
      !repName.trim() ||
      !phone.trim() ||
      !password ||
      password !== passwordConfirm
    )
      return

    setSubmitError(null)

    submitApplication(
      {
        id: userId.trim(),
        password,
        name: repName.trim(),
        phone: phone.trim(),
        boothName: name.trim(),
        boothType,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => navigate(`${ROUTES.BOOTH_ADMIN.LOGIN}?registered=1`),
        onError: () =>
          setSubmitError('신청 중 오류가 발생했어요. 다시 시도해주세요.'),
      }
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-start justify-center bg-bg px-4 py-8 font-festi md:min-h-screen md:items-center md:py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className="flex size-8 items-center justify-center rounded-[10px]"
              style={{ background: FESTIV_TOKENS.coral }}
            >
              <FestivMark color="#fff" size={18} />
            </div>
            <FestivWordmark
              size={18}
              color={dark ? '#F2F5F7' : FESTIV_TOKENS.ink}
            />
            <span className="text-[12px] text-ink-40">·</span>
            <span className="text-[12px] font-medium text-ink-40">
              축제를 더 즐겁게
            </span>
          </div>
          <div className="text-[26px] font-extrabold tracking-tight text-ink">
            부스 신청
          </div>
          <div className="mt-1 text-[13px] text-ink-60">
            부스 정보를 입력해주세요
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex w-full items-center">
          {STEPS.map((label, i) => {
            const s = i + 1
            return (
              <>
                {i > 0 && (
                  <div
                    key={`line-${i}`}
                    className={cn(
                      'mb-4 h-px flex-1 transition-colors',
                      step > i ? 'bg-pop' : 'bg-border'
                    )}
                  />
                )}
                <div key={s} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full text-[12px] font-extrabold transition-colors',
                      step > s
                        ? 'bg-pop text-white'
                        : step === s
                          ? 'bg-cta text-white'
                          : 'bg-surface-alt text-ink-40'
                    )}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <div
                    className={cn(
                      'whitespace-nowrap text-[10px] font-bold',
                      step >= s ? 'text-ink-60' : 'text-ink-40'
                    )}
                  >
                    {label}
                  </div>
                </div>
              </>
            )
          })}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_4px_24px_rgba(20,26,31,0.06)]">
          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel required>부스 유형</FieldLabel>
                <div className="flex flex-col gap-2">
                  {BOOTH_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBoothType(opt.value)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-left transition-all',
                        boothType === opt.value
                          ? 'border-cta bg-cta/10'
                          : 'border-border bg-bg'
                      )}
                    >
                      <div
                        className={cn(
                          'text-[13px] font-bold',
                          boothType === opt.value ? 'text-cta' : 'text-ink'
                        )}
                      >
                        {opt.label}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-40">
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel required>부스명</FieldLabel>
                <TextInput
                  value={name}
                  onChange={setName}
                  placeholder="부스 이름을 입력하세요"
                />
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>부스 소개</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="부스를 간단히 소개해주세요"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel required>아이디</FieldLabel>
                <TextInput
                  value={userId}
                  onChange={setUserId}
                  placeholder="로그인에 사용할 아이디"
                />
              </div>
              <div>
                <FieldLabel required>대표자 이름</FieldLabel>
                <TextInput
                  value={repName}
                  onChange={setRepName}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <FieldLabel required>전화번호</FieldLabel>
                <TextInput
                  value={phone}
                  onChange={setPhone}
                  placeholder="010-0000-0000"
                  type="tel"
                />
              </div>
              <div>
                <FieldLabel required>비밀번호</FieldLabel>
                <TextInput
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="비밀번호"
                />
              </div>
              <div>
                <FieldLabel required>비밀번호 확인</FieldLabel>
                <TextInput
                  type="password"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                />
                {passwordConfirm && password !== passwordConfirm && (
                  <div className="mt-1.5 text-[11px] text-alert">
                    비밀번호가 일치하지 않아요
                  </div>
                )}
              </div>

              {submitError && (
                <div className="rounded-xl bg-alert/10 px-4 py-3 text-[12px] font-semibold text-alert">
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-4 flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-surface py-3 text-[14px] font-bold text-ink-60 disabled:opacity-40"
            >
              이전
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 rounded-xl bg-cta py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !userId.trim() ||
                !repName.trim() ||
                !phone.trim() ||
                !password ||
                password !== passwordConfirm ||
                isLoading
              }
              className="flex-1 rounded-xl bg-cta py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
            >
              {isLoading ? '신청 중...' : '회원가입 신청'}
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-[12px] text-ink-60">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/booth-admin/login"
            className="font-bold text-cta no-underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
