import { useMutation } from '@tanstack/react-query'
import { postBoothWaiting } from '../apis/postBoothWaiting'
import type { PostBoothWaitingRequestDto, UUID } from '../types/booth'

export function useRegisterWaiting() {
  return useMutation({
    mutationFn: ({ boothId, body }: { boothId: UUID; body: PostBoothWaitingRequestDto }) =>
      postBoothWaiting(boothId, body),
  })
}
