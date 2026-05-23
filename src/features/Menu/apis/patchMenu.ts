import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenuItem, UpdateMenuBody } from '../types/menu'

export async function patchMenu(
  boothId: string,
  menuId: string,
  body: UpdateMenuBody
): Promise<MenuItem> {
  const { data } = await apiClient.patch<MenuItem>(
    ENDPOINTS.BOOTHS.MENU_DETAIL(boothId, menuId),
    body
  )
  return data
}
