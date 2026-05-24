import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { WaitingResponseDto } from '../types/WaitingResponseDto'

export async function getMyWaitings(): Promise<WaitingResponseDto[]> {
  const { data } = await apiClient.get<WaitingResponseDto[]>(
    ENDPOINTS.WAITINGS.LIST
  )
  return data
}
