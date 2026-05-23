import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postMenu } from '../apis/postMenu'
import { menuKeys } from './useMenus'
import type { MenusResponseDto } from '../types/MenusResponseDto'

export function useCreateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: MenusResponseDto) => postMenu(boothId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
