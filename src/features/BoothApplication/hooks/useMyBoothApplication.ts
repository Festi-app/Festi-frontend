import { useQuery } from '@tanstack/react-query'
import { getMyBoothApplication } from '../apis/getMyBoothApplication'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useMyBoothApplication() {
  return useQuery({
    queryKey: boothApplicationKeys.mine(),
    queryFn: getMyBoothApplication,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  })
}
