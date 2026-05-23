import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchMenu } from '../apis/patchMenu'
import { menuKeys } from './useMenus'
import type { UpdateMenuBody } from '../types/menu'

export function useUpdateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ menuId, body }: { menuId: string; body: UpdateMenuBody }) =>
      patchMenu(boothId, menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
