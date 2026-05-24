import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLocationAssignment } from '../apis/postLocationAssignment'
import { locationKeys } from './useLocations'
import type { PostLocationAssignmentRequestDto } from '../types/PostLocationAssignmentRequestDto'

export function useAssignBooth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      locationId,
      body,
    }: {
      locationId: string
      body: PostLocationAssignmentRequestDto
    }) => postLocationAssignment(locationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}
