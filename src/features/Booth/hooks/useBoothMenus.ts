import { useQuery } from '@tanstack/react-query'
import { getBoothMenus } from '../apis/getBoothMenus'
import { boothKeys } from './useBooths'
export function useBoothMenus(boothId: string | null) {
  return useQuery({
    queryKey: boothKeys.menus(boothId ?? ''),
    queryFn: () => getBoothMenus(boothId!),
    enabled: !!boothId,
    staleTime: 1000 * 60 * 10,
  })
}
