import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UUID } from '../types/festival'

export async function deleteFestivalDay(festivalDayId: UUID): Promise<void> {
  await apiClient.delete(ENDPOINTS.FESTIVAL.DAY_DETAIL(festivalDayId))
}
