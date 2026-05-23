import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { GetUsersMeResponseDto } from '../types/user'

export async function getUsersMe(): Promise<GetUsersMeResponseDto> {
  const { data } = await apiClient.get<GetUsersMeResponseDto>(
    ENDPOINTS.USERS.ME
  )
  return data
}
