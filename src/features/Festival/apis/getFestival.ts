import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalResponseDto } from '../types/festival'

export async function getFestival(): Promise<GetFestivalResponseDto> {
  const { data } = await apiClient.get<GetFestivalResponseDto>(ENDPOINTS.FESTIVAL.ROOT)
  return data
}
