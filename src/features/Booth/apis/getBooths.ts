import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothsRequestDto } from '../types/GetBoothsRequestDto'
import type { GetBoothsResponseDto } from '../types/GetBoothsResponseDto'

export async function getBooths(
  params?: GetBoothsRequestDto
): Promise<GetBoothsResponseDto> {
  const { data } = await apiClient.get<GetBoothsResponseDto>(
    ENDPOINTS.BOOTHS.LIST,
    { params }
  )
  return data
}
