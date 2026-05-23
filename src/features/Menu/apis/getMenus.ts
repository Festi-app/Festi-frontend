import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export async function getMenus(boothId: string): Promise<MenusResponseDto[]> {
  const { data } = await apiClient.get<MenusResponseDto[]>(ENDPOINTS.BOOTHS.MENUS(boothId))
  return data
}
