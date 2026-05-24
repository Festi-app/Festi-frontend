import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostBoothApplicationRequestDto } from '../types/PostBoothApplicationRequestDto'
import type { BoothApplicationResponseDto } from '../types/BoothApplicationResponseDto'

export async function postBoothApplication(
  body: PostBoothApplicationRequestDto
): Promise<BoothApplicationResponseDto> {
  const { data } = await apiClient.post<BoothApplicationResponseDto>(
    ENDPOINTS.BOOTH_APPLICATIONS.ROOT,
    body
  )
  return data
}
