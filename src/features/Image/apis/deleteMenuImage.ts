import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteMenuImage(
  boothId: string,
  menuId: string
): Promise<void> {
  await apiClient.delete(ENDPOINTS.IMAGES.MENU(boothId, menuId))
}
