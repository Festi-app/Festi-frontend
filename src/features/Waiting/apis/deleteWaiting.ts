import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteWaiting(waitingId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.WAITINGS.CANCEL(waitingId))
}
