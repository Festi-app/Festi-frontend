import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function deleteBoothImage(boothId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.IMAGES.BOOTH(boothId))
}
