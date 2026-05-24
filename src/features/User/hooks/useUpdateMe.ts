import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchUsersMe } from '../apis/patchUsersMe'
import { userKeys } from './useMe'

export function useUpdateMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patchUsersMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}
