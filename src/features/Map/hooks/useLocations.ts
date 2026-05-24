import { useQuery } from '@tanstack/react-query'
import { getLocations } from '../apis/getLocations'
import type { GetLocationsRequestDto } from '../types/GetLocationsRequestDto'

export const locationKeys = {
  all: ['locations'] as const,
  list: (params: GetLocationsRequestDto) => ['locations', params] as const,
}

export function useLocations(params: GetLocationsRequestDto) {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => getLocations(params),
    enabled: !!params.day,
  })
}
