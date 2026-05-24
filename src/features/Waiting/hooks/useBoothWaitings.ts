import { useQuery } from '@tanstack/react-query'
import { getBoothWaitings } from '../apis/getBoothWaitings'
import { waitingKeys } from './useMyWaitings'

export function useBoothWaitings(boothId: string) {
  return useQuery({
    queryKey: waitingKeys.booth(boothId),
    queryFn: () => getBoothWaitings(boothId),
    enabled: !!boothId,
  })
}
