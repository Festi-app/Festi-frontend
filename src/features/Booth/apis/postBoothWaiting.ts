import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostBoothWaitingRequestDto } from '../types/PostBoothWaitingRequestDto'
import type { PostBoothWaitingResponseDto } from '../types/PostBoothWaitingResponseDto'

export async function postBoothWaiting(
  boothId: string,
  body: PostBoothWaitingRequestDto
): Promise<PostBoothWaitingResponseDto> {
  const { data } = await apiClient.post<PostBoothWaitingResponseDto>(
    ENDPOINTS.BOOTHS.WAITINGS(boothId),
    body
  )
  return data
}
