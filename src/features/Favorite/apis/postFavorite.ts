import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostFavoriteRequestDto, PostFavoriteResponseDto } from '../types/favorite'

export async function postFavorite(body: PostFavoriteRequestDto): Promise<PostFavoriteResponseDto> {
  const { data } = await apiClient.post<PostFavoriteResponseDto>(ENDPOINTS.FAVORITES.ROOT, body)
  return data
}
