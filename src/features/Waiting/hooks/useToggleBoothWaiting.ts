import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchBoothWaitingsStatus } from '../apis/patchBoothWaitingsStatus'
import { waitingKeys } from './useMyWaitings'
import type { PatchBoothWaitingsStatusRequestDto } from '../types/PatchBoothWaitingsStatusRequestDto'

export function useToggleBoothWaiting(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: PatchBoothWaitingsStatusRequestDto) =>
      patchBoothWaitingsStatus(boothId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.booth(boothId) })
    },
  })
}
