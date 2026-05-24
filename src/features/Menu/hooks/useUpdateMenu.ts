import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchMenu } from '../apis/patchMenu'
import { menuKeys } from './useMenus'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export function useUpdateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      menuId,
      body,
    }: {
      menuId: string
      body: MenusResponseDto
    }) => patchMenu(boothId, menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
