import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useLogin } from '../../features/Auth/hooks/useLogin'
import { FestivMark, FestivWordmark } from '../../components/Logo'
import { FESTIV_TOKENS } from '../../tokens'
import { useUI } from '../../stores/useUIStore'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function BoothAdminLogin() {
  const navigate = useNavigate()
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const { mutate: login, isPending } = useLogin()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleLogin() {
    if (!username.trim() || !password) return
    login(
      { id: username.trim(), password },
      {
        onSuccess: ({ accessToken }) => {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]))
            if (payload.role === 'FESTIVAL_ADMIN') {
              navigate(ROUTES.ADMIN.FESTIVAL)
              return
            }
          } catch {
            // ignore malformed token — fall through to booth admin
          }
          navigate(ROUTES.BOOTH_ADMIN.DASHBOARD)
        },
        onError: () => setError(true),
      }
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-bg px-4 py-8 font-festi md:min-h-screen">
      <div className="w-full max-w-sm">
        <div className="mb-8">
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
            축제 관리자 로그인
          </div>
          <div className="mt-1 text-[13px] text-ink-60">
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
              disabled={!username.trim() || !password || isPending}
              className={cn(
                'rounded-xl py-3 text-[14px] font-extrabold text-white transition-opacity',
                'bg-cta disabled:opacity-40'
              )}
            >
              {isPending ? '로그인 중...' : '로그인'}
            </button>
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
