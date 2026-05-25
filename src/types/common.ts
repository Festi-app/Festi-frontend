export type UserRole = 'USER' | 'BOOTH_MANAGER' | 'FESTIVAL_ADMIN'
export type BoothType = 'DAY' | 'NIGHT' | 'FOOD_TRUCK'
export type BoothCategory =
  | 'ACTIVITY'
  | 'INFO'
  | 'MARKET'
  | 'EXPERIENCE'
  | 'PROMOTION'
  | 'ALCOHOL'
export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED'

export interface BoothSummary {
  id: string
  name: string
  category: BoothCategory
  type: BoothType
  imageUrl: string
  isWaitingOpen: boolean
  waitingTeamCount?: number | null
  description?: string | null
}

export interface FestivalDaySummary {
  id: string
  day: string
}
