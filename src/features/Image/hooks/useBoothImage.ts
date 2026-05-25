import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putBoothImage } from '../apis/putBoothImage'
import { deleteBoothImage } from '../apis/deleteBoothImage'
import { boothKeys } from '../../Booth/hooks/useBooths'

export function useUploadBoothImage(boothId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => putBoothImage(boothId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothKeys.detail(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.all })
    },
  })
}

export function useDeleteBoothImage(boothId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteBoothImage(boothId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothKeys.detail(boothId) })
      queryClient.invalidateQueries({ queryKey: boothKeys.all })
    },
  })
}
