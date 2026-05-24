import type { UserRole } from '../../Auth/types/UserRole'

export interface AdminUserResponseDto {
  id: string
  name: string
  phone: string
  role: UserRole
}

export type GetAdminUsersResponseDto = AdminUserResponseDto[]
