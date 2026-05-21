import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I } from '../../tokens'
import { FestivMark, FestivWordmark } from '../../components/Logo'
import { Toast } from '../../components/shared/Toast'
import { useUserStore } from '../../stores/useUserStore'

export function MobileLogin({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const { userId: storedUserId, setUserId: storeSetUserId } = useUserStore()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)

  const wordmarkColor = dark ? '#F2F5F7' : FESTIV_TOKENS.ink
  const muted = dark ? '#8B939B' : '#5E676D'
  const isValid = userId.trim().length > 0 && password.length >= 1

  function handleLogin() {
    if (!isValid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (userId === storedUserId) {
        storeSetUserId(userId)
        navigate('/home', { replace: true })
      } else {
        setLoginFailed(true)
        setTimeout(() => setLoginFailed(false), 2000)
      }
    }, 600)
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-bg font-festi">
      {/* 상단 로고 */}
      <div className="flex flex-col items-center pt-20 pb-10">
        <div
          className="mb-4 flex size-16 items-center justify-center rounded-[22px] shadow-[0_8px_28px_rgba(0,198,224,0.3)]"
          style={{ background: FESTIV_TOKENS.coral }}
        >
          <FestivMark color="#fff" size={38} />
        </div>
        <FestivWordmark size={24} color={wordmarkColor} />
        <div
          className="mt-1.5 text-[13px] font-medium"
          style={{ color: muted }}
        >
          축제를 더 즐겁게
        </div>
      </div>

      {/* 입력 카드 */}
      <div className="mx-5 rounded-[24px] border border-border bg-surface p-5">
        <div className="mb-5">
          <div className="text-[20px] font-extrabold tracking-[-0.5px] text-ink">
            로그인
          </div>
          <div className="mt-1 text-[13px]" style={{ color: muted }}>
            아이디와 비밀번호를 입력해주세요.
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-[14px] border border-border bg-bg px-4 py-3.5">
            <div className="size-4.5 shrink-0 text-ink-40">{I.user()}</div>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력해주세요"
              className="flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-ink-40"
            />
          </div>
          <div className="flex items-center gap-2 rounded-[14px] border border-border bg-bg px-4 py-3.5">
            <div className="size-4.5 shrink-0 text-ink-40">{I.ticket()}</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-ink-40"
            />
          </div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={!isValid || loading}
            className="mt-1 w-full rounded-[14px] py-4 text-[15px] font-extrabold tracking-[-0.3px] transition-opacity disabled:opacity-40"
            style={{ background: FESTIV_TOKENS.coral, color: '#fff' }}
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
          <div
            className="mt-3 text-center text-[11px]"
            style={{ color: muted }}
          >
            테스트 성공: test
          </div>
        </div>
      </div>

      {/* 하단 회원가입 */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        <span className="text-[13px]" style={{ color: muted }}>
          아직 계정이 없으신가요?
        </span>
        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          className="text-[13px] font-bold"
          style={{ color: FESTIV_TOKENS.coral }}
        >
          회원가입
        </button>
      </div>

      {loginFailed && (
        <Toast
          bottom="bottom-12"
          message="아이디 또는 비밀번호가 올바르지 않습니다."
          icon={
            <div className="flex size-8 items-center justify-center rounded-full bg-alert/20">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="#FF6B6B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          }
        />
      )}
    </div>
  )
}
