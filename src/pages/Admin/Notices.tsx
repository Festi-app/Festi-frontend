import { useState } from 'react'
import { AdminShell } from '../../components/Admin/AdminShell'
import { AdminTopBar } from '../../components/Admin/AdminTopBar'
import { AdminBtn } from '../../components/Admin/AdminBtn'

import { useNoticeStore } from '../../stores/useNoticeStore'
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
  const { notices, addNotice, updateNotice, deleteNotice, togglePin } =
    useNoticeStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [draft, setDraft] = useState<NoticeDraft>(EMPTY_DRAFT)

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
      addNotice(draft)
      setPanelMode('idle')
      setSelectedId(null)
    } else if (panelMode === 'edit' && selectedId) {
      updateNotice(selectedId, draft)
      setPanelMode('idle')
    }
  }

  function handleCancel() {
    setPanelMode(panelMode === 'create' ? 'idle' : 'edit')
    if (panelMode === 'create') {
      setSelectedId(null)
      setPanelMode('idle')
    } else {
      setPanelMode('idle')
    }
  }

  function handleDelete(id: string) {
    deleteNotice(id)
    if (selectedId === id) {
      setSelectedId(null)
      setPanelMode('idle')
    }
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
          onTogglePin={togglePin}
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
    </AdminShell>
  )
}
