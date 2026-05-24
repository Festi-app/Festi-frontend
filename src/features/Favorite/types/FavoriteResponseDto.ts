import type { BoothSummaryDto } from './BoothSummaryDto'

export interface FavoriteResponseDto {
  id: string
  boothSummary: BoothSummaryDto
  createdAt: string
}

export type GetFavoritesResponseDto = FavoriteResponseDto[]
