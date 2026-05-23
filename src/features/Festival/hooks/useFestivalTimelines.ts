import { useQuery } from '@tanstack/react-query'
import { getFestivalTimelines } from '../apis/getFestivalTimelines'
import { festivalKeys } from './useFestival'

export function useFestivalTimelines() {
  return useQuery({
    queryKey: festivalKeys.timelines(),
    queryFn: getFestivalTimelines,
    staleTime: 1000 * 60 * 10,
  })
}
