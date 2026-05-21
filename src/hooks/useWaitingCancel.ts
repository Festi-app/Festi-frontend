import { useEffect, useRef, useState } from 'react'
import { useWaitingStore } from '../stores/useWaitingStore'

export function useWaitingCancel(onAfterCancel?: () => void) {
  const { cancelWaiting } = useWaitingStore()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  function handleCancel(boothId: number) {
    cancelWaiting(boothId)
    setConfirmCancel(false)
    setShowCancelToast(true)
    timerRef.current = setTimeout(
      () => (onAfterCancel ? onAfterCancel() : setShowCancelToast(false)),
      2000
    )
  }

  return { confirmCancel, setConfirmCancel, showCancelToast, handleCancel }
}
