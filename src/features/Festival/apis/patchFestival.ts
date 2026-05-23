import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalRequestDto } from '../types/FestivalRequestDto'
import type { FestivalResponseDto } from '../types/FestivalResponseDto'

export async function patchFestival(
  body: FestivalRequestDto
): Promise<FestivalResponseDto> {
  const { data } = await apiClient.patch<FestivalResponseDto>(
    ENDPOINTS.FESTIVAL.ROOT,
    body
  )
  return data
}
