import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchLocationRequestDto } from '../types/PatchLocationRequestDto'
import type { GetLocationsResponseDto } from '../types/LocationsResponseDto'


export async function patchLocation(
  locationId: string,
  body: PatchLocationRequestDto
): Promise<GetLocationsResponseDto> {
  const { data } = await apiClient.patch<GetLocationsResponseDto>(
    ENDPOINTS.LOCATIONS.DETAIL(locationId),
    body
  )
  return data
}
