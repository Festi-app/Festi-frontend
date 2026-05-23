import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothsRequestDto, GetBoothsResponseDto } from '../types/booth'

export async function getBooths(params?: GetBoothsRequestDto): Promise<GetBoothsResponseDto> {
  const { data } = await apiClient.get<GetBoothsResponseDto>(ENDPOINTS.BOOTHS.LIST, { params })
  return data
}
