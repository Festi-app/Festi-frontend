export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
  },
  USERS: {
    ME: '/api/users/me',
  },
  FESTIVAL: {
    ROOT: '/api/festival',
    DAYS: '/api/festival/days',
    DAY_DETAIL: (festivalDayId: string) =>
      `/api/festival/days/${festivalDayId}`,
    NOTICES: '/api/festival/notices',
    NOTICE_DETAIL: (noticeId: string) => `/api/festival/notices/${noticeId}`,
    TIMELINES: '/api/festival/timelines',
    TIMELINE_DETAIL: (timelineId: string) =>
      `/api/festival/timelines/${timelineId}`,
  },
  BOOTHS: {
    LIST: '/api/booths',
    DETAIL: (boothId: string) => `/api/booths/${boothId}`,
    MENUS: (boothId: string) => `/api/booths/${boothId}/menus`,
    WAITINGS: (boothId: string) => `/api/booths/${boothId}/waitings`,
  },
  LOCATIONS: {
    LIST: '/api/locations',
  },
  WAITINGS: {
    LIST: '/api/waitings',
    CANCEL: (waitingId: string) => `/api/waitings/${waitingId}`,
  },
  FAVORITES: {
    ROOT: '/api/favorites',
    REMOVE: (favoriteId: string) => `/api/favorites/${favoriteId}`,
  },
} as const
