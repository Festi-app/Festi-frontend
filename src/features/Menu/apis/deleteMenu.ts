import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteMenu(
  boothId: string,
  menuId: string
): Promise<void> {
  await apiClient.delete(ENDPOINTS.BOOTHS.MENU_DETAIL(boothId, menuId))
}
