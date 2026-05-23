import { useQuery } from '@tanstack/react-query'
import { getLocations } from '../apis/getLocations'
import type { GetLocationsParams } from '../types/location'

export const locationKeys = {
  all: ['locations'] as const,
  list: (params?: GetLocationsParams) => ['locations', params] as const,
}

export function useLocations(params?: GetLocationsParams) {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => getLocations(params),
  })
}
