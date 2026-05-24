import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchWaitingStatus } from '../apis/patchWaitingStatus'
import { waitingKeys } from './useMyWaitings'
import type { PatchWaitingStatusRequestDto } from '../types/PatchWaitingStatusRequestDto'

export function useUpdateWaitingStatus(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      waitingId,
      body,
    }: {
      waitingId: string
      body: PatchWaitingStatusRequestDto
    }) => patchWaitingStatus(waitingId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.booth(boothId) })
    },
  })
}
