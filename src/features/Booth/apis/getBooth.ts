import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothResponseDto } from '../types/GetBoothResponseDto'

export async function getBooth(boothId: string): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.get<GetBoothResponseDto>(
    ENDPOINTS.BOOTHS.DETAIL(boothId)
  )
  return data
}
