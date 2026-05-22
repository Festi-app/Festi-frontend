import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I } from '../../tokens'
import { FestivWordmark } from '../../components/Logo'
import { AppHeader } from '../../components/User/ScreenHeader'
import { InputField } from '../../components/shared/InputField'
import { PasswordField } from '../../components/shared/PasswordField'
import { formatPhone } from '../../lib/format'

export function MobileOnboarding({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const wordmarkColor = dark ? '#F2F5F7' : FESTIV_TOKENS.ink

  const errors = {
    email:
      submitted && userId.trim().length === 0 ? '아이디를 입력해주세요' : '',
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
    name: submitted && name.trim().length === 0 ? '이름을 입력해주세요' : '',
  }

  const isValid =
    userId.trim().length > 0 &&
    password.length >= 6 &&
    passwordConfirm === password &&
    phone.replace(/-/g, '').length >= 10 &&
    name.trim().length > 0

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
      <div className="shrink-0 px-5 pt-13.5">
        <AppHeader dark={dark} className="mt-2 mb-1" />
      </div>

      <div className="shrink-0 px-5 pt-3 pb-2">
        <div className="text-[12px] font-bold leading-tight tracking-[-0.5px] text-ink">
          축제를 더 즐겁게, <FestivWordmark size={12} color={wordmarkColor} />
          <span>와 함께해요.</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-4">
        <div
          className="rounded-[20px] border border-border p-4 shadow-[0_1px_2px_rgba(20,26,31,0.04),0_8px_24px_rgba(20,26,31,0.06)]"
          style={{ background: dark ? '#1A1E23' : '#FFFFFF' }}
        >
          <div className="mb-4">
            <div className="text-[20px] font-extrabold tracking-[-0.5px] text-ink">
              회원가입
            </div>
            <div className="mt-1 text-[13px] text-ink-60">
              정보를 입력하고 계정을 만들어주세요.
            </div>
          </div>
          <InputField
            label="아이디"
            type="text"
            placeholder="아이디를 입력해주세요"
            value={userId}
            onChange={setUserId}
            error={errors.email}
            className="mb-2.5"
          />
          <PasswordField
            label="비밀번호"
            placeholder="6자 이상 입력하세요."
            value={password}
            onChange={setPassword}
            error={errors.password}
            className="mb-2.5"
          />
          <PasswordField
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요."
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={errors.passwordConfirm}
            className="mb-2.5"
          />
          <InputField
            label="전화번호"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(v) => setPhone(formatPhone(v))}
            error={errors.phone}
            className="mb-2.5"
          />
          <InputField
            label="이름"
            placeholder="실명을 입력하세요."
            value={name}
            onChange={setName}
            error={errors.name}
            className="mb-0"
          />
        </div>

        <div className="mt-2.5 px-1 text-center text-[11px] leading-relaxed text-ink-40">
          가입 시{' '}
          <span className="font-semibold text-ink-60">서비스 이용약관</span> 및{' '}
          <span className="font-semibold text-ink-60">개인정보 처리방침</span>에
          동의하는 것으로 간주됩니다.
        </div>
      </div>

      <div
        className="shrink-0 px-5 pb-8 pt-3"
        style={{ background: dark ? '#0F1216' : '#F2F3F4' }}
      >
        <button
          type="button"
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] py-4 text-[16px] font-extrabold tracking-[-0.3px] active:opacity-80"
          style={{
            background: isValid
              ? FESTIV_TOKENS.coral
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
              style={{ background: FESTIV_TOKENS.pop }}
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
