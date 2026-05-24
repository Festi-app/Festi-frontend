import type { UserRole } from '../../Auth/types/UserRole'

export const adminUserKeys = {
  all: ['adminUsers'] as const,
  list: (role?: UserRole) => ['adminUsers', 'list', role ?? 'all'] as const,
}
