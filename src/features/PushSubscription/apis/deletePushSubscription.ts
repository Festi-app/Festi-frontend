import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deletePushSubscription(
  subscriptionId: string
): Promise<void> {
  await apiClient.delete(ENDPOINTS.PUSH_SUBSCRIPTIONS.DETAIL(subscriptionId))
}
