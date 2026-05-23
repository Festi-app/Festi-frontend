import type { BoothSummaryDto, UUID } from '../../Booth/types/booth'

export type { UUID }
export type OffsetDateTime = string

export interface FavoriteResponseDto {
  id: UUID
  boothSummary: BoothSummaryDto
  createdAt: OffsetDateTime
}

export type GetFavoritesResponseDto = FavoriteResponseDto[]

export interface PostFavoriteRequestDto {
  boothId: UUID
}

export type PostFavoriteResponseDto = FavoriteResponseDto
