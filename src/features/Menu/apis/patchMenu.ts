import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

import type { MenusResponseDto } from '../types/MenusResponseDto'

export async function patchMenu(
  boothId: string,
  menuId: string,
  body: Partial<MenusResponseDto>
): Promise<MenusResponseDto> {
  const { data } = await apiClient.patch<MenusResponseDto>(
    ENDPOINTS.BOOTHS.MENU_DETAIL(boothId, menuId),
    body
  )
  return data
}
