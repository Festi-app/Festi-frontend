import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenuItem,} from '../types/menu'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export async function postMenu(boothId: string, body: MenusResponseDto): Promise<MenuItem> {
  const { data } = await apiClient.post<MenuItem>(ENDPOINTS.BOOTHS.MENUS(boothId), body)
  return data
}
