import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Waiting } from '../types/waiting'

export async function getBoothWaitings(boothId: string): Promise<Waiting[]> {
  const { data } = await apiClient.get<Waiting[]>(ENDPOINTS.BOOTHS.WAITINGS(boothId))
  return data
}
