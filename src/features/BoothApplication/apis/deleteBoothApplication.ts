import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteBoothApplication(): Promise<void> {
  await apiClient.delete(ENDPOINTS.BOOTH_APPLICATIONS.ME)
}
