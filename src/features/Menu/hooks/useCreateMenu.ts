import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postMenu } from '../apis/postMenu'
import { menuKeys } from './useMenus'
import type { CreateMenuBody } from '../types/menu'

export function useCreateMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateMenuBody) => postMenu(boothId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
