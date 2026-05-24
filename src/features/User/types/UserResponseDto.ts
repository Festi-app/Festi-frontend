export type UserRole = 'USER' | 'BOOTH_MANAGER' | 'FESTIVAL_ADMIN'

export interface UserResponseDto {
  id: string
  festivalId: string
  name: string
  phone: string
  role: UserRole
}
