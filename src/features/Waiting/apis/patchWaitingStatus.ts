import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Waiting, UpdateWaitingStatusBody } from '../types/waiting'

export async function patchWaitingStatus(
  waitingId: string,
  body: UpdateWaitingStatusBody
): Promise<Waiting> {
  const { data } = await apiClient.patch<Waiting>(
    ENDPOINTS.WAITINGS.STATUS(waitingId),
    body
  )
  return data
}
