import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalDay } from '../apis/patchFestivalDay'
import { festivalKeys } from './useFestival'
import type { FestivalDayRequestDto } from '../types/FestivalDayRequestDto'

export function useUpdateFestivalDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      festivalDayId,
      body,
    }: {
      festivalDayId: string
      body: FestivalDayRequestDto
    }) => patchFestivalDay(festivalDayId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.all })
    },
  })
}
