import { useMutation } from '@tanstack/react-query'
import { postLogin } from '../apis/postLogin'
import type { PostLoginRequestDto } from '../types/PostLoginRequestDto'

export function useLogin() {
  return useMutation({
    mutationFn: (body: PostLoginRequestDto) => postLogin(body),
    onSuccess: ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
  })
}
