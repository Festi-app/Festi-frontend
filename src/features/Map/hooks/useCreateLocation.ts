import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLocation } from '../apis/postLocation'
import { locationKeys } from './useLocations'

export function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
