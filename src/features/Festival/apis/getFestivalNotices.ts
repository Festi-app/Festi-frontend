import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalNoticesResponseDto } from '../types/NoticeResponseDto'

export async function getFestivalNotices(): Promise<GetFestivalNoticesResponseDto> {
  const { data } = await apiClient.get<GetFestivalNoticesResponseDto>(
    ENDPOINTS.FESTIVAL.NOTICES
  )
  return data
}
