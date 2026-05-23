import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalDayRequestDto } from '../types/FestivalDayRequestDto'
import type { FestivalDayResponseDto } from '../types/FestivalDayResponseDto'

export async function postFestivalDay(
  body: FestivalDayRequestDto
): Promise<FestivalDayResponseDto> {
  const { data } = await apiClient.post<FestivalDayResponseDto>(
    ENDPOINTS.FESTIVAL.DAYS,
    body
  )
  return data
}
