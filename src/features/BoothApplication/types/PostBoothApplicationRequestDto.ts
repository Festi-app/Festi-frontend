import type { BoothType, BoothCategory } from '../../../types/common'

export interface PostBoothApplicationRequestDto {
  id: string
  password: string
  name: string
  phone: string
  boothName: string
  boothType: BoothType
  boothCategory?: BoothCategory
  imageUrl?: string
  description?: string
}
