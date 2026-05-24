import { useQuery } from '@tanstack/react-query'
import { getFestivalNotices } from '../apis/getFestivalNotices'
import { festivalKeys } from './useFestival'

export function useFestivalNotices() {
  return useQuery({
    queryKey: festivalKeys.notices(),
    queryFn: getFestivalNotices,
    staleTime: 1000 * 60 * 5,
  })
}
