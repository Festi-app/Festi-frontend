import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostSignupRequestDto } from '../types/PostSignupRequestDto'
import type { UserResponseDto } from '../types/UserResponseDto'

export async function postSignup(
  body: PostSignupRequestDto
): Promise<UserResponseDto> {
  const { data } = await apiClient.post<UserResponseDto>(
    ENDPOINTS.AUTH.SIGNUP,
    body
  )
  return data
}
