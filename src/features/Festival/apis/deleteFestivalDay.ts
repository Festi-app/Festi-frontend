import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
export async function deleteFestivalDay(festivalDayId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.FESTIVAL.DAY_DETAIL(festivalDayId))
}
