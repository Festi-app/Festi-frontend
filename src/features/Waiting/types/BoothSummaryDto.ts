export type BoothType = 'DAY' | 'NIGHT' | 'FOOD_TRUCK'
export type BoothCategory =
  | 'ACTIVITY'
  | 'INFO'
  | 'MARKET'
  | 'EXPERIENCE'
  | 'PROMOTION'
  | 'ALCOHOL'

export interface BoothSummary {
  id: string
  name: string
  category: BoothCategory
  type: BoothType
  description?: string
  imageUrl: string
  isWaitingOpen: boolean
}
