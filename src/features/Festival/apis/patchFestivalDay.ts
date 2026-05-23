import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalDayRequestDto } from '../types/FestivalDayRequestDto'
import type { FestivalDayResponseDto } from '../types/FestivalDayResponseDto'

export async function patchFestivalDay(
  festivalDayId: string,
  body: FestivalDayRequestDto
): Promise<FestivalDayResponseDto> {
  const { data } = await apiClient.patch<FestivalDayResponseDto>(
    ENDPOINTS.FESTIVAL.DAY_DETAIL(festivalDayId),
    body
  )
  return data
}
