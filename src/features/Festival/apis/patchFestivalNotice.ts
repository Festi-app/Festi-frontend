import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalNoticeRequestDto } from '../types/FestivalNoticeRequestDto'
import type { NoticeResponseDto } from '../types/NoticeResponseDto'

export async function patchFestivalNotice(
  noticeId: string,
  body: FestivalNoticeRequestDto
): Promise<NoticeResponseDto> {
  const { data } = await apiClient.patch<NoticeResponseDto>(
    ENDPOINTS.FESTIVAL.NOTICE_DETAIL(noticeId),
    body
  )
  return data
}
