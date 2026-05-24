import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { BoothApplicationResponseDto } from '../types/BoothApplicationResponseDto'

export async function getBoothApplications(): Promise<BoothApplicationResponseDto[]> {
  const { data } = await apiClient.get<BoothApplicationResponseDto[]>(
    ENDPOINTS.BOOTH_APPLICATIONS.ADMIN_LIST
  )
  return data
}
