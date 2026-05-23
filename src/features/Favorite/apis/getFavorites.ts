import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFavoritesResponseDto } from '../types/favorite'

export async function getFavorites(): Promise<GetFavoritesResponseDto> {
  const { data } = await apiClient.get<GetFavoritesResponseDto>(ENDPOINTS.FAVORITES.ROOT)
  return data
}
