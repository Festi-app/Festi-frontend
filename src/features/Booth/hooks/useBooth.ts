import { useQuery } from '@tanstack/react-query'
import { getBooth } from '../apis/getBooth'
import { boothKeys } from './useBooths'
import type { UUID } from '../types/booth'

export function useBooth(boothId: UUID) {
  return useQuery({
    queryKey: boothKeys.detail(boothId),
    queryFn: () => getBooth(boothId),
    staleTime: 1000 * 60 * 3,
  })
}
