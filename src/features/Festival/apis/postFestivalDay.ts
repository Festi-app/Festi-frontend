import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostFestivalDayRequestDto, PostFestivalDayResponseDto } from '../types/festival'

export async function postFestivalDay(body: PostFestivalDayRequestDto): Promise<PostFestivalDayResponseDto> {
  const { data } = await apiClient.post<PostFestivalDayResponseDto>(ENDPOINTS.FESTIVAL.DAYS, body)
  return data
}
