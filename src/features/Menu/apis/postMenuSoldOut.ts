import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function postMenuSoldOut(boothId: string, menuId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.BOOTHS.MENU_SOLD_OUT(boothId, menuId))
}
