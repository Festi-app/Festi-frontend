import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestival } from '../apis/patchFestival'
import { festivalKeys } from './useFestival'

export function useUpdateFestival() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patchFestival,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.root() })
    },
  })
}
