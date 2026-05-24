import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { PostLocationAssignmentRequestDto } from '../types/PostLocationAssignmentRequestDto'

export async function postLocationAssignment(
  locationId: string,
  body: PostLocationAssignmentRequestDto
): Promise<void> {
  await apiClient.post(ENDPOINTS.LOCATIONS.ASSIGNMENT(locationId), body)
}
