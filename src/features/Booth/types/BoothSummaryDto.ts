export type BoothType = 'DAY' | 'NIGHT' | 'FOOD_TRUCK'

export type BoothCategory =
  | 'ACTIVITY'
  | 'INFO'
  | 'MARKET'
  | 'EXPERIENCE'
  | 'PROMOTION'
  | 'ALCOHOL'

export interface BoothSummaryDto {
  id: string
  name: string
  category: BoothCategory
  type: BoothType
  description: string | null
  imageUrl: string | null
  isWaitingOpen: boolean
  location: string | null
}
