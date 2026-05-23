import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFestivalNotice } from '../apis/deleteFestivalNotice'
import { festivalKeys } from './useFestival'

export function useDeleteFestivalNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFestivalNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.notices() })
    },
  })
}
