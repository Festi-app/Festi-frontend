import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalDaysResponseDto } from '../types/FestivalDayResponseDto'

export async function getFestivalDays(): Promise<GetFestivalDaysResponseDto> {
  const { data } = await apiClient.get<GetFestivalDaysResponseDto>(
    ENDPOINTS.FESTIVAL.DAYS
  )
  return data
}
