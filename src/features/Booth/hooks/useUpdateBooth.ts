import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchBooth } from '../apis/patchBooth'
import { boothKeys } from './useBooths'
import type { PatchBoothRequestDto } from '../types/PatchBoothRequestDto'

export function useUpdateBooth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      boothId,
      body,
    }: {
      boothId: string
      body: PatchBoothRequestDto
    }) => patchBooth(boothId, body),
    onSuccess: (_, { boothId }) => {
      queryClient.invalidateQueries({ queryKey: boothKeys.detail(boothId) })
    },
  })
}
