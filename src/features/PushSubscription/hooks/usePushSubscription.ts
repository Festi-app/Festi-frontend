import { useMutation } from '@tanstack/react-query'
import { postPushSubscription } from '../apis/postPushSubscription'
import { deletePushSubscription } from '../apis/deletePushSubscription'

const STORAGE_KEY = 'push_subscription_id'
const SW_PATH = '/sw.js'

function base64UrlToUint8Array(value: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const buffer = new ArrayBuffer(raw.length)
  const output = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}

export function getStoredSubscriptionId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export async function registerWaitingPush(): Promise<string> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('This browser does not support Web Push.')
  }

  const vapidKey = import.meta.env.VITE_FESTI_VAPID_PUBLIC_KEY as
    | string
    | undefined
  if (!vapidKey) throw new Error('VITE_FESTI_VAPID_PUBLIC_KEY is not set.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.')
  }

  const registration = await navigator.serviceWorker.register(SW_PATH)
  const existing = await registration.pushManager.getSubscription()
  const sub =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToUint8Array(vapidKey),
    }))

  const json = sub.toJSON()
  const p256dh = json.keys?.p256dh
  const auth = json.keys?.auth
  if (!p256dh || !auth) {
    throw new Error('The browser did not provide Push subscription keys.')
  }

  const result = await postPushSubscription({
    endpoint: sub.endpoint,
    keys: { p256dh, auth },
  })

  localStorage.setItem(STORAGE_KEY, result.id)
  return result.id
}

export async function removeWaitingPush(subscriptionId: string): Promise<void> {
  try {
    await deletePushSubscription(subscriptionId)
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status
    if (status !== 404) throw e
  }

  localStorage.removeItem(STORAGE_KEY)

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration(SW_PATH)
    const sub = await reg?.pushManager.getSubscription()
    await sub?.unsubscribe()
  }
}

export function useRegisterPushSubscription() {
  return useMutation({ mutationFn: registerWaitingPush })
}

export function useRemovePushSubscription() {
  return useMutation({
    mutationFn: (subscriptionId: string) => removeWaitingPush(subscriptionId),
  })
}
