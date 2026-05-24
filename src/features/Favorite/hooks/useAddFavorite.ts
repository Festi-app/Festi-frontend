import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFavorite } from '../apis/postFavorite'
import { favoriteKeys } from './useFavorites'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
    },
  })
}
