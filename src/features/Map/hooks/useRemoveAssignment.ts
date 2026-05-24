import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteLocationAssignment } from '../apis/deleteLocationAssignment'
import { locationKeys } from './useLocations'

export function useRemoveAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (locationId: string) => deleteLocationAssignment(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
