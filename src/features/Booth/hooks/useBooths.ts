import { useQuery } from '@tanstack/react-query'
import { getBooths } from '../apis/getBooths'
import type { GetBoothsRequestDto } from '../types/booth'

export const boothKeys = {
  all: ['booths'] as const,
  list: (params?: GetBoothsRequestDto) => ['booths', 'list', params] as const,
  detail: (boothId: string) => ['booths', 'detail', boothId] as const,
  menus: (boothId: string) => ['booths', 'menus', boothId] as const,
}

export function useBooths(params?: GetBoothsRequestDto) {
  return useQuery({
    queryKey: boothKeys.list(params),
    queryFn: () => getBooths(params),
    staleTime: 1000 * 60 * 3,
  })
}
