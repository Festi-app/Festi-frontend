import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UUID } from '../types/festival'

export async function deleteFestivalTimeline(timelineId: UUID): Promise<void> {
  await apiClient.delete(ENDPOINTS.FESTIVAL.TIMELINE_DETAIL(timelineId))
}
