import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchMenu } from '../apis/patchMenu'
import { menuKeys } from './useMenus'
import type { PatchMenuRequestDto } from '../types/PatchMenuRequestDto'

export function useUpdateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      menuId,
      body,
    }: {
      menuId: string
      body: PatchMenuRequestDto
    }) => patchMenu(boothId, menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
