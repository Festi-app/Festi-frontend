import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostFestivalTimelineRequestDto, PostFestivalTimelineResponseDto } from '../types/festival'

export async function postFestivalTimeline(
  body: PostFestivalTimelineRequestDto
): Promise<PostFestivalTimelineResponseDto> {
  const { data } = await apiClient.post<PostFestivalTimelineResponseDto>(ENDPOINTS.FESTIVAL.TIMELINES, body)
  return data
}
