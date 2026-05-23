import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostBoothWaitingRequestDto, PostBoothWaitingResponseDto, UUID } from '../types/booth'

export async function postBoothWaiting(
  boothId: UUID,
  body: PostBoothWaitingRequestDto
): Promise<PostBoothWaitingResponseDto> {
  const { data } = await apiClient.post<PostBoothWaitingResponseDto>(
    ENDPOINTS.BOOTHS.WAITINGS(boothId),
    body
  )
  return data
}
