import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Location, CreateLocationBody } from '../types/location'

export async function postLocation(body: CreateLocationBody): Promise<Location> {
  const { data } = await apiClient.post<Location>(ENDPOINTS.LOCATIONS.LIST, body)
  return data
}
