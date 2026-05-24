import type { BoothType } from '../../../types/common'

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface BoothApplicationResponseDto {
  id: string
  boothType: BoothType
  name: string
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
