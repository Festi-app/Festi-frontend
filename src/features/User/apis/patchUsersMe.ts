import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type {
  PatchUsersMeRequestDto,
  PatchUsersMeResponseDto,
} from '../types/user'

export async function patchUsersMe(
  body: PatchUsersMeRequestDto
): Promise<PatchUsersMeResponseDto> {
  const { data } = await apiClient.patch<PatchUsersMeResponseDto>(
    ENDPOINTS.USERS.ME,
    body
  )
  return data
}
