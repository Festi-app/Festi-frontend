import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFestivalDay } from '../apis/deleteFestivalDay'
import { festivalKeys } from './useFestival'

export function useDeleteFestivalDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFestivalDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.all })
    },
  })
}
