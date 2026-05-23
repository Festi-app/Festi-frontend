import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { FavoriteRequestDto } from '../types/FavoriteRequestDto'
import type { FavoriteResponseDto } from '../types/FavoriteResponseDto'

export async function postFavorite(
  body: FavoriteRequestDto
): Promise<FavoriteResponseDto> {
  const { data } = await apiClient.post<FavoriteResponseDto>(
    ENDPOINTS.FAVORITES.ROOT,
    body
  )
  return data
}
