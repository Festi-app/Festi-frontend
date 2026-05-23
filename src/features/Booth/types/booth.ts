export type UUID = string
export type LocalDate = string

export type BoothType = 'DAY' | 'NIGHT' | 'FOOD_TRUCK'
export type BoothCategory =
  | 'ACTIVITY'
  | 'INFO'
  | 'MARKET'
  | 'EXPERIENCE'
  | 'PROMOTION'
  | 'ALCOHOL'

export interface BoothSummaryDto {
  id: UUID
  name: string
  category: BoothCategory
  type: BoothType
  imageUrl: string
  isWaitingOpen: boolean
}

export interface GetBoothsRequestDto {
  day?: LocalDate
  type?: BoothType
  category?: BoothCategory
}

export type GetBoothsResponseDto = BoothSummaryDto[]

export interface GetBoothResponseDto {
  id: UUID
  name: string
  category: BoothCategory
  type: BoothType
  description: string
  operatingHours: string
  imageUrl: string
  isWaitingOpen: boolean
}

export interface MenuResponseDto {
  id: UUID
  name: string
  price: number
  description: string
  imageUrl: string
  isSoldOut: boolean
  sortOrder: number
}

export type GetBoothMenusResponseDto = MenuResponseDto[]

// ─── Waiting ─────────────────────────────────────────────────────────────────

export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED'
export type OffsetDateTime = string

export interface PostBoothWaitingRequestDto {
  partySize: number
}

export interface PostBoothWaitingResponseDto {
  id: UUID
  boothSummary: BoothSummaryDto
  partySize: number
  status: WaitingStatus
  callCount: number
  registeredAt: OffsetDateTime
}
