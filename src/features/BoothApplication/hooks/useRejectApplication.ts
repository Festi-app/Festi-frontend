import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postRejectApplication } from '../apis/postRejectApplication'
import { boothApplicationKeys } from './boothApplicationKeys'
import type { RejectApplicationRequestDto } from '../types/RejectApplicationRequestDto'

export function useRejectApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string
      body: RejectApplicationRequestDto
    }) => postRejectApplication(applicationId, body),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: boothApplicationKeys.adminList() })
      queryClient.invalidateQueries({
        queryKey: boothApplicationKeys.adminDetail(applicationId),
      })
    },
  })
}
