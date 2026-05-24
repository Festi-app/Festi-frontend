import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { RejectApplicationRequestDto } from '../types/RejectApplicationRequestDto'
import type { BoothApplicationResponseDto } from '../types/BoothApplicationResponseDto'

export async function postRejectApplication(
  applicationId: string,
  body: RejectApplicationRequestDto
): Promise<BoothApplicationResponseDto> {
  const { data } = await apiClient.post<BoothApplicationResponseDto>(
    ENDPOINTS.BOOTH_APPLICATIONS.REJECT(applicationId),
    body
  )
  return data
}
