import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostLoginRequestDto } from '../types/PostLoginRequestDto'
import type { PostLoginResponseDto } from '../types/PostLoginResponseDto'

export async function postLogin(
  body: PostLoginRequestDto
): Promise<PostLoginResponseDto> {
  const { data } = await apiClient.post<PostLoginResponseDto>(
    ENDPOINTS.AUTH.LOGIN,
    body
  )
  return data
}
