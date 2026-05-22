export interface NoticeDraft {
  title: string
  content: string
  pinned: boolean
}

export const EMPTY_DRAFT: NoticeDraft = {
  title: '',
  content: '',
  pinned: false,
}
