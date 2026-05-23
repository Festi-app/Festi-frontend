import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import type { Waiting, RegisterWaitingBody } from '../types/waiting'

export async function postWaiting(
  boothId: string,
  body: RegisterWaitingBody
): Promise<Waiting> {
  const { data } = await apiClient.post<Waiting>(
    ENDPOINTS.BOOTHS.WAITINGS(boothId),
    body
  )
  return data
}
