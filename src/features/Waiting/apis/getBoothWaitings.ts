import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { WaitingResponseDto } from '../types/WaitingResponseDto'

export async function getBoothWaitings(
  boothId: string
): Promise<WaitingResponseDto[]> {
  const { data } = await apiClient.get<WaitingResponseDto[]>(
    ENDPOINTS.BOOTHS.WAITINGS(boothId)
  )
  return data
}
