import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Waiting } from '../types/waiting'

export async function getMyWaitings(): Promise<Waiting[]> {
  const { data } = await apiClient.get<Waiting[]>(ENDPOINTS.WAITINGS.LIST)
  return data
}
