import type { NoticeType } from '../../stores/useNoticeStore'

export interface NoticeDraft {
  type: NoticeType
  title: string
  content: string
  pinned: boolean
}

export const EMPTY_DRAFT: NoticeDraft = {
  type: '공지',
  title: '',
  content: '',
  pinned: false,
}
