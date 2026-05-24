import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { UpdateFoodTruckRequestDto } from '../types/UpdateFoodTruckRequestDto'
import type { GetBoothResponseDto } from '../types/GetBoothResponseDto'

export async function patchFoodTruck(
  boothId: string,
  body: UpdateFoodTruckRequestDto
): Promise<GetBoothResponseDto> {
  const { data } = await apiClient.patch<GetBoothResponseDto>(
    ENDPOINTS.BOOTHS.FOOD_TRUCK_DETAIL(boothId),
    body
  )
  return data
}
