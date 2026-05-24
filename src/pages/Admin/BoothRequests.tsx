import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { ADMIN_STEPS } from '../../constants/queryParams'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'
import { AdminModal } from '../../components/Admin/AdminModal'
import { AdminToast } from '../../components/Admin/AdminToast'
import { useBoothSectionStore } from '../../stores/useBoothSectionStore'
import { I } from '../../tokens'
import { cn } from '../../lib/cn'
import { useBoothApplications } from '../../features/BoothApplication/hooks/useBoothApplications'
import { useApproveApplication } from '../../features/BoothApplication/hooks/useApproveApplication'
import { useRejectApplication } from '../../features/BoothApplication/hooks/useRejectApplication'
import type {
  BoothApplicationResponseDto,
  ApplicationStatus,
} from '../../features/BoothApplication/types/BoothApplicationResponseDto'

type StatusFilter = 'PENDING' | 'APPROVED' | 'REJECTED'

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '반려',
}

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  PENDING: 'bg-sun/15 text-[#B8860B]',
  APPROVED: 'bg-pop/15 text-pop',
  REJECTED: 'bg-alert/15 text-alert',
}

const BOOTH_TYPE_LABEL: Record<string, string> = {
  DAY: '주간',
  NIGHT: '야간',
  FOOD_TRUCK: '푸드트럭',
}

