import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchFestivalNoticeRequestDto, PatchFestivalNoticeResponseDto, UUID } from '../types/festival'

export async function patchFestivalNotice(
  noticeId: UUID,
  body: PatchFestivalNoticeRequestDto
): Promise<PatchFestivalNoticeResponseDto> {
  const { data } = await apiClient.patch<PatchFestivalNoticeResponseDto>(
    ENDPOINTS.FESTIVAL.NOTICE_DETAIL(noticeId),
    body
  )
  return data
}
