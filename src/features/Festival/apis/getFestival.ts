import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalResponseDto } from '../types/FestivalResponseDto'

export async function getFestival(): Promise<FestivalResponseDto> {
  const { data } = await apiClient.get<FestivalResponseDto>(
    ENDPOINTS.FESTIVAL.ROOT
  )
  return data
}
