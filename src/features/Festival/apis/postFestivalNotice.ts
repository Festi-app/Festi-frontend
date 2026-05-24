import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalNoticeRequestDto } from '../types/FestivalNoticeRequestDto'
import type { NoticeResponseDto } from '../types/NoticeResponseDto'

export async function postFestivalNotice(
  body: FestivalNoticeRequestDto
): Promise<NoticeResponseDto> {
  const { data } = await apiClient.post<NoticeResponseDto>(
    ENDPOINTS.FESTIVAL.NOTICES,
    body
  )
  return data
}
