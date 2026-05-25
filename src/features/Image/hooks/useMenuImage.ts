import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putMenuImage } from '../apis/putMenuImage'
import { deleteMenuImage } from '../apis/deleteMenuImage'
import { menuKeys } from '../../Menu/hooks/useMenus'
import { boothKeys } from '../../Booth/hooks/useBooths'

export function useUploadMenuImage(boothId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, file }: { menuId: string; file: File }) =>
      putMenuImage(boothId, menuId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.menus(boothId) })
    },
  })
}

export function useDeleteMenuImage(boothId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (menuId: string) => deleteMenuImage(boothId, menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.list(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.menus(boothId) })
    },
  })
}
