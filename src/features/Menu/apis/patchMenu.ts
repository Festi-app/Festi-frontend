import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenuItem,  } from '../types/menu'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export async function patchMenu(
  boothId: string,
  menuId: string,
  body: MenusResponseDto
): Promise<MenuItem> {
  const { data } = await apiClient.patch<MenuItem>(
    ENDPOINTS.BOOTHS.MENU_DETAIL(boothId, menuId),
    body
  )
  return data
}
