import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
export async function deleteFestivalNotice(noticeId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.FESTIVAL.NOTICE_DETAIL(noticeId))
}
