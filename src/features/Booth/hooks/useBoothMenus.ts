import { useQuery } from '@tanstack/react-query'
import { getBoothMenus } from '../apis/getBoothMenus'
import { boothKeys } from './useBooths'
import type { UUID } from '../types/booth'

export function useBoothMenus(boothId: UUID) {
  return useQuery({
    queryKey: boothKeys.menus(boothId),
    queryFn: () => getBoothMenus(boothId),
    staleTime: 1000 * 60 * 10,
  })
}
