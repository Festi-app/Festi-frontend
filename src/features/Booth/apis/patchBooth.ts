import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchBoothRequestDto } from '../types/PatchBoothRequestDto'
import type { GetBoothResponseDto } from '../types/GetBoothResponseDto'

export async function patchBooth(
  boothId: string,
  body: PatchBoothRequestDto
): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.patch<GetBoothResponseDto>(
    ENDPOINTS.BOOTHS.DETAIL(boothId),
    body
  )
  return data
}
