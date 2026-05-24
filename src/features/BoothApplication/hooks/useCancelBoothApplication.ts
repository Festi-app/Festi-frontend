import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteBoothApplication } from '../apis/deleteBoothApplication'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useCancelBoothApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBoothApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothApplicationKeys.mine() })
    },
  })
}
