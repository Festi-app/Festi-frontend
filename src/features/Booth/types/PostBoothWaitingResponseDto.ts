import type { BoothSummaryDto } from './BoothSummaryDto'

export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED'

export interface PostBoothWaitingResponseDto {
  id: string
  boothSummary: BoothSummaryDto
  partySize: number
  status: WaitingStatus
  callCount: number
  registeredAt: string
}
