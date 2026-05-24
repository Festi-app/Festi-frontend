import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteFavorite(favoriteId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.FAVORITES.REMOVE(favoriteId))
}
