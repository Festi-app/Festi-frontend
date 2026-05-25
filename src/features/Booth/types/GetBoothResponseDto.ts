import type { BoothType, BoothCategory } from './BoothSummaryDto'

export interface GetBoothResponseDto {
  id: string
  name: string
  category: BoothCategory
  type: BoothType
  description: string | null
  operatingHours: string | null
  imageUrl: string | null
  isWaitingOpen: boolean
  waitingTeamCount?: number | null
}
