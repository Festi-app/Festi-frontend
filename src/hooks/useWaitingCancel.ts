import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWaiting } from '../features/Waiting/apis/deleteWaiting'
import { waitingKeys } from '../features/Waiting/hooks/useMyWaitings'

export function useWaitingCancel(onAfterCancel?: () => void) {
  const queryClient = useQueryClient()
  const { mutate: cancelMutate } = useMutation({
    mutationFn: deleteWaiting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waitingKeys.all })
    },
  })
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  function handleCancel(waitingId: string) {
    cancelMutate(waitingId)
    setConfirmCancel(false)
    setShowCancelToast(true)
    timerRef.current = setTimeout(
      () => (onAfterCancel ? onAfterCancel() : setShowCancelToast(false)),
      2000
    )
  }

  return { confirmCancel, setConfirmCancel, showCancelToast, handleCancel }
}
