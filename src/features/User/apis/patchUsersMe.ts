import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UserRequestDto } from '../types/UserRequestDto'
import type { UserResponseDto } from '../types/UserResponseDto'

export async function patchUsersMe(
  body: UserRequestDto
): Promise<UserResponseDto> {
  const { data } = await apiClient.patch<UserResponseDto>(
    ENDPOINTS.USERS.ME,
    body
  )
  return data
}
