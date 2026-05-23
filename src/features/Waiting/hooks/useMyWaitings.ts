import { useQuery } from '@tanstack/react-query'
import { getMyWaitings } from '../apis/getMyWaitings'

export const waitingKeys = {
  all: ['waitings'] as const,
  my: () => ['waitings', 'my'] as const,
  booth: (boothId: string) => ['waitings', 'booth', boothId] as const,
}

export function useMyWaitings() {
  return useQuery({
    queryKey: waitingKeys.my(),
    queryFn: getMyWaitings,
  })
}
