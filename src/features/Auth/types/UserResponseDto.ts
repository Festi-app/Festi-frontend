import type { UserRole } from './UserRole'

export interface UserResponseDto {
  id: string
  festivalId: string
  name: string
  phone: string
  role: UserRole
}
