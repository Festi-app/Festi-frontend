import { useMutation } from '@tanstack/react-query'
import { postBoothWaiting } from '../apis/postBoothWaiting'
import type { PostBoothWaitingRequestDto } from '../types/PostBoothWaitingRequestDto'

export function useRegisterWaiting() {
  return useMutation({
    mutationFn: ({
      boothId,
      body,
    }: {
      boothId: string
      body: PostBoothWaitingRequestDto
    }) => postBoothWaiting(boothId, body),
  })
}
