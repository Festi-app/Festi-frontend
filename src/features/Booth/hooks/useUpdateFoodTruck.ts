import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFoodTruck } from '../apis/patchFoodTruck'
import { boothKeys } from './useBooths'
import type { UpdateFoodTruckRequestDto } from '../types/UpdateFoodTruckRequestDto'

export function useUpdateFoodTruck() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ boothId, body }: { boothId: string; body: UpdateFoodTruckRequestDto }) =>
      patchFoodTruck(boothId, body),
    onSuccess: (_, { boothId }) => {
      queryClient.invalidateQueries({ queryKey: boothKeys.detail(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.all })
    },
  })
}
