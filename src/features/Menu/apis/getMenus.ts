import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenuItem } from '../types/menu'

export async function getMenus(boothId: string): Promise<MenuItem[]> {
  const { data } = await apiClient.get<MenuItem[]>(ENDPOINTS.BOOTHS.MENUS(boothId))
  return data
}
