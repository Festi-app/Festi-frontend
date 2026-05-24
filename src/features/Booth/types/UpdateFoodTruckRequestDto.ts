import type { BoothCategory } from './BoothSummaryDto'

export interface UpdateFoodTruckRequestDto {
  name?: string
  category?: BoothCategory
  description?: string
  operatingHours?: string
  imageUrl?: string
}
