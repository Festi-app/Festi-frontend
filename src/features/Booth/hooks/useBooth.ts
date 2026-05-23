import { useQuery } from '@tanstack/react-query'
import { getBooth } from '../apis/getBooth'
import { boothKeys } from './useBooths'
export function useBooth(boothId: string) {
  return useQuery({
    queryKey: boothKeys.detail(boothId),
    queryFn: () => getBooth(boothId),
    staleTime: 1000 * 60 * 3,
  })
}
