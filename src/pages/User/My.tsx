import { useEffect, useMemo, useRef, useState } from 'react'
import { tabBarPb, tabBarOuterPb } from '../../lib/safeArea'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { FilterChips } from '../../components/User/My/FilterChips'
import { ProfileInfoRow } from '../../components/User/My/ProfileInfoRow'
import { EmptyState } from '../../components/User/EmptyState'
import { Toast } from '../../components/shared/Toast'
import { useUI } from '../../stores/useUIStore'
import { formatPhone } from '../../lib/format'
import { boothUrl } from '../../constants/routes'
import { useFavorites } from '../../features/Favorite/hooks/useFavorites'
import { useToggleFavorite } from '../../features/Favorite/hooks/useToggleFavorite'
import type { BoothType } from '../../features/Favorite/types/BoothSummaryDto'
import { useMe } from '../../features/User/hooks/useMe'
import { useUpdateMe } from '../../features/User/hooks/useUpdateMe'

const TYPE_LABEL: Record<BoothType, string> = {
  DAY: '주간',
  NIGHT: '야간',
  FOOD_TRUCK: '푸드트럭',
}
const TYPE_PARAM: Record<BoothType, 'day' | 'night' | 'truck'> = {
  DAY: 'day',
  NIGHT: 'night',
  FOOD_TRUCK: 'truck',
}

export function UserMy({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('전체')
  const { data: favorites = [] } = useFavorites()
  const { isSaved, toggle } = useToggleFavorite()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [profileOpen, setProfileOpen] = useState(false)
  const { data: me } = useMe()
  const updateMe = useUpdateMe()
  const name = me?.name ?? ''
  const phone = me?.phone ?? ''
  const userId = me?.id ?? ''
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const muted = dark ? '#8B939B' : '#5E676D'
  void muted
  const { dark: isDark, setDark } = useUI()

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    []
  )

  function formatDate(iso: string) {
    const d = new Date(iso)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${month}월 ${day}일 ${hh}:${mm} 저장`
  }

  function saveName() {
    updateMe.mutate(
      { name: nameInput },
      { onSuccess: () => setEditingName(false) }
    )
  }

  function savePhone() {
    updateMe.mutate(
      { phone: phoneInput },
      { onSuccess: () => setEditingPhone(false) }
    )
  }

  function closeProfile() {
    setProfileOpen(false)
    setEditingName(false)
    setEditingPhone(false)
  }

  function handleToggleSave(boothId: string) {
    const nowSaved = !isSaved(boothId)
    toggle(boothId)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(nowSaved ? 'saved' : 'unsaved')
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  const filteredFavorites = useMemo(() => {
    return favorites.filter((f) => {
      if (filter === '운영중') return f.boothSummary.isWaitingOpen
      if (filter === '푸드트럭') return f.boothSummary.type === 'FOOD_TRUCK'
      return true
    })
  }, [filter, favorites])

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDark(!isDark)}
              className="flex size-8 items-center justify-center rounded-full border border-border bg-surface-alt text-ink-60"
            >
              <div className="size-4">{isDark ? I.moon() : I.sun()}</div>
            </button>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-[12px] font-bold text-ink-80"
            >
              수정
            </button>
          </div>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-none px-5 pt-4"
        style={{ paddingBottom: tabBarPb }}
      >
        <div className="mb-3">
          <div className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
            저장한 부스
          </div>
          <div className="mt-0.5 text-xs text-ink-60">
            관심 있는 부스를 모아보세요
          </div>
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
            <EmptyState
              icon={I.star()}
              title="저장된 부스가 없습니다"
              sub="관심 있는 부스를 저장해 보세요"
              className="pt-24 pb-16"
            />
          )}
          {filteredFavorites.map((f) => {
            const { boothSummary, createdAt } = f
            const saved = isSaved(boothSummary.id)
            const displayType = TYPE_PARAM[boothSummary.type]
            const pillColor =
              boothSummary.type === 'NIGHT'
                ? FESTIV_TOKENS.alertSoft
                : boothSummary.type === 'FOOD_TRUCK'
                  ? FESTIV_TOKENS.sun
                  : FESTIV_TOKENS.popSoft
            const pillInk =
              boothSummary.type === 'NIGHT'
                ? FESTIV_TOKENS.alert
                : boothSummary.type === 'FOOD_TRUCK'
                  ? '#fff'
                  : FESTIV_TOKENS.pop
            return (
              <div
                key={f.id}
                onClick={() => navigate(boothUrl(displayType, boothSummary.id))}
                className="w-full cursor-pointer overflow-hidden rounded-[20px] border border-border bg-surface text-left transition-transform duration-100 active:scale-[0.98]"
              >
                <div className="flex gap-3 p-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-2xl">
                    <PhotoSlot label="" radius={16} ratio="1/1" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Pill color={pillColor} ink={pillInk}>
                        {TYPE_LABEL[boothSummary.type]}
                      </Pill>
                      {/* TODO: 위치 정보 API 추가되면 연결
                      <Pill color="transparent" ink={muted} className="p-0!">
                        {getZoneName(boothSummary.zoneId, boothSummary.type)}
                      </Pill>
                      {boothSummary.sections && boothSummary.sections.length > 0 && (
                        <Pill color="transparent" ink={muted} className="p-0!">
                          #{formatSections(boothSummary.sections)}
                        </Pill>
                      )} */}
                    </div>

                    <div className="mt-1.5 flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-extrabold tracking-[-0.3px] text-ink">
                          {boothSummary.name}
                        </div>
                        <div className="mt-1 text-[11px] text-ink-40">
                          {formatDate(createdAt)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleSave(boothSummary.id)
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
            className="absolute inset-x-0 bottom-0 z-60 rounded-t-[28px] bg-surface px-5 pt-4 font-festi shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
            style={{
              paddingBottom: tabBarOuterPb,
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
              <ProfileInfoRow label="아이디" value={userId} />
              <div className="mx-4 h-px bg-border" />
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
