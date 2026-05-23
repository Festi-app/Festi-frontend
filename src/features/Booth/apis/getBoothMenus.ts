import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetBoothMenusResponseDto, UUID } from '../types/booth'

export async function getBoothMenus(boothId: UUID): Promise<GetBoothMenusResponseDto> {
  const { data } = await apiClient.get<GetBoothMenusResponseDto>(ENDPOINTS.BOOTHS.MENUS(boothId))
  return data
}
