import { useMutation } from '@tanstack/react-query'
import { postSignup } from '../apis/postSignup'
import type { PostSignupRequestDto } from '../types/PostSignupRequestDto'

export function useSignup() {
  return useMutation({
    mutationFn: (body: PostSignupRequestDto) => postSignup(body),
  })
}
