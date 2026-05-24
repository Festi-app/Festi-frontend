import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function postWaitingCall(waitingId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.WAITINGS.CALL(waitingId))
}
