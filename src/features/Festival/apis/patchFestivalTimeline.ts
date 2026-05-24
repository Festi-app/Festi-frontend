import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FestivalTimelineRequestDto } from '../types/FestivalTimelineRequestDto'
import type { TimelineResponseDto } from '../types/TimelineResponseDto'

export async function patchFestivalTimeline(
  timelineId: string,
  body: FestivalTimelineRequestDto
): Promise<TimelineResponseDto> {
  const { data } = await apiClient.patch<TimelineResponseDto>(
    ENDPOINTS.FESTIVAL.TIMELINE_DETAIL(timelineId),
    body
  )
  return data
}
