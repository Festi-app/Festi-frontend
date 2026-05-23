import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalNoticesResponseDto } from '../types/festival'

export async function getFestivalNotices(): Promise<GetFestivalNoticesResponseDto> {
  const { data } = await apiClient.get<GetFestivalNoticesResponseDto>(ENDPOINTS.FESTIVAL.NOTICES)
  return data
}
