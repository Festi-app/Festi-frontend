import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetLocationsRequestDto } from '../types/GetLocationsRequestDto'
import type { GetLocationsResponseDto } from '../types/LocationsResponseDto'

export async function getLocations(
  params: GetLocationsRequestDto
): Promise<GetLocationsResponseDto[]> {
  const { data } = await apiClient.get<GetLocationsResponseDto[]>(
    ENDPOINTS.LOCATIONS.LIST,
    { params }
  )
  return data
}
