import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFestivalTimeline } from '../apis/deleteFestivalTimeline'
import { festivalKeys } from './useFestival'

export function useDeleteFestivalTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFestivalTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.timelines() })
    },
  })
}
