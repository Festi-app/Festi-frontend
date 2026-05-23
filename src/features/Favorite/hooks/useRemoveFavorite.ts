import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFavorite } from '../apis/deleteFavorite'
import { favoriteKeys } from './useFavorites'

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
    },
  })
}
