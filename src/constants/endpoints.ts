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
    TIMELINES: '/api/festival/timelines',
    NOTICES: '/api/festival/notices',
  },
  BOOTHS: {
    LIST: '/api/booths',
    DETAIL: (boothId: string) => `/api/booths/${boothId}`,
    MENUS: (boothId: string) => `/api/booths/${boothId}/menus`,
    WAITINGS: (boothId: string) => `/api/booths/${boothId}/waitings`,
  },
  LOCATIONS: {
    LIST: '/api/locations',
    DETAIL: (locationId: string) => `/api/locations/${locationId}`,
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
