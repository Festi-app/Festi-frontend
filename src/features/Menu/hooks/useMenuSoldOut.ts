import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postMenuSoldOut } from '../apis/postMenuSoldOut'
import { menuKeys } from './useMenus'
import { boothKeys } from '../../Booth/hooks/useBooths'

export function useMenuSoldOut(boothId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (menuId: string) => postMenuSoldOut(boothId, menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.menus(boothId) })
    },
  })
}
