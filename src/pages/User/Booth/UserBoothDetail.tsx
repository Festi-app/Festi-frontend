import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { I } from '../../../tokens'
import { PhotoHero } from '../../../components/User/PhotoHero'
import { Toast } from '../../../components/shared/Toast'
import { CancelToast } from '../../../components/User/CancelToast'
import { useToggleFavorite } from '../../../features/Favorite/hooks/useToggleFavorite'
import { useWaitingStore } from '../../../stores/useWaitingStore'
import { ConfirmModal } from '../../../components/User/ConfirmModal'
import { useWaitingCancel } from '../../../hooks/useWaitingCancel'
import { BoothDetailContent } from '../../../components/User/BoothDetailContent'
import { useBooth } from '../../../features/Booth/hooks/useBooth'
import { useBoothMenus } from '../../../features/Booth/hooks/useBoothMenus'

const CATEGORY_LABEL: Record<string, string> = {
  ACTIVITY: '활동',
  INFO: '정보',
  MARKET: '마켓',
  EXPERIENCE: '체험',
  PROMOTION: '홍보',
  ALCOHOL: '주류',
}

export function UserBoothDetail({
  dark = false,
  type = 'night',
  id,
}: {
  dark?: boolean
  type?: string
  id?: string
}) {
  const navigate = useNavigate()
  const isNight = type === 'night'
  const isTruck = type === 'truck'
  const { isSaved, toggle } = useToggleFavorite()
  const { waitings } = useWaitingStore()
  const [toast, setToast] = useState<'saved' | 'unsaved' | null>(null)
  const { confirmCancel, setConfirmCancel, showCancelToast, handleCancel } =
    useWaitingCancel()

  const { data: booth, isLoading } = useBooth(id ?? '')
  const { data: menus = [] } = useBoothMenus(id ?? '')

  const favorite = id ? isSaved(id) : false
  const alreadyWaiting =
    isNight && waitings.some((w) => w.boothId === Number(id))

  function toggleFavorite() {
    if (!id) return
    toggle(id)
    setToast(favorite ? 'unsaved' : 'saved')
    setTimeout(() => setToast(null), 2000)
  }

  const heroHeight = isTruck ? 'h-72' : 'h-80'
  const bodyHeight = isTruck
    ? 'h-[calc(100%-288px+28px)]'
    : 'h-[calc(100%-320px+28px)]'

  if (isLoading || !booth) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg font-festi text-sm text-ink-40">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg font-festi">
      <PhotoHero
        tone="leaf"
        label={isTruck ? 'cover · food truck' : `cover · booth`}
        height={heroHeight}
        showDots={!isTruck}
        onBack={() => navigate(-1)}
        favorite={favorite}
        onFavorite={toggleFavorite}
      />

      <div
        className={`relative z-2 -mt-7 ${bodyHeight} overflow-auto overscroll-none rounded-t-[28px] bg-surface px-5 pt-5 ${isNight ? 'pb-36' : 'pb-10'}`}
      >
        <BoothDetailContent
          dark={dark}
          name={booth.name}
          category={CATEGORY_LABEL[booth.category] ?? booth.category}
          id={booth.id}
          type={type}
          operatingHours={booth.operatingHours ?? undefined}
          description={booth.description ?? undefined}
          menus={menus}
        />
      </div>

      {isNight && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(180deg,transparent_0%,#ffffff_30%)] px-5 pt-3 pb-7 dark:bg-[linear-gradient(180deg,transparent_0%,#1a1e23_30%)]">
          {!booth.isWaitingOpen ? (
            <div className="flex w-full items-center justify-between rounded-[20px] bg-pop px-5 py-4">
              <div>
                <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px] text-white">
                  지금 바로 입장해주세요!
                </div>
                <div className="text-[11px] font-semibold text-white/70">
                  대기 없이 바로 입장 가능합니다
                </div>
              </div>
              <div className="size-4.5 text-white">
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <path
                    d="M3 8l3.5 3.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                alreadyWaiting
                  ? setConfirmCancel(true)
                  : navigate(`/waiting/register?id=${booth.id}`, {
                      replace: true,
                    })
              }
              className={`flex items-center w-full justify-between rounded-[20px] px-5 py-4 text-left transition-transform duration-100 active:scale-[0.98] ${
                alreadyWaiting
                  ? 'bg-[#D0D5D8] text-ink-60 dark:bg-[#2F353B] dark:text-ink-40'
                  : 'bg-cta text-cta-ink shadow-[0_8px_22px_rgba(0,198,224,0.4)]'
              }`}
            >
              <div>
                <div className="mt-1 text-[17px] font-extrabold tracking-[-0.4px]">
                  {alreadyWaiting ? '이미 웨이팅 중' : '웨이팅 걸기'}
                </div>
                <div className="text-[11px] font-semibold opacity-60">
                  {alreadyWaiting
                    ? '웨이팅을 취소할 수 있어요'
                    : '웨이팅 등록하기'}
                </div>
              </div>
              <div className="size-4.5">
                {I.chev(alreadyWaiting ? undefined : '#fff', 'r')}
              </div>
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmCancel}
        title="웨이팅을 취소할까요?"
        body={
          <>
            {booth.name} · 웨이팅
            <br />
            취소 후에는 다시 등록해야 합니다.
          </>
        }
        confirmLabel="취소하기"
        onConfirm={() => handleCancel(Number(id) || 0)}
        onClose={() => setConfirmCancel(false)}
      />

      <CancelToast show={showCancelToast} />

      {toast && (
        <Toast
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
    </div>
  )
}
