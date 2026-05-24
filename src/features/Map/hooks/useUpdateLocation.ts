import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchLocation } from '../apis/patchLocation'
import { locationKeys } from './useLocations'
import type { PatchLocationRequestDto } from '../types/PatchLocationRequestDto'

export function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      locationId,
      body,
    }: {
      locationId: string
      body: PatchLocationRequestDto
    }) => patchLocation(locationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
