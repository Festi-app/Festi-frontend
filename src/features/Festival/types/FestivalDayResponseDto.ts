export interface FestivalDayResponseDto {
  id: string
  day: string
  dayStart: string
  dayEnd: string
  nightStart: string
  nightEnd: string
}

// GET /api/festival/days 리스트 응답
export interface FestivalDaySummaryResponseDto {
  festivalDayId: string
  day: string
}

export type GetFestivalDaysResponseDto = FestivalDaySummaryResponseDto[]
