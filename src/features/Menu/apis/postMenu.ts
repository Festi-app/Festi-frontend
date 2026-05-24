import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export async function postMenu(
  boothId: string,
  body: Omit<MenusResponseDto, 'id'>
): Promise<MenusResponseDto> {
  const { data } = await apiClient.post<MenusResponseDto>(
    ENDPOINTS.BOOTHS.MENUS(boothId),
    body
  )
  return data
}
