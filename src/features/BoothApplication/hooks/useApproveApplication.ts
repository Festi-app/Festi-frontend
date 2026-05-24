import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApproveApplication } from '../apis/postApproveApplication'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useApproveApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => postApproveApplication(applicationId),
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: boothApplicationKeys.adminList() })
      queryClient.invalidateQueries({
        queryKey: boothApplicationKeys.adminDetail(applicationId),
      })
    },
  })
}
