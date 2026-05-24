import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { WaitingResponseDto } from '../types/WaitingResponseDto'
import type { PatchWaitingStatusRequestDto } from '../types/PatchWaitingStatusRequestDto'

export async function patchWaitingStatus(
  waitingId: string,
  body: PatchWaitingStatusRequestDto
): Promise<WaitingResponseDto> {
  const { data } = await apiClient.patch<WaitingResponseDto>(
    ENDPOINTS.WAITINGS.STATUS(waitingId),
    body
  )
  return data
}
