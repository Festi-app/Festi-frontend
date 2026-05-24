import { useQuery } from '@tanstack/react-query'
import { getFestivalDays } from '../apis/getFestivalDays'
import { festivalKeys } from './useFestival'

export function useFestivalDays() {
  return useQuery({
    queryKey: festivalKeys.days(),
    queryFn: getFestivalDays,
    staleTime: 1000 * 60 * 10,
  })
}
