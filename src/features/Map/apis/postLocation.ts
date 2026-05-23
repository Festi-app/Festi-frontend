import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostLocationRequestDto } from '../types/PostLocationRequestDto'
import type { GetLocationsResponseDto } from '../types/LocationsResponseDto'


export async function postLocation(
  body: PostLocationRequestDto
): Promise<GetLocationsResponseDto> {
  const { data } = await apiClient.post<GetLocationsResponseDto>(
    ENDPOINTS.LOCATIONS.LIST,
    body
  )
  return data
}
