import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { AppHeader } from '../../components/User/ScreenHeader'
import { FilterChips } from '../../components/User/FilterChips'
import { ProfileInfoRow } from '../../components/User/ProfileInfoRow'
import { StatGrid } from '../../components/User/StatGrid'
import { Toast } from '../../components/shared/Toast'

const FAVORITES = [
  {
    id: 16,
    name: '컴공과 칵테일 바',
    category: '야간',
    area: '베어드홀 동측',
    wait: 7,
    eta: '22분',
    open: true,
    tone: 'rose',
    tagColor: FESTIV_TOKENS.alertSoft,
    tagInk: FESTIV_TOKENS.alert,
  },
  {
    id: 38,
    name: '체대 곱창집',
    category: '야간',
    area: '진리관 앞',
    wait: 3,
    eta: '12분',
    open: true,
    tone: 'mint',
    tagColor: FESTIV_TOKENS.alertSoft,
    tagInk: FESTIV_TOKENS.alert,
  },
  {
    id: 47,
    name: '미디어부 라멘',
    category: '주간',
    area: '학생회관 옆',
    wait: 5,
    eta: '18분',
    open: true,
    tone: 'sun',
    tagColor: FESTIV_TOKENS.popSoft,
    tagInk: FESTIV_TOKENS.pop,
  },
  {
    id: 64,
    name: '도쿄 타코야끼',
    category: '푸드트럭',
    area: '한경직 #64',
    wait: 2,
    eta: '8분',
    open: false,
    tone: 'coral',
    tagColor: FESTIV_TOKENS.sun,
    tagInk: '#fff',
  },
]

