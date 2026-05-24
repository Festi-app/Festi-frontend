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
    MENU_DETAIL: (boothId: string, menuId: string) =>
      `/api/booths/${boothId}/menus/${menuId}`,
    MENU_SOLD_OUT: (boothId: string, menuId: string) =>
      `/api/booths/${boothId}/menus/${menuId}/sold-out`,
    WAITINGS: (boothId: string) => `/api/booths/${boothId}/waitings`,
    WAITINGS_STATUS: (boothId: string) =>
      `/api/booths/${boothId}/waitings/status`,
  },
  LOCATIONS: {
    LIST: '/api/locations',
    DETAIL: (locationId: string) => `/api/locations/${locationId}`,
  },
  WAITINGS: {
    LIST: '/api/waitings',
    CANCEL: (waitingId: string) => `/api/waitings/${waitingId}`,
    CALL: (waitingId: string) => `/api/waitings/${waitingId}/call`,
    STATUS: (waitingId: string) => `/api/waitings/${waitingId}/status`,
  },
  FAVORITES: {
    ROOT: '/api/favorites',
    REMOVE: (favoriteId: string) => `/api/favorites/${favoriteId}`,
  },
} as const
