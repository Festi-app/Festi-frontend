import { useQuery } from '@tanstack/react-query'
import { getFavorites } from '../apis/getFavorites'

export const favoriteKeys = {
  all: ['favorites'] as const,
  list: () => ['favorites', 'list'] as const,
}

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 5,
  })
}
