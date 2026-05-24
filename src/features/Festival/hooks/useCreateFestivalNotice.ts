import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFestivalNotice } from '../apis/postFestivalNotice'
import { festivalKeys } from './useFestival'

export function useCreateFestivalNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFestivalNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.notices() })
    },
  })
}
