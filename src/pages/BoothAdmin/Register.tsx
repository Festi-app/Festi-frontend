import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import {
  useBoothAdminStore,
  type OrgType,
  type OperatingTime,
  type BoothCategoryType,
} from '../../stores/useBoothAdminStore'
import { FESTIV_TOKENS } from '../../tokens'
import { FestivMark, FestivWordmark } from '../../components/Logo'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const CATEGORY_COLORS: Record<BoothCategoryType, string> = {
  정보: FESTIV_TOKENS.coral,
  체험: FESTIV_TOKENS.grape,
  마켓: FESTIV_TOKENS.sun,
  활동: FESTIV_TOKENS.pop,
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

const STEPS = ['기본 정보', '부스 정보', '대표자 정보']

export function BoothAdminRegister() {
  const navigate = useNavigate()
  const register = useBoothAdminStore((s) => s.register)
  const isUsernameTaken = useBoothAdminStore((s) => s.isUsernameTaken)
  const [step, setStep] = useState(1)

  // Step 1
  const [orgType, setOrgType] = useState<OrgType>('동아리/소모임')
  const [orgName, setOrgName] = useState('')
  const [times, setTimes] = useState<OperatingTime[]>([])

  // Step 2 – 주간
  const [dayBoothName, setDayBoothName] = useState('')
  const [dayBoothDesc, setDayBoothDesc] = useState('')
  const [dayCategory, setDayCategory] = useState<BoothCategoryType | ''>('')

  // Step 2 – 야간
  const [nightBoothName, setNightBoothName] = useState('')
  const [nightBoothDesc, setNightBoothDesc] = useState('')

  // Step 3
  const [username, setUsername] = useState('')
  const [usernameChecked, setUsernameChecked] = useState(false)
  const [usernameTaken, setUsernameTaken] = useState(false)
  const [repName, setRepName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  function handleUsernameBlur() {
    if (!username.trim()) return
    const taken = isUsernameTaken(username.trim())
    setUsernameTaken(taken)
    setUsernameChecked(true)
  }

  const hasDay = times.includes('주간')
  const hasNight = times.includes('야간')

  function toggleTime(t: OperatingTime) {
    setTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  function canAdvance() {
    if (step === 1) return orgName.trim().length > 0
    if (step === 2) {
      if (times.length === 0) return false
      if (hasDay && (!dayBoothName.trim() || !dayCategory)) return false
      if (hasNight && !nightBoothName.trim()) return false
      return true
    }
    return false
  }

  function handleSubmit() {
    if (
      !username.trim() ||
      usernameTaken ||
      !usernameChecked ||
      !repName.trim() ||
      !password ||
      password !== passwordConfirm
    )
      return
    register({
      username: username.trim(),
      password,
      representativeName: repName,
      orgType,
      orgName,
      operatingTimes: times,
      dayBoothName,
      dayBoothDesc,
      dayCategory,
      nightBoothName,
      nightBoothDesc,
    })
    navigate(`${ROUTES.BOOTH_ADMIN.LOGIN}?registered=1`)
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
            <FestivWordmark size={18} color={FESTIV_TOKENS.ink} />
            <span className="text-[12px] text-ink-40">·</span>
            <span className="text-[12px] font-medium text-ink-40">
              축제를 더 즐겁게
            </span>
          </div>
          <div className="text-[26px] font-extrabold tracking-tight text-ink">
            부스 관리자 회원가입
          </div>
          <div className="mt-1 text-[13px] text-ink-60">
            축제 부스를 운영할 단체 정보를 입력해주세요
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
                <FieldLabel required>단체 유형</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {(['동아리/소모임', '단과대/학과'] as OrgType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOrgType(t)}
                      className={cn(
                        'rounded-xl border py-3 text-[13px] font-bold transition-all',
                        orgType === t
                          ? 'border-cta bg-cta/10 text-cta'
                          : 'border-border bg-bg text-ink-60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel required>
                  {orgType === '동아리/소모임'
                    ? '동아리 / 소모임명'
                    : '학과 / 단과대명'}
                </FieldLabel>
                <TextInput
                  value={orgName}
                  onChange={setOrgName}
                  placeholder={
                    orgType === '동아리/소모임'
                      ? 'ex) 컴퓨터학부 코딩 동아리'
                      : 'ex) 컴퓨터학과'
                  }
                />
              </div>

              <div>
                <FieldLabel required>운영 시간 (중복 선택 가능)</FieldLabel>
                <div className="flex gap-2">
                  {(['주간', '야간'] as OperatingTime[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTime(t)}
                      className={cn(
                        'flex-1 rounded-xl border py-2.5 text-[13px] font-bold transition-all',
                        times.includes(t)
                          ? 'border-cta bg-cta/10 text-cta'
                          : 'border-border bg-bg text-ink-60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {times.length === 0 && (
                  <div className="mt-1.5 text-[11px] text-alert">
                    운영 시간을 하나 이상 선택하세요
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              {hasDay && (
                <div className="rounded-xl border border-border bg-surface-alt p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ background: FESTIV_TOKENS.coral }}
                    />
                    <div className="text-[13px] font-extrabold text-ink">
                      주간 부스 정보
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <FieldLabel required>부스명</FieldLabel>
                      <TextInput
                        value={dayBoothName}
                        onChange={setDayBoothName}
                        placeholder="부스 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <FieldLabel>간단 소개</FieldLabel>
                      <TextInput
                        value={dayBoothDesc}
                        onChange={setDayBoothDesc}
                        placeholder="부스를 한 줄로 소개해주세요"
                      />
                    </div>
                    <div>
                      <FieldLabel required>부스 카테고리</FieldLabel>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(
                          Object.keys(CATEGORY_COLORS) as BoothCategoryType[]
                        ).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setDayCategory(cat)}
                            className={cn(
                              'rounded-xl py-2 text-[12px] font-bold transition-all',
                              dayCategory === cat ? 'text-white' : 'text-ink-60'
                            )}
                            style={
                              dayCategory === cat
                                ? { background: CATEGORY_COLORS[cat] }
                                : { background: `${CATEGORY_COLORS[cat]}33` }
                            }
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasNight && (
                <div className="rounded-xl border border-border bg-surface-alt p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="size-2 rounded-full"
                      style={{ background: FESTIV_TOKENS.grape }}
                    />
                    <div className="text-[13px] font-extrabold text-ink">
                      야간 부스 정보 (주점)
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <FieldLabel required>부스명</FieldLabel>
                      <TextInput
                        value={nightBoothName}
                        onChange={setNightBoothName}
                        placeholder="주점 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <FieldLabel>간단 부스 소개</FieldLabel>
                      <TextInput
                        value={nightBoothDesc}
                        onChange={setNightBoothDesc}
                        placeholder="주점을 한 줄로 소개해주세요"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel required>아이디</FieldLabel>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setUsernameChecked(false)
                    setUsernameTaken(false)
                  }}
                  onBlur={handleUsernameBlur}
                  placeholder="로그인에 사용할 아이디"
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
                />
                {usernameChecked && username.trim() && (
                  <div
                    className={cn(
                      'mt-1.5 text-[11px] font-semibold',
                      usernameTaken ? 'text-alert' : 'text-pop'
                    )}
                  >
                    {usernameTaken
                      ? '이미 사용중인 아이디예요'
                      : '사용 가능한 아이디예요'}
                  </div>
                )}
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
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-4 flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-border bg-surface py-3 text-[14px] font-bold text-ink-60"
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
                !username.trim() ||
                !usernameChecked ||
                usernameTaken ||
                !repName.trim() ||
                !password ||
                password !== passwordConfirm
              }
              className="flex-1 rounded-xl bg-cta py-3 text-[14px] font-extrabold text-white disabled:opacity-40"
            >
              회원가입 신청
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
