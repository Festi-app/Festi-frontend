import { useState } from 'react'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminToast } from '../../components/Admin/AdminToast'
import { AdminModal } from '../../components/Admin/AdminModal'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'

import { useFestivalNotices } from '../../features/Festival/hooks/useFestivalNotices'
import { useCreateFestivalNotice } from '../../features/Festival/hooks/useCreateFestivalNotice'
import { useUpdateFestivalNotice } from '../../features/Festival/hooks/useUpdateFestivalNotice'
import { useDeleteFestivalNotice } from '../../features/Festival/hooks/useDeleteFestivalNotice'
import { I } from '../../tokens'
import {
  EMPTY_DRAFT,
  type NoticeDraft,
} from '../../components/Admin/Notice/noticeShared'
import { NoticeFormPanel } from '../../components/Admin/Notice/NoticeFormPanel'
import { NoticeEmptyPanel } from '../../components/Admin/Notice/NoticeEmptyPanel'
import { NoticeList } from '../../components/Admin/Notice/NoticeList'

type PanelMode = 'idle' | 'create' | 'edit'

export function AdminNotices() {
  const { data: notices = [] } = useFestivalNotices()
  const createNotice = useCreateFestivalNotice()
  const updateNotice = useUpdateFestivalNotice()
  const deleteNotice = useDeleteFestivalNotice()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [draft, setDraft] = useState<NoticeDraft>(EMPTY_DRAFT)
  const [toast, setToast] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function startCreate() {
    setSelectedId(null)
    setDraft(EMPTY_DRAFT)
    setPanelMode('create')
  }

  function startEdit(id: string) {
    const notice = notices.find((n) => n.id === id)
    if (!notice) return
    setSelectedId(id)
    setDraft({
      title: notice.title,
      content: notice.content,
      pinned: notice.pinned,
    })
    setPanelMode('edit')
  }

  function handleSave() {
    if (panelMode === 'create') {
      createNotice.mutate(draft, {
        onSuccess: () => {
          setPanelMode('idle')
          setSelectedId(null)
          showToast('공지를 등록했어요')
        },
      })
    } else if (panelMode === 'edit' && selectedId) {
      updateNotice.mutate(
        { noticeId: selectedId, body: draft },
        {
          onSuccess: () => {
            setPanelMode('idle')
            showToast('공지를 수정했어요')
          },
        }
      )
    }
  }

  function handleCancel() {
    setSelectedId(null)
    setPanelMode('idle')
  }

  function handleDelete(id: string) {
    setDeleteTargetId(id)
  }

  function confirmDelete() {
    if (!deleteTargetId) return
    deleteNotice.mutate(deleteTargetId, {
      onSuccess: () => {
        if (selectedId === deleteTargetId) {
          setSelectedId(null)
          setPanelMode('idle')
        }
        showToast('공지를 삭제했어요')
        setDeleteTargetId(null)
      },
    })
  }

  function handleTogglePin(id: string) {
    const notice = notices.find((n) => n.id === id)
    if (!notice) return
    updateNotice.mutate(
      {
        noticeId: id,
        body: {
          title: notice.title,
          content: notice.content,
          pinned: !notice.pinned,
        },
      },
      {
        onSuccess: () =>
          showToast(notice.pinned ? '고정 해제되었습니다' : '고정되었습니다'),
      }
    )
  }

  const pinned = notices.filter((n) => n.pinned).length

  return (
    <AdminShell active="notices">
      <AdminTopBar
        title="공지"
        sub={`전체 ${notices.length}건 · 고정 ${pinned}건`}
        right={
          <AdminBtn primary icon={I.plus('#fff')} onClick={startCreate}>
            공지 등록
          </AdminBtn>
        }
      />

      <div className="flex min-h-0 flex-1">
        <NoticeList
          notices={notices}
          selectedId={selectedId}
          onSelect={startEdit}
          onTogglePin={handleTogglePin}
          onDelete={handleDelete}
        />

        <main className="flex min-h-0 flex-1 overflow-hidden bg-bg">
          {panelMode === 'idle' ? (
            <NoticeEmptyPanel onNew={startCreate} />
          ) : (
            <NoticeFormPanel
              mode={panelMode}
              draft={draft}
              onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </main>
      </div>
      <AdminModal
        open={!!deleteTargetId}
        variant="warning"
        title={`"${notices.find((n) => n.id === deleteTargetId)?.title ?? '공지사항'}" 삭제할까요?`}
        body="삭제된 공지는 복구할 수 없어요."
        confirmLabel="삭제"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
      {toast && <AdminToast message={toast} />}
    </AdminShell>
  )
}
