import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { MenuItem, CreateMenuBody } from '../types/menu'

export async function postMenu(boothId: string, body: CreateMenuBody): Promise<MenuItem> {
  const { data } = await apiClient.post<MenuItem>(ENDPOINTS.BOOTHS.MENUS(boothId), body)
  return data
}
