import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalTimelineRequestDto } from '../types/FestivalTimelineRequestDto'
import type { TimelineResponseDto } from '../types/TimelineResponseDto'

export async function postFestivalTimeline(
  body: FestivalTimelineRequestDto
): Promise<TimelineResponseDto> {
  const { data } = await apiClient.post<TimelineResponseDto>(
    ENDPOINTS.FESTIVAL.TIMELINES,
    body
  )
  return data
}
