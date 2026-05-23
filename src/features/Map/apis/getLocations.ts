import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Location, GetLocationsParams } from '../types/location'

export async function getLocations(params?: GetLocationsParams): Promise<Location[]> {
  const { data } = await apiClient.get<Location[]>(ENDPOINTS.LOCATIONS.LIST, { params })
  return data
}
