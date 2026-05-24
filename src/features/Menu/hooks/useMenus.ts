import { useQuery } from '@tanstack/react-query'
import { getMenus } from '../apis/getMenus'

export const menuKeys = {
  all: ['menus'] as const,
  list: (boothId: string) => ['menus', boothId] as const,
}

export function useMenus(boothId: string) {
  return useQuery({
    queryKey: menuKeys.list(boothId),
    queryFn: () => getMenus(boothId),
    enabled: !!boothId,
  })
}
