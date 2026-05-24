import type { BoothCategory } from './BoothSummaryDto'

export interface PostBoothRequestDto {
  name: string
  category?: BoothCategory
  description?: string
  operatingHours?: string
  imageUrl?: string
}