function ApplicationCard({
  app,
  onReject,
  onApprove,
  onAssignClick,
}: {
  app: BoothApplicationResponseDto
  onReject: (id: string) => void
  onApprove: (id: string) => void
  onAssignClick: () => void
}) {
  const boothTypeLabel = BOOTH_TYPE_LABEL[app.boothType] ?? app.boothType

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold text-ink">
              {app.boothName}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                STATUS_COLOR[app.status]
              )}
            >
              {STATUS_LABEL[app.status]}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-ink-60">
            {boothTypeLabel} · 신청자 {app.applicantId}
          </div>
        </div>
        <div className="shrink-0 text-[11px] text-ink-40">
          {new Date(app.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>

      {app.description && (
        <div className="mb-4 rounded-xl bg-bg px-4 py-3 text-[13px] text-ink">
          {app.description}
        </div>
      )}

      {app.status !== 'REJECTED' && (
        <div className="mb-4 rounded-xl border border-border bg-bg px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 위치 배정
            </span>
            <button
              type="button"
              onClick={onAssignClick}
              className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-ink-60 hover:text-ink"
            >
              <span className="size-3">{I.map()}</span>
              배정하기
            </button>
          </div>
        </div>
      )}

      {app.status === 'PENDING' && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onReject(app.id)}
            className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-bold text-ink-60"
          >
            반려
          </button>
          <button
            type="button"
            onClick={() => onApprove(app.id)}
            className="flex-1 rounded-xl bg-cta py-2.5 text-[13px] font-bold text-cta-ink"
          >
            승인
          </button>
        </div>
      )}
      {app.status === 'APPROVED' && (
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-pop/10 py-2.5 text-[13px] font-bold text-pop">
          <span className="size-3.5">{I.check('#22C36A')}</span>
          승인 완료
        </div>
      )}
      {app.status === 'REJECTED' && (
        <div className="rounded-xl bg-alert/10 px-4 py-2.5 text-center text-[13px] font-bold text-alert">
          반려됨
          {app.reviewMemo && (
            <div className="mt-1 text-[11px] font-normal text-ink-60">
              사유: {app.reviewMemo}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AdminBoothRequests() {
  const navigate = useNavigate()
  const { data: applications = [], isLoading } = useBoothApplications()
  const { mutate: approve } = useApproveApplication()
  const { mutate: reject } = useRejectApplication()
  const { configuredModes } = useBoothSectionStore()

  const [filter, setFilter] = useState<StatusFilter>('PENDING')
  const [toast, setToast] = useState<string | null>(null)
  const [sectionGateModal, setSectionGateModal] = useState<string[] | null>(
    null
  )
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleAssignClick(app: BoothApplicationResponseDto) {
    const timeKey =
      app.boothType === 'DAY'
        ? '주간'
        : app.boothType === 'NIGHT'
          ? '야간'
          : null
    const missing =
      timeKey && !configuredModes.includes(timeKey as never) ? [timeKey] : []
    if (missing.length > 0) {
      setSectionGateModal(missing)
    } else {
      navigate(`${ROUTES.ADMIN.BOOTHS}?step=${ADMIN_STEPS.ASSIGN}`)
    }
  }

  function handleConfirmReject() {
    if (!rejectTarget || !rejectReason.trim()) return
    const appName = applications.find((a) => a.id === rejectTarget)?.name ?? ''
    reject(
      { applicationId: rejectTarget, body: { reviewMemo: rejectReason } },
      {
        onSuccess: () => {
          setRejectTarget(null)
          setRejectReason('')
          showToast(`'${appName}' 반려되었습니다`)
        },
      }
    )
  }

  const pending = applications.filter((a) => a.status === 'PENDING')
  const approved = applications.filter((a) => a.status === 'APPROVED')
  const rejected = applications.filter((a) => a.status === 'REJECTED')

  const counts: Record<StatusFilter, number> = {
    PENDING: pending.length,
    APPROVED: approved.length,
    REJECTED: rejected.length,
  }

  const filtered =
    filter === 'PENDING' ? pending : filter === 'APPROVED' ? approved : rejected

  return (
    <AdminShell active="booth-requests">
      <AdminTopBar
        title="부스 신청 관리"
        sub={`총 ${applications.length}건 · 대기 ${pending.length}건`}
        right={
          <AdminBtn ghost icon={I.bell()}>
            알림 설정
          </AdminBtn>
        }
      />

      <div className="flex gap-1.5 border-b border-border bg-surface px-6 pt-4 pb-0">
        {(['PENDING', 'APPROVED', 'REJECTED'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-t-xl px-4 py-2.5 text-[13px] font-bold transition-colors',
              filter === s
                ? 'border border-b-0 border-border bg-bg text-ink'
                : 'text-ink-60'
            )}
          >
            {STATUS_LABEL[s]}
            <span
              className={cn(
                'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                filter === s
                  ? 'bg-cta text-cta-ink'
                  : 'bg-surface-alt text-ink-60'
              )}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-bg px-6 py-5">
        {isLoading ? (
          <div className="flex justify-center py-20 text-sm text-ink-40">
            불러오는 중...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-40">
            <div className="mb-2 size-10">{I.user('#C5CDD6')}</div>
            <div className="text-sm font-semibold">신청 내역이 없어요</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onApprove={(id) => {
                  const appName =
                    applications.find((a) => a.id === id)?.name ?? ''
                  approve(id, {
                    onSuccess: () => showToast(`'${appName}' 승인되었습니다`),
                  })
                }}
                onReject={(id) => {
                  setRejectTarget(id)
                  setRejectReason('')
                }}
                onAssignClick={() => handleAssignClick(app)}
              />
            ))}
          </div>
        )}
      </div>

      <AdminModal
        open={rejectTarget !== null}
        variant="warning"
        title="반려 사유를 입력하세요"
        body={
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="반려 사유를 입력하세요"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-40 focus:border-cta focus:outline-none"
          />
        }
        confirmLabel="반려하기"
        onConfirm={handleConfirmReject}
        onClose={() => setRejectTarget(null)}
      />

      <AdminModal
        open={sectionGateModal !== null}
        variant="warning"
        title="구역 설정이 필요해요"
        body={
          <>
            배정하기 전에{' '}
            <strong>
              {sectionGateModal?.map((m) => `${m} 구역`).join(', ')}
            </strong>{' '}
            섹션 개수를 먼저 설정하고 저장해주세요.
            <br />
            부스 배치 페이지에서 해당 구역 설정을 완료하세요.
          </>
        }
        confirmLabel="확인"
        onClose={() => setSectionGateModal(null)}
      />
      {toast && <AdminToast message={toast} />}
    </AdminShell>
  )
}
