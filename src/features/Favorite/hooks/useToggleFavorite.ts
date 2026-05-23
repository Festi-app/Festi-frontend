import { useFavorites } from './useFavorites'
import { useAddFavorite } from './useAddFavorite'
import { useRemoveFavorite } from './useRemoveFavorite'
import type { UUID } from '../types/favorite'

export function useToggleFavorite() {
  const { data: favorites = [] } = useFavorites()
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  const isSaved = (boothId: UUID) =>
    favorites.some((f) => f.boothSummary.id === boothId)

  const toggle = (boothId: UUID) => {
    const existing = favorites.find((f) => f.boothSummary.id === boothId)
    if (existing) {
      removeFavorite.mutate(existing.id)
    } else {
      addFavorite.mutate({ boothId })
    }
  }

  return { isSaved, toggle, isPending: addFavorite.isPending || removeFavorite.isPending }
}
