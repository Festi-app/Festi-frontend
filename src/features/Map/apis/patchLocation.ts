import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Location, UpdateLocationBody } from '../types/location'

export async function patchLocation(
  locationId: string,
  body: UpdateLocationBody
): Promise<Location> {
  const { data } = await apiClient.patch<Location>(
    ENDPOINTS.LOCATIONS.DETAIL(locationId),
    body
  )
  return data
}
