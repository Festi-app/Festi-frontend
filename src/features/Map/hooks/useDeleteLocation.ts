import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteLocation } from '../apis/deleteLocation'
import { locationKeys } from './useLocations'

export function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (locationId: string) => deleteLocation(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
