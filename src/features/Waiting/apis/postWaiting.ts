import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { WaitingResponseDto } from '../types/WaitingResponseDto'
import type { PostWaitingRequestDto } from '../types/PostWaitingRequestDto'

export async function postWaiting(
  boothId: string,
  body: PostWaitingRequestDto
): Promise<WaitingResponseDto> {
  const { data } = await apiClient.post<WaitingResponseDto>(
    ENDPOINTS.BOOTHS.WAITINGS(boothId),
    body
  )
  return data
}
