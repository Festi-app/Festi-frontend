import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothResponseDto, UUID } from '../types/booth'

export async function getBooth(boothId: UUID): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.get<GetBoothResponseDto>(ENDPOINTS.BOOTHS.DETAIL(boothId))
  return data
}
