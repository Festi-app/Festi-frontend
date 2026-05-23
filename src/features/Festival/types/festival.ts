export type UUID = string
export type LocalDate = string
export type LocalTime = string
export type OffsetDateTime = string

// ─── Festival ────────────────────────────────────────────────────────────────

export interface GetFestivalResponseDto {
  id: UUID
  name: string
  startDate: LocalDate
  endDate: LocalDate
  description: string | null
}

export interface PatchFestivalRequestDto {
  name?: string
  startDate?: LocalDate
  endDate?: LocalDate
  description?: string
}

export type PatchFestivalResponseDto = GetFestivalResponseDto

// ─── Festival Days ────────────────────────────────────────────────────────────

export interface FestivalDayResponseDto {
  id: UUID
  day: LocalDate
  dayStart: LocalTime
  dayEnd: LocalTime
  nightStart: LocalTime
  nightEnd: LocalTime
}

export interface PostFestivalDayRequestDto {
  day: LocalDate
  dayStart: LocalTime
  dayEnd: LocalTime
  nightStart: LocalTime
  nightEnd: LocalTime
}

export type PatchFestivalDayRequestDto = PostFestivalDayRequestDto
export type PostFestivalDayResponseDto = FestivalDayResponseDto
export type PatchFestivalDayResponseDto = FestivalDayResponseDto

// ─── Notices ─────────────────────────────────────────────────────────────────

export interface NoticeResponseDto {
  id: UUID
  title: string
  content: string
  pinned: boolean
  createdAt: OffsetDateTime
}

export type GetFestivalNoticesResponseDto = NoticeResponseDto[]

export interface PostFestivalNoticeRequestDto {
  title: string
  content: string
  pinned: boolean
}

export type PatchFestivalNoticeRequestDto = PostFestivalNoticeRequestDto
export type PostFestivalNoticeResponseDto = NoticeResponseDto
export type PatchFestivalNoticeResponseDto = NoticeResponseDto

// ─── Timelines ───────────────────────────────────────────────────────────────

export interface FestivalDaySummaryDto {
  id: UUID
  day: LocalDate
}

export interface TimelineResponseDto {
  id: UUID
  festivalDay: FestivalDaySummaryDto
  title: string
  artist: string
  startTime: LocalTime
  endTime: LocalTime
}

export type GetFestivalTimelinesResponseDto = TimelineResponseDto[]

export interface PostFestivalTimelineRequestDto {
  festivalDayId: UUID
  title: string
  artist: string
  startTime: LocalTime
  endTime: LocalTime
}

export type PatchFestivalTimelineRequestDto = PostFestivalTimelineRequestDto
export type PostFestivalTimelineResponseDto = TimelineResponseDto
export type PatchFestivalTimelineResponseDto = TimelineResponseDto
