import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { ToggleBoothWaitingBody } from '../types/waiting'

export async function patchBoothWaitingsStatus(
  boothId: string,
  body: ToggleBoothWaitingBody
): Promise<void> {
  await apiClient.patch(ENDPOINTS.BOOTHS.WAITINGS_STATUS(boothId), body)
}
