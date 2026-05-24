import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type {
  PostPushSubscriptionRequestDto,
  PushSubscriptionResponseDto,
} from '../types/PushSubscriptionDto'

export async function postPushSubscription(
  body: PostPushSubscriptionRequestDto
): Promise<PushSubscriptionResponseDto> {
  const { data } = await apiClient.post<PushSubscriptionResponseDto>(
    ENDPOINTS.PUSH_SUBSCRIPTIONS.ROOT,
    body
  )
  return data
}
