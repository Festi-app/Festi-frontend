import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteFoodTruck(boothId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.BOOTHS.FOOD_TRUCK_DETAIL(boothId))
}
