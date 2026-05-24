import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { BoothApplicationResponseDto } from '../types/BoothApplicationResponseDto'

export async function postApproveApplication(
  applicationId: string
): Promise<BoothApplicationResponseDto> {
  const { data } = await apiClient.post<BoothApplicationResponseDto>(
    ENDPOINTS.BOOTH_APPLICATIONS.APPROVE(applicationId)
  )
  return data
}
