import type { WaitingStatus } from './WaitingResponseDto'

export interface PatchWaitingStatusRequestDto {
  status: WaitingStatus
}
