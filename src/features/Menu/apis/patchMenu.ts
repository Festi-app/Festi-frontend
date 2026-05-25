import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

import type { MenusResponseDto } from '../types/MenusResponseDto'
import type { PatchMenuRequestDto } from '../types/PatchMenuRequestDto'

export async function patchMenu(
  boothId: string,
  menuId: string,
  body: PatchMenuRequestDto
): Promise<MenusResponseDto> {
  const { data } = await apiClient.patch<MenusResponseDto>(
    ENDPOINTS.BOOTHS.MENU_DETAIL(boothId, menuId),
    body
  )
  return data
}
