import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWaiting } from '../apis/deleteWaiting'
import { waitingKeys } from './useMyWaitings'

export function useCancelWaiting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (waitingId: string) => deleteWaiting(waitingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.all })
    },
  })
}
