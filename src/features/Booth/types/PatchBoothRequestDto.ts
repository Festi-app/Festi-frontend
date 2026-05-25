import type { BoothCategory } from '../../../types/common'

export interface PatchBoothRequestDto {
  name?: string
  description?: string
  operatingHours?: string
  imageUrl?: string
  category?: BoothCategory
}