export function MobileMy({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('전체')
  const [savedIds, setSavedIds] = useState(
    () => new Set(FAVORITES.map((b) => b.id))
  )
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [name, setName] = useState('홍길동')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(name)
  const [phone, setPhone] = useState('010-2354-8821')
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState(phone)
  const email = 'hong@example.com'
  const muted = dark ? '#8B939B' : '#5E676D'

  function formatPhone(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }

  function saveName() {
    setName(nameInput)
    setEditingName(false)
  }

  function savePhone() {
    setPhone(phoneInput)
    setEditingPhone(false)
  }

  function closeProfile() {
    setProfileOpen(false)
    setEditingName(false)
    setEditingPhone(false)
  }

  function toggleSave(id: number) {
    const next = new Set(savedIds)
    const nowSaved = next.has(id)
      ? (next.delete(id), false)
      : (next.add(id), true)
    setSavedIds(next)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(nowSaved ? 'saved' : 'unsaved')
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  const filteredFavorites = useMemo(
    () =>
      FAVORITES.filter((booth) => {
        if (filter === '운영중') return booth.open
        if (filter === '푸드트럭') return booth.category === '푸드트럭'
        return true
      }),
    [filter]
  )

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <div className="shrink-0 border-b border-border bg-surface px-5 pt-13.5 pb-5">
        <AppHeader dark={dark} className="mt-2 mb-5.5" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink-80">
              <div className="size-5">{I.user()}</div>
            </div>
            <div>
              <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
                {name}
              </div>
              <div className="mt-0.5 text-[13px] text-ink-60">{phone}</div>
              <div className="mt-0.5 text-[11px] text-ink-40">{email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-[12px] font-bold text-ink-80"
          >
            수정
          </button>
        </div>

        <StatGrid
          className="mt-5"
          stats={[
            { label: '저장', value: `${savedIds.size}` },
            {
              label: '운영중',
              value: `${FAVORITES.filter((b) => b.open && savedIds.has(b.id)).length}`,
            },
            { label: '최단 대기', value: '2팀' },
          ]}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-32">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
              저장한 부스
            </div>
            <div className="mt-0.5 text-xs text-ink-60">
              웨이팅 상황을 빠르게 확인하세요
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSpinning(true)}
            onAnimationEnd={() => setSpinning(false)}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-surface-alt p-1.5 text-ink-60"
            style={
              spinning
                ? { animation: 'festi-spin-once 0.5s ease both' }
                : undefined
            }
          >
            {I.refresh()}
          </button>
        </div>

        <div className="mb-3">
          <FilterChips
            options={['전체', '운영중', '푸드트럭']}
            active={filter}
            onChange={setFilter}
          />
        </div>

        <div className="flex flex-col gap-3">
          {filteredFavorites.map((booth) => {
            const isSaved = savedIds.has(booth.id)
            return (
              <div
                key={booth.id}
                onClick={() => navigate('/booth')}
                className={`w-full cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface text-left transition-transform duration-100 active:scale-[0.98] ${
                  booth.open ? 'opacity-100' : 'opacity-65'
                }`}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                    <PhotoSlot label="" tone={booth.tone} radius={16} />
                    <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.82)] px-2 py-0.75 text-[10px] font-extrabold text-white">
                      #{booth.id}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Pill color={booth.tagColor} ink={booth.tagInk}>
                        {booth.category}
                      </Pill>
                      <Pill
                        color="transparent"
                        ink={muted}
                        style={{ padding: 0 }}
                      >
                        {booth.area}
                      </Pill>
                    </div>

                    <div className="mt-1.5 flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                          {booth.name}
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-ink-60">
                          {booth.open ? '운영중' : '준비중'}
                          {booth.category !== '푸드트럭' &&
                            ` · 예상 ${booth.eta}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(booth.id)
                        }}
                        className="size-4.5 shrink-0 text-alert"
                      >
                        {I.star(
                          isSaved ? FESTIV_TOKENS.alert : undefined,
                          isSaved ? FESTIV_TOKENS.alert : 'none'
                        )}
                      </button>
                    </div>

                    {booth.category !== '푸드트럭' && (
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-alt px-3 py-2">
                        <div className="text-[11px] font-semibold text-ink-60">
                          현재 대기
                        </div>
                        <div
                          className={`text-[13px] font-extrabold ${
                            booth.wait <= 2 ? 'text-pop' : 'text-alert'
                          }`}
                        >
                          {booth.wait === 0 ? '바로 입장' : `${booth.wait}팀`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <FestiTabBar active="me" dark={dark} />

      {toast && (
        <Toast
          bottom="bottom-24"
          message={
            toast === 'saved' ? '저장되었습니다' : '저장이 취소되었습니다'
          }
          icon={
            toast === 'saved' ? (
              <div className="flex size-8 items-center justify-center rounded-full bg-alert">
                {I.star('#fff', '#fff')}
              </div>
            ) : (
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
            )
          }
        />
      )}

      {/* Profile bottom sheet */}
      {profileOpen && (
        <>
          <div
            className="absolute inset-0 z-30 bg-[rgba(0,0,0,0.45)]"
            style={{ animation: 'festi-fade-in 0.2s ease both' }}
            onClick={closeProfile}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-40 rounded-t-[28px] bg-surface px-5 pt-4 pb-10 font-festi shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
            style={{
              animation:
                'festi-sheet-up 0.28s cubic-bezier(0.32,0.72,0,1) both',
            }}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

            <div className="mb-5 flex items-center justify-between">
              <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
                회원 정보
              </div>
              <button
                type="button"
                onClick={closeProfile}
                className="flex size-8 items-center justify-center rounded-full bg-surface-alt text-ink-60"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-border bg-bg">
              <ProfileInfoRow
                label="이름"
                value={name}
                editable
                editing={editingName}
                inputValue={nameInput}
                onChange={setNameInput}
                onEdit={() => {
                  setNameInput(name)
                  setEditingName(true)
                }}
                onSave={saveName}
              />
              <div className="mx-4 h-px bg-border" />
              <ProfileInfoRow
                label="전화번호"
                value={phone}
                editable
                editing={editingPhone}
                inputValue={phoneInput}
                inputType="tel"
                onChange={(v) => setPhoneInput(formatPhone(v))}
                onEdit={() => {
                  setPhoneInput(phone)
                  setEditingPhone(true)
                }}
                onSave={savePhone}
                saveDisabled={phoneInput.replace(/\D/g, '').length !== 11}
              />
              <div className="mx-4 h-px bg-border" />
              <ProfileInfoRow label="이메일" value={email} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
