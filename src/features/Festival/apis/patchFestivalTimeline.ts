import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchFestivalTimelineRequestDto, PatchFestivalTimelineResponseDto, UUID } from '../types/festival'

export async function patchFestivalTimeline(
  timelineId: UUID,
  body: PatchFestivalTimelineRequestDto
): Promise<PatchFestivalTimelineResponseDto> {
  const { data } = await apiClient.patch<PatchFestivalTimelineResponseDto>(
    ENDPOINTS.FESTIVAL.TIMELINE_DETAIL(timelineId),
    body
  )
  return data
}
