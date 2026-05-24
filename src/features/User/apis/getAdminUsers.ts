import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UserRole } from '../../Auth/types/UserRole'
import type { GetAdminUsersResponseDto } from '../types/AdminUserResponseDto'

export async function getAdminUsers(
  role?: UserRole
): Promise<GetAdminUsersResponseDto> {
  const { data } = await apiClient.get<GetAdminUsersResponseDto>(
    ENDPOINTS.ADMIN_USERS.LIST,
    { params: role ? { role } : undefined }
  )
  return data
}
