export interface FestivalDaySummaryDto {
  id: string
  day: string
}

export interface TimelineResponseDto {
  id: string
  festivalDay: FestivalDaySummaryDto
  title: string
  artist: string
  startTime: string
  endTime: string
}

export type GetFestivalTimelinesResponseDto = TimelineResponseDto[]
