import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchBoothWaitingsStatusRequestDto } from '../types/PatchBoothWaitingsStatusRequestDto'
import type { GetBoothResponseDto } from '../../Booth/types/GetBoothResponseDto'

export async function patchBoothWaitingsStatus(
  boothId: string,
  body: PatchBoothWaitingsStatusRequestDto
): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.patch<GetBoothResponseDto>(
    ENDPOINTS.BOOTHS.WAITINGS_STATUS(boothId),
    body
  )
  return data
}
