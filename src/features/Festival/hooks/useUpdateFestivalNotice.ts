import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFestivalNotice } from '../apis/patchFestivalNotice'
import { festivalKeys } from './useFestival'
import type { PatchFestivalNoticeRequestDto, UUID } from '../types/festival'

export function useUpdateFestivalNotice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noticeId, body }: { noticeId: UUID; body: PatchFestivalNoticeRequestDto }) =>
      patchFestivalNotice(noticeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: festivalKeys.notices() })
    },
  })
}
