export type UUID = string

export type UserRole = 'USER' | 'BOOTH_MANAGER' | 'FESTIVAL_ADMIN'

export interface UserResponseDto {
  id: string
  festivalId: UUID
  name: string
  phone: string
  role: UserRole
}

export type GetUsersMeResponseDto = UserResponseDto

export interface PatchUsersMeRequestDto {
  name?: string
  phone?: string
}

export type PatchUsersMeResponseDto = UserResponseDto
