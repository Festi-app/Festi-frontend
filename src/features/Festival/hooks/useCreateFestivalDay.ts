import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFestivalDay } from '../apis/postFestivalDay'
import { festivalKeys } from './useFestival'

export function useCreateFestivalDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFestivalDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.all })
    },
  })
}
