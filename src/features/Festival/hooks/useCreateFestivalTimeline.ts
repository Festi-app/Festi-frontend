import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFestivalTimeline } from '../apis/postFestivalTimeline'
import { festivalKeys } from './useFestival'

export function useCreateFestivalTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFestivalTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.timelines() })
    },
  })
}
