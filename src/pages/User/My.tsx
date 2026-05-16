import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FestiTabBar } from '../../components/User/Navbar'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { AppHeader, PageTitle } from '../../components/User/ScreenHeader'

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
    tagColor: FESTI_TOKENS.alertSoft,
    tagInk: FESTI_TOKENS.alert,
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
    tagColor: FESTI_TOKENS.alertSoft,
    tagInk: FESTI_TOKENS.alert,
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
    tagColor: FESTI_TOKENS.popSoft,
    tagInk: FESTI_TOKENS.pop,
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
    tagColor: FESTI_TOKENS.sun,
    tagInk: '#fff',
  },
]

export function MobileMy({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('전체')
  const [profileOpen, setProfileOpen] = useState(false)
  const [phone, setPhone] = useState('010-2354-8821')
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState(phone)
  const muted = dark ? '#8B939B' : '#5E676D'

  function savePhone() {
    setPhone(phoneInput)
    setEditingPhone(false)
  }

  function closeProfile() {
    setProfileOpen(false)
    setEditingPhone(false)
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
        <AppHeader dark={dark} className="mt-1.5 mb-1" />
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>즐겨찾기</PageTitle>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex size-10 items-center justify-center rounded-full bg-surface-alt text-ink-80"
            >
              <div className="size-5">{I.user()}</div>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 rounded-2xl bg-surface-alt py-3">
          {[
            { label: '저장', value: `${FAVORITES.length}` },
            {
              label: '운영중',
              value: `${FAVORITES.filter((b) => b.open).length}`,
            },
            { label: '최단 대기', value: '2팀' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`text-center ${i < 2 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[11px] font-semibold text-ink-60">
                {s.label}
              </div>
              <div className="mt-1 text-[18px] font-extrabold tracking-[-0.4px] text-ink">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex gap-1.5 overflow-x-auto">
          {['전체', '운영중', '푸드트럭'].map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => setFilter(chip)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-bold tracking-[-0.2px] ${
                chip === filter
                  ? 'border-cta bg-cta text-cta-ink'
                  : 'border-border bg-surface text-ink-80'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
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
          <div className="text-xs font-semibold text-ink-60">최근 업데이트</div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredFavorites.map((booth) => (
            <button
              type="button"
              key={booth.id}
              onClick={() => navigate('/booth')}
              className={`w-full overflow-hidden rounded-[20px] border border-border bg-surface text-left transition-transform duration-100 active:scale-[0.98] ${
                booth.open ? 'opacity-100' : 'opacity-65'
              }`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-[16px]">
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
                    <div className="size-4.5 shrink-0 text-alert">
                      {I.star(FESTI_TOKENS.alert, FESTI_TOKENS.alert)}
                    </div>
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
            </button>
          ))}
        </div>
        {/*<div*/}
        {/*  className="mt-4 rounded-[18px] border border-border p-4"*/}
        {/*  style={{ background: surfaceAlt, color: ink80 }}*/}
        {/*>*/}
        {/*  <div className="flex items-center gap-2">*/}
        {/*    <div className="size-4 text-pop">{I.bell()}</div>*/}
        {/*    <div className="text-[13px] font-bold tracking-[-0.2px]">*/}
        {/*      즐겨찾기 알림*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="mt-1.5 text-xs leading-normal text-ink-60">*/}
        {/*    저장한 부스의 대기팀이 3팀 이하가 되면 알림을 받을 수 있어요.*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      <FestiTabBar active="me" dark={dark} />

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
            {/* Handle */}
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
              {/* 이름 - 읽기 전용 */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-18 text-[13px] font-semibold text-ink-60">
                  이름
                </div>
                <div className="flex-1 text-[15px] font-bold tracking-[-0.3px] text-ink">
                  홍길동
                </div>
              </div>

              <div className="mx-4 h-px bg-border" />

              {/* 전화번호 - 수정 가능 */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-18 text-[13px] font-semibold text-ink-60">
                  전화번호
                </div>
                {editingPhone ? (
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePhone()}
                    autoFocus
                    className="flex-1 bg-transparent text-[15px] font-bold tracking-[-0.3px] text-ink outline-none"
                  />
                ) : (
                  <div className="flex-1 text-[15px] font-bold tracking-[-0.3px] text-ink">
                    {phone}
                  </div>
                )}
                {editingPhone ? (
                  <button
                    type="button"
                    onClick={savePhone}
                    className="rounded-full bg-cta px-3 py-1.5 text-[12px] font-extrabold text-cta-ink"
                  >
                    저장
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneInput(phone)
                      setEditingPhone(true)
                    }}
                    className="rounded-full border border-border bg-surface-alt px-3 py-1.5 text-[12px] font-bold text-ink-80"
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
