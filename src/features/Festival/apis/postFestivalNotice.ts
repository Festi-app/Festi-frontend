import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostFestivalNoticeRequestDto, PostFestivalNoticeResponseDto } from '../types/festival'

export async function postFestivalNotice(
  body: PostFestivalNoticeRequestDto
): Promise<PostFestivalNoticeResponseDto> {
  const { data } = await apiClient.post<PostFestivalNoticeResponseDto>(ENDPOINTS.FESTIVAL.NOTICES, body)
  return data
}
