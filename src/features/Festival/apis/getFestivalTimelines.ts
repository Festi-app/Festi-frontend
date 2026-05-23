import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalTimelinesResponseDto } from '../types/festival'

export async function getFestivalTimelines(): Promise<GetFestivalTimelinesResponseDto> {
  const { data } = await apiClient.get<GetFestivalTimelinesResponseDto>(ENDPOINTS.FESTIVAL.TIMELINES)
  return data
}
