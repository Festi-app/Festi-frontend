import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFestivalTimelinesResponseDto } from '../types/TimelineResponseDto'

export async function getFestivalTimelines(): Promise<GetFestivalTimelinesResponseDto> {
  const { data } = await apiClient.get<GetFestivalTimelinesResponseDto>(
    ENDPOINTS.FESTIVAL.TIMELINES
  )
  return data
}
