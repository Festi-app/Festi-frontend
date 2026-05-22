export const BOOTH_TYPES = {
  DAY: 'day',
  NIGHT: 'night',
  TRUCK: 'truck',
} as const

export type BoothTypeParam = (typeof BOOTH_TYPES)[keyof typeof BOOTH_TYPES]

export const ADMIN_STEPS = {
  ASSIGN: 'assign',
  CONFIGURE: 'configure',
} as const
