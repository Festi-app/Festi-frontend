import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
export async function deleteFestivalTimeline(
  timelineId: string
): Promise<void> {
  await apiClient.delete(ENDPOINTS.FESTIVAL.TIMELINE_DETAIL(timelineId))
}
