import type { BoothType } from '../../../types/common'

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface BoothApplicationResponseDto {
  id: string
  festivalId?: string
  boothType: BoothType
  boothName: string
  boothCategory?: string
  description?: string
  operatingHours?: string
  imageUrl?: string
  status: ApplicationStatus
  reviewMemo?: string
  applicantId: string
  boothId?: string
  createdAt: string
  updatedAt: string
}
