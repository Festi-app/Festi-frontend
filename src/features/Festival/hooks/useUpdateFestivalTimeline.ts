import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalTimeline } from '../apis/patchFestivalTimeline'
import { festivalKeys } from './useFestival'
import type { PatchFestivalTimelineRequestDto, UUID } from '../types/festival'

export function useUpdateFestivalTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ timelineId, body }: { timelineId: UUID; body: PatchFestivalTimelineRequestDto }) =>
      patchFestivalTimeline(timelineId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.timelines() })
    },
  })
}
