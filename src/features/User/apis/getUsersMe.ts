import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UserResponseDto } from '../types/UserResponseDto'

export async function getUsersMe(): Promise<UserResponseDto> {
  const { data } = await apiClient.get<UserResponseDto>(ENDPOINTS.USERS.ME)
  return data
}
