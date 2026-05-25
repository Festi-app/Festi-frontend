import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchMenu } from '../apis/patchMenu'
import { menuKeys } from './useMenus'
import { boothKeys } from '../../Booth/hooks/useBooths'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export function useUpdateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      menuId,
      body,
    }: {
      menuId: string
      body: Partial<MenusResponseDto>
    }) => patchMenu(boothId, menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.menus(boothId) })
    },
  })
}
