import type { BoothType, BoothCategory } from './BoothSummaryDto'

export interface GetBoothsRequestDto {
  day?: string
  type?: BoothType
  category?: BoothCategory
}
