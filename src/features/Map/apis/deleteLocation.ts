import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteLocation(locationId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.LOCATIONS.DETAIL(locationId))
}
