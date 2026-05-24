export interface NoticeResponseDto {
  id: string
  title: string
  content: string
  pinned: boolean
  createdAt: string
}

export type GetFestivalNoticesResponseDto = NoticeResponseDto[]
