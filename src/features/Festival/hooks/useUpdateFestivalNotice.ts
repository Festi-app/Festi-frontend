import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalNotice } from '../apis/patchFestivalNotice'
import { festivalKeys } from './useFestival'
import type { FestivalNoticeRequestDto } from '../types/FestivalNoticeRequestDto'

export function useUpdateFestivalNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      noticeId,
      body,
    }: {
      noticeId: string
      body: FestivalNoticeRequestDto
    }) => patchFestivalNotice(noticeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.notices() })
    },
  })
}
