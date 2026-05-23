import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetFavoritesResponseDto } from '../types/FavoriteResponseDto'

export async function getFavorites(): Promise<GetFavoritesResponseDto> {
  const { data } = await apiClient.get<GetFavoritesResponseDto>(
    ENDPOINTS.FAVORITES.ROOT
  )
  return data
}
