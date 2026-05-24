import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLocationSlots } from '../apis/postLocationSlots'
import { locationKeys } from './useLocations'

export function useCreateLocationSlots() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postLocationSlots,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
