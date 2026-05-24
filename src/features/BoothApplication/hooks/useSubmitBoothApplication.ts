import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postBoothApplication } from '../apis/postBoothApplication'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useSubmitBoothApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postBoothApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothApplicationKeys.mine() })
    },
  })
}
