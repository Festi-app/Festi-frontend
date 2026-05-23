import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchFestivalDayRequestDto, PatchFestivalDayResponseDto, UUID } from '../types/festival'

export async function patchFestivalDay(
  festivalDayId: UUID,
  body: PatchFestivalDayRequestDto
): Promise<PatchFestivalDayResponseDto> {
  const { data } = await apiClient.patch<PatchFestivalDayResponseDto>(
    ENDPOINTS.FESTIVAL.DAY_DETAIL(festivalDayId),
    body
  )
  return data
}
