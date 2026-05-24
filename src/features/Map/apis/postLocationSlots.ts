import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostLocationSlotsRequestDto } from '../types/PostLocationSlotsRequestDto'
import type { GetLocationsResponseDto } from '../types/LocationsResponseDto'

export async function postLocationSlots(
  body: PostLocationSlotsRequestDto
): Promise<GetLocationsResponseDto[]> {
  const { data } = await apiClient.post<GetLocationsResponseDto[]>(
    ENDPOINTS.LOCATIONS.SLOTS,
    body
  )
  return data
}
