import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postBooth } from '../apis/postBooth'
import { boothKeys } from './useBooths'

export function useCreateBooth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postBooth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothKeys.all })
    },
  })
}
