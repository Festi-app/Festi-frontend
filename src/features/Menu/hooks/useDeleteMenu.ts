import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMenu } from '../apis/deleteMenu'
import { menuKeys } from './useMenus'

export function useDeleteMenu(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (menuId: string) => deleteMenu(boothId, menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
    },
  })
}
