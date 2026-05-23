import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothMenusResponseDto } from '../types/GetBoothMenusResponseDto'

export async function getBoothMenus(
  boothId: string
): Promise<GetBoothMenusResponseDto> {
  const { data } = await apiClient.get<GetBoothMenusResponseDto>(
    ENDPOINTS.BOOTHS.MENUS(boothId)
  )
  return data
}
