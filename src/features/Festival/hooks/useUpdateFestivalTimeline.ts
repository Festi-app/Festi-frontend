import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalTimeline } from '../apis/patchFestivalTimeline'
import { festivalKeys } from './useFestival'
import type { FestivalTimelineRequestDto } from '../types/FestivalTimelineRequestDto'

export function useUpdateFestivalTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      timelineId,
      body,
    }: {
      timelineId: string
      body: FestivalTimelineRequestDto
    }) => patchFestivalTimeline(timelineId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.timelines() })
    },
  })
}
