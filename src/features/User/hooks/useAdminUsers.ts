import { useQuery } from '@tanstack/react-query'
import { getAdminUsers } from '../apis/getAdminUsers'
import { adminUserKeys } from './adminUserKeys'
import type { UserRole } from '../../Auth/types/UserRole'

export function useAdminUsers(role?: UserRole) {
  return useQuery({
    queryKey: adminUserKeys.list(role),
    queryFn: () => getAdminUsers(role),
    staleTime: 1000 * 60 * 5,
  })
}
