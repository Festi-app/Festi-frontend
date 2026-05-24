export interface PushSubscriptionKeysDto {
  p256dh: string
  auth: string
}

export interface PostPushSubscriptionRequestDto {
  endpoint: string
  keys: PushSubscriptionKeysDto
}

export interface PushSubscriptionResponseDto {
  id: string
  endpoint: string
}
