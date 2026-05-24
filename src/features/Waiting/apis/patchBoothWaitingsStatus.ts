import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchBoothWaitingsStatusRequestDto } from '../types/PatchBoothWaitingsStatusRequestDto'

export async function patchBoothWaitingsStatus(
  boothId: string,
  body: PatchBoothWaitingsStatusRequestDto
): Promise<void> {
  await apiClient.patch(ENDPOINTS.BOOTHS.WAITINGS_STATUS(boothId), body)
}
