import type { BoothSummary } from './BoothSummaryDto'

export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED'

export interface WaitingResponseDto {
  id: string
  boothSummary?: BoothSummary
  partySize: number
  status: WaitingStatus
  callCount: number
  registeredAt: string
}
