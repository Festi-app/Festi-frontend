import { useQuery } from '@tanstack/react-query'
import { getUsersMe } from '../apis/getUsersMe'

export const userKeys = {
  all: ['user'] as const,
  me: () => ['user', 'me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getUsersMe,
    staleTime: 1000 * 60 * 5,
  })
}
