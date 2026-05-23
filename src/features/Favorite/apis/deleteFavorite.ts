import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UUID } from '../types/favorite'

export async function deleteFavorite(favoriteId: UUID): Promise<void> {
  await apiClient.delete(ENDPOINTS.FAVORITES.REMOVE(favoriteId))
}
