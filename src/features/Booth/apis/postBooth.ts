import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostBoothRequestDto } from '../types/PostBoothRequestDto'
import type { GetBoothResponseDto } from '../types/GetBoothResponseDto'

export async function postBooth(
  body: PostBoothRequestDto
): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.post<GetBoothResponseDto>(
    ENDPOINTS.BOOTHS.FOOD_TRUCKS,
    body
  )
  return data
}
