import { apiClient } from '../../../lib/apiClient'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PatchFestivalRequestDto, PatchFestivalResponseDto } from '../types/festival'

export async function patchFestival(body: PatchFestivalRequestDto): Promise<PatchFestivalResponseDto> {
  const { data } = await apiClient.patch<PatchFestivalResponseDto>(ENDPOINTS.FESTIVAL.ROOT, body)
  return data
}
