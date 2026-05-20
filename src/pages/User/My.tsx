import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { FilterChips } from '../../components/User/FilterChips'
import { ProfileInfoRow } from '../../components/User/ProfileInfoRow'
import { Toast } from '../../components/shared/Toast'
import { useUserStore } from '../../stores/useUserStore'
import {
  useFavoritesStore,
  type BoothType,
} from '../../stores/useFavoritesStore'
import { NIGHT_BOOTHS, DAY_BOOTHS, TRUCK_BOOTHS } from '../../data/booths'
import { useUI } from '../../stores/useUIStore'
import { formatPhone } from '../../lib/format'

function resolveBooth(s: { boothId: number; boothType: BoothType }) {
  const { boothId, boothType } = s
  if (boothType === 'night') {
    const booth = NIGHT_BOOTHS.find((b) => b.id === boothId)
    if (booth) return { booth, category: '야간', type: 'night' as const }
  }
  if (boothType === 'day') {
    const booth = DAY_BOOTHS.find((b) => b.id === boothId)
    if (booth) return { booth, category: '주간', type: 'day' as const }
  }
  if (boothType === 'truck') {
    const booth = TRUCK_BOOTHS.find((b) => b.id === boothId)
    if (booth) return { booth, category: '푸드트럭', type: 'truck' as const }
  }
  return null
}

export function MobileMy({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('전체')
  const { savedBooths, isSaved, toggleSave } = useFavoritesStore()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { name, phone, userId, setName, setPhone } = useUserStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(name)
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState(phone)
  const muted = dark ? '#8B939B' : '#5E676D'
  const { dark: isDark, setDark } = useUI()

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    []
  )

  function formatDate(iso: string) {
    const d = new Date(iso)
    return `${d.getMonth() + 1}월 ${d.getDate()}일 저장됨`
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

  function handleToggleSave(
    boothType: 'night' | 'day' | 'truck',
    boothId: number
  ) {
    const nowSaved = !isSaved(boothType, boothId)
    toggleSave(boothType, boothId)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(nowSaved ? 'saved' : 'unsaved')
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  const filteredFavorites = useMemo(() => {
    return savedBooths
      .map((s) => {
        const resolved = resolveBooth(s)
        if (!resolved) return null
        return { ...resolved, createdAt: s.createdAt }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .filter((r) => {
        if (filter === '운영중') return r.booth.wait != null
        if (filter === '푸드트럭') return r.type === 'truck'
        return true
      })
  }, [filter, savedBooths])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg font-festi">
      <div className="shrink-0 border-b border-border bg-surface">
        {/* 프로필 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink-80">
              <div className="size-5">{I.user()}</div>
            </div>
            <div>
              <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
                {name}
              </div>
              <div className="mt-0.5 text-[13px] text-ink-60">{phone}</div>
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
        {/* 테마 설정 */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-4.5 text-ink-60">
              {isDark ? I.moon() : I.sun()}
            </div>
            <span className="text-[14px] font-semibold text-ink">
              {isDark ? '다크 모드' : '라이트 모드'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDark(!isDark)}
            className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 ${
              isDark ? 'bg-cta' : 'bg-[#C4CDD1]'
            }`}
          >
            <span
              className={`size-5 shrink-0 rounded-full bg-white shadow transition-transform duration-200 ${
                isDark ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-none px-5 pt-4 pb-32">
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
          {filteredFavorites.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-24 pb-16 text-center">
              <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-surface-alt text-ink-40">
                <div className="size-7">{I.star()}</div>
              </div>
              <div className="text-[15px] font-bold text-ink-60">
                저장된 부스가 없습니다
              </div>
              <div className="mt-1 text-[13px] text-ink-40">
                관심 있는 부스를 저장해 보세요
              </div>
            </div>
          )}
          {filteredFavorites.map(({ booth, category, type, createdAt }) => {
            const saved = isSaved(type, booth.id)

            const pillColor =
              type === 'night'
                ? FESTIV_TOKENS.alertSoft
                : type === 'truck'
                  ? FESTIV_TOKENS.sun
                  : FESTIV_TOKENS.popSoft
            const pillInk =
              type === 'night'
                ? FESTIV_TOKENS.alert
                : type === 'truck'
                  ? '#fff'
                  : FESTIV_TOKENS.pop
            return (
              <div
                key={`${type}-${booth.id}`}
                onClick={() => navigate(`/booth?type=${type}&id=${booth.id}`)}
                className="w-full cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface text-left transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="flex gap-3 p-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-2xl">
                    <PhotoSlot
                      label=""
                      tone={booth.tone}
                      radius={16}
                      ratio="1/1"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Pill color={pillColor} ink={pillInk}>
                        {category}
                      </Pill>
                      <Pill
                        color="transparent"
                        ink={muted}
                        style={{ padding: 0 }}
                      >
                        {booth.area}
                      </Pill>
                      <Pill
                        color="transparent"
                        ink={muted}
                        style={{ padding: 0 }}
                      >
                        #{booth.id}
                      </Pill>
                    </div>

                    <div className="mt-1.5 flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                          {booth.name}
                        </div>
                        <div className="mt-1 text-[11px] text-ink-40">
                          {formatDate(createdAt)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleSave(type, booth.id)
                        }}
                        className="size-4.5 shrink-0 text-alert"
                      >
                        {I.star(
                          saved ? FESTIV_TOKENS.alert : undefined,
                          saved ? FESTIV_TOKENS.alert : 'none'
                        )}
                      </button>
                    </div>
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
            className="absolute inset-0 z-55 bg-[rgba(0,0,0,0.45)]"
            style={{ animation: 'festi-fade-in 0.2s ease both' }}
            onClick={closeProfile}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-60 rounded-t-[28px] bg-surface px-5 pt-4 pb-10 font-festi shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
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
              <div className="mx-4 h-px bg-border" />
              <ProfileInfoRow label="아이디" value={userId} />
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
            </div>
          </div>
        </>
      )}
    </div>
  )
}
