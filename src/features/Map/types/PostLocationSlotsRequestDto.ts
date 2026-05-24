import type { BoothType } from '../../../types/common'

export interface ZoneSlotsRequest {
  zoneLabel: string
  count: number
}

export interface PostLocationSlotsRequestDto {
  festivalDayId: string
  type: BoothType
  zones: ZoneSlotsRequest[]
}
