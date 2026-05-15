import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'
import {
  useBoothAdminStore,
  type BoothAdminAccount,
  type OperatingTime,
} from '../../stores/useBoothAdminStore'
import { I } from '../../tokens'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type StatusFilter = 'pending' | 'approved' | 'rejected'

const STATUS_LABEL: Record<BoothAdminAccount['status'], string> = {
  pending: '대기중',
  approved: '승인',
  rejected: '반려',
}

const STATUS_COLOR: Record<BoothAdminAccount['status'], string> = {
  pending: 'bg-sun/15 text-[#B8860B]',
  approved: 'bg-pop/15 text-pop',
  rejected: 'bg-alert/15 text-alert',
}

const TIME_LABEL: Record<OperatingTime, string> = {
  주간: '주간 위치',
  야간: '야간 위치',
}

function locationForTime(account: BoothAdminAccount, time: OperatingTime) {
  return time === '주간' ? account.dayLocation : account.nightLocation
}

function AccountCard({
  account,
  onReject,
  onApprove,
}: {
  account: BoothAdminAccount
  onReject: (id: string) => void
  onApprove: (id: string) => void
}) {
  const navigate = useNavigate()

  const canApprove = account.operatingTimes.every(
    (t) => (locationForTime(account, t) ?? '').trim().length > 0
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-extrabold text-ink">
              {account.orgName}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                STATUS_COLOR[account.status]
              )}
            >
              {STATUS_LABEL[account.status]}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-ink-60">
            {account.orgType} · {account.representativeName} · {account.studentId}
          </div>
        </div>
        <div className="shrink-0 text-[11px] text-ink-40">
          운영: {account.operatingTimes.join(' · ')}
        </div>
      </div>

      {/* Booth info summary */}
      <div className="mb-4 flex flex-col gap-1.5 rounded-xl bg-bg px-4 py-3 text-[13px]">
        {account.operatingTimes.includes('주간') && (
          <div className="flex gap-2">
            <span className="w-10 shrink-0 font-bold text-ink-60">주간</span>
            <span className="text-ink">
              {account.dayBoothName || '—'}
              {account.dayCategory ? ` (${account.dayCategory})` : ''}
            </span>
          </div>
        )}
        {account.operatingTimes.includes('야간') && (
          <div className="flex gap-2">
            <span className="w-10 shrink-0 font-bold text-ink-60">야간</span>
            <span className="text-ink">{account.nightBoothName || '—'}</span>
          </div>
        )}
      </div>

      {/* Location assignment status — shown for pending and approved */}
      {account.status !== 'rejected' && (
        <div className="mb-4 rounded-xl border border-border bg-bg px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-40">
              부스 위치 권한 부여 현황
            </span>
            <button
              type="button"
              onClick={() => navigate('/admin/booths')}
              className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-ink-60 hover:text-ink"
            >
              <span className="size-3">{I.map()}</span>
              배정하기
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {account.operatingTimes.map((time) => {
              const loc = locationForTime(account, time) ?? ''
              const assigned = loc.trim().length > 0
              return (
                <div key={time} className="flex items-center gap-2">
                  {assigned ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-pop text-[9px] font-black text-white">
                      ✓
                    </span>
                  ) : (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-ink-20 text-[9px] text-ink-40">
                      ·
                    </span>
                  )}
                  <span className="w-16 text-[12px] font-bold text-ink-60">
                    {TIME_LABEL[time]}
                  </span>
                  <span
                    className={cn(
                      'text-[12px]',
                      assigned ? 'font-semibold text-ink' : 'text-ink-40'
                    )}
                  >
                    {assigned ? loc : '미배정 — 부스 배치에서 권한 부여 필요'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      {account.status === 'pending' && (
        <div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReject(account.id)}
              className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-bold text-ink-60"
            >
              반려
            </button>
            <button
              type="button"
              onClick={() => onApprove(account.id)}
              disabled={!canApprove}
              className="flex-1 rounded-xl bg-cta py-2.5 text-[13px] font-bold text-cta-ink disabled:opacity-40"
            >
              승인
            </button>
          </div>
          {!canApprove && (
            <p className="mt-2 text-center text-[11px] text-ink-40">
              부스 배치 도구에서 위치 권한 부여 완료 후 승인이 활성화돼요
            </p>
          )}
        </div>
      )}
      {account.status === 'approved' && (
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-pop/10 py-2.5 text-[13px] font-bold text-pop">
          <span className="size-3.5">{I.check('#22C36A')}</span>
          승인 완료
        </div>
      )}
      {account.status === 'rejected' && (
        <button
          type="button"
          onClick={() => onApprove(account.id)}
          disabled={!canApprove}
          className="w-full rounded-xl border border-border py-2.5 text-[13px] font-bold text-ink-60 disabled:opacity-40"
        >
          승인으로 전환
        </button>
      )}
    </div>
  )
}

export function AdminBoothRequests({ dark }: { dark?: boolean }) {
  const accounts = useBoothAdminStore((s) => s.accounts)
  const approveAccount = useBoothAdminStore((s) => s.approveAccount)
  const rejectAccount = useBoothAdminStore((s) => s.rejectAccount)

  const [filter, setFilter] = useState<StatusFilter>('pending')

  const pending = accounts.filter((a) => a.status === 'pending')
  const approved = accounts.filter((a) => a.status === 'approved')
  const rejected = accounts.filter((a) => a.status === 'rejected')

  const counts: Record<StatusFilter, number> = {
    pending: pending.length,
    approved: approved.length,
    rejected: rejected.length,
  }

  const filtered =
    filter === 'pending' ? pending : filter === 'approved' ? approved : rejected

  return (
    <AdminShell active="booth-requests" dark={dark}>
      <AdminTopBar
        title="부스 신청 관리"
        sub={`총 ${accounts.length}건 · 대기 ${pending.length}건`}
        right={
          <AdminBtn ghost icon={I.bell()}>
            알림 설정
          </AdminBtn>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1.5 border-b border-border bg-surface px-6 pt-4 pb-0">
        {(['pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
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

      {/* List */}
      <div className="flex-1 overflow-y-auto bg-bg px-6 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-40">
            <div className="mb-2 size-10">{I.user('#C5CDD6')}</div>
            <div className="text-sm font-semibold">신청 내역이 없어요</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onApprove={approveAccount}
                onReject={rejectAccount}
              />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
