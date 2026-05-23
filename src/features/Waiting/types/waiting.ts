export type WaitingStatus = 'waiting' | 'called' | 'seated' | 'cancelled'

export interface Waiting {
  id: string
  boothId: string
  userId: string
  partySize: number
  status: WaitingStatus
  callCount: number
  registeredAt: string
  updatedAt: string
}

export interface RegisterWaitingBody {
  partySize: number
}

export interface UpdateWaitingStatusBody {
  status: WaitingStatus
}

export interface ToggleBoothWaitingBody {
  isOpen: boolean
}
