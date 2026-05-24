import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { postLogin } from '../apis/postLogin'
import { apiClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'
import { ROUTES } from '../../../constants/routes'
import type { PostLoginRequestDto } from '../types/PostLoginRequestDto'
import type { UserResponseDto } from '../types/UserResponseDto'

export function useLogin() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (body: PostLoginRequestDto) => {
      localStorage.removeItem('token')
      const { accessToken } = await postLogin(body)
      localStorage.setItem('token', accessToken)
      try {
        const { data } = await apiClient.get<UserResponseDto>(
          ENDPOINTS.USERS.ME
        )
        return data
      } catch {
        return null
      }
    },
    onSuccess: (user) => {
      if (user?.role === 'FESTIVAL_ADMIN') {
        navigate(ROUTES.ADMIN.FESTIVAL, { replace: true })
      } else if (user?.role === 'BOOTH_MANAGER') {
        navigate(ROUTES.BOOTH_ADMIN.DASHBOARD, { replace: true })
      } else {
        navigate(ROUTES.HOME, { replace: true })
      }
    },
  })
}
