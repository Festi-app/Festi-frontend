import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFoodTruck } from '../apis/deleteFoodTruck'
import { boothKeys } from './useBooths'

export function useDeleteFoodTruck() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFoodTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boothKeys.all })
    },
  })
}
