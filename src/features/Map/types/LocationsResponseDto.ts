import type { BoothType, BoothSummary, FestivalDaySummary } from '../../../types/common'

export interface GetLocationsResponseDto {
  id: number
  type: BoothType
  index: number
  festivalDay: FestivalDaySummary
  zoneLabel: string
  boothSummary: BoothSummary | null
}
