import type { BoothTypeParam } from './queryParams'

export const ROUTES = {
  ROOT: '/',
  SPLASH: '/splash',
  OFF_SEASON: '/off-season',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  HOME: '/home',
  MAP: '/map',
  BOOTH: '/booth',
  BOOTHS: '/booths',
  WAITING: '/waiting',
  WAITING_REGISTER: '/waiting/register',
  WAITING_DETAIL: '/waiting/detail',
  TRUCK: '/truck',
  MY: '/me',
  ADMIN: {
    FESTIVAL: '/admin/festival',
    BOOTHS: '/admin/booths',
    TRUCKS: '/admin/trucks',
    BOOTH_REQUESTS: '/admin/booth-requests',
    TIMETABLE: '/admin/timetable',
    NOTICES: '/admin/notices',
  },
  BOOTH_ADMIN: {
    LOGIN: '/booth-admin/login',
    REGISTER: '/booth-admin/register',
    DASHBOARD: '/booth-admin',
  },
} as const

export const boothUrl = (type: BoothTypeParam, id?: string | number) =>
  id != null
    ? `${ROUTES.BOOTH}?type=${type}&id=${id}`
    : `${ROUTES.BOOTH}?type=${type}`

export const boothListUrl = (type: BoothTypeParam) =>
  `${ROUTES.BOOTHS}?type=${type}`

export const waitingDetailUrl = (id: number) =>
  `${ROUTES.WAITING_DETAIL}?id=${id}`

export const waitingRegisterUrl = (id: number) =>
  `${ROUTES.WAITING_REGISTER}?id=${id}`
