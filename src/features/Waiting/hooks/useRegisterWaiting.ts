import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postWaiting } from '../apis/postWaiting'
import { waitingKeys } from './useMyWaitings'
import type { PostWaitingRequestDto } from '../types/PostWaitingRequestDto'

export function useRegisterWaiting(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: PostWaitingRequestDto) => postWaiting(boothId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.my() })
      queryClient.invalidateQueries({ queryKey: waitingKeys.booth(boothId) })
    },
  })
}
