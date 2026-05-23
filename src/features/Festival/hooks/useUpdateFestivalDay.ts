import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalDay } from '../apis/patchFestivalDay'
import { festivalKeys } from './useFestival'
import type { PatchFestivalDayRequestDto, UUID } from '../types/festival'

export function useUpdateFestivalDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ festivalDayId, body }: { festivalDayId: UUID; body: PatchFestivalDayRequestDto }) =>
      patchFestivalDay(festivalDayId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.all })
    },
  })
}
