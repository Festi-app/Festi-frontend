import { useQuery } from '@tanstack/react-query'
import { getFestival } from '../apis/getFestival'

export const festivalKeys = {
  all: ['festival'] as const,
  root: () => ['festival', 'root'] as const,
  notices: () => ['festival', 'notices'] as const,
  timelines: () => ['festival', 'timelines'] as const,
}

export function useFestival() {
  return useQuery({
    queryKey: festivalKeys.root(),
    queryFn: getFestival,
    staleTime: 1000 * 60 * 10,
  })
}
