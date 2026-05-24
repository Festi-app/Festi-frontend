import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postWaitingCall } from '../apis/postWaitingCall'
import { waitingKeys } from './useMyWaitings'

export function useCallWaiting(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (waitingId: string) => postWaitingCall(waitingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.booth(boothId) })
    },
  })
}
