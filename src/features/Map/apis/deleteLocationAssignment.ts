import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteLocationAssignment(
  locationId: string
): Promise<void> {
  await apiClient.delete(ENDPOINTS.LOCATIONS.ASSIGNMENT(locationId))
}
