import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useBoothAdminStore } from '../../stores/useBoothAdminStore'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function BoothAdminLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const login = useBoothAdminStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleLogin() {
    const ok = login(username, password)
    if (ok) {
      navigate('/booth-admin')
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-bg px-4 py-8 font-festi md:min-h-screen">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-1 text-[24px] font-extrabold tracking-tight text-ink">
            부스 관리자 로그인
          </div>
          <div className="text-[13px] text-ink-60">
            아이디와 비밀번호로 로그인하세요
          </div>
        </div>

        {justRegistered && (
          <div className="mb-4 rounded-xl border border-pop/40 bg-pop/10 px-4 py-3 text-[13px] font-semibold text-pop">
            회원가입 신청 완료! 관리자 승인 후 로그인할 수 있어요.
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_4px_24px_rgba(20,26,31,0.06)]">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                아이디
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(false)
                }}
                placeholder="아이디를 입력하세요"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>
            <div>
              <div className="mb-1.5 text-[12px] font-bold text-ink-60">
                비밀번호
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                placeholder="비밀번호를 입력하세요"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-alert/10 px-3 py-2 text-[12px] font-semibold text-alert">
                아이디 또는 비밀번호가 올바르지 않아요
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={!username.trim() || !password}
              className={cn(
                'rounded-xl py-3 text-[14px] font-extrabold text-white transition-opacity',
                'bg-cta disabled:opacity-40'
              )}
            >
              로그인
            </button>
          </div>

          <div className="mt-4 text-center text-[11px] text-ink-40">
            데모 계정: 아이디 <strong className="text-ink-60">comphub</strong> /
            비밀번호 <strong className="text-ink-60">1234</strong>
          </div>
        </div>

        <div className="mt-4 text-center text-[12px] text-ink-60">
          계정이 없으신가요?{' '}
          <Link
            to="/booth-admin/register"
            className="font-bold text-cta no-underline"
          >
            회원가입 신청
          </Link>
        </div>
      </div>
    </div>
  )
}
