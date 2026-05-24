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
    FOOD_TRUCKS: '/api/booths/admin/food-trucks',
    FOOD_TRUCK_DETAIL: (boothId: string) =>
      `/api/booths/admin/food-trucks/${boothId}`,
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
    SLOTS: '/api/locations/slots',
    ASSIGNMENT: (locationId: string) =>
      `/api/locations/${locationId}/assignment`,
  },
  BOOTH_APPLICATIONS: {
    ROOT: '/api/booth-applications',
    ME: '/api/booth-applications/me',
    ADMIN_LIST: '/api/admin/booth-applications',
    ADMIN_DETAIL: (applicationId: string) =>
      `/api/admin/booth-applications/${applicationId}`,
    APPROVE: (applicationId: string) =>
      `/api/admin/booth-applications/${applicationId}/approve`,
    REJECT: (applicationId: string) =>
      `/api/admin/booth-applications/${applicationId}/reject`,
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
  PUSH_SUBSCRIPTIONS: {
    ROOT: '/api/push-subscriptions',
    DETAIL: (subscriptionId: string) =>
      `/api/push-subscriptions/${subscriptionId}`,
  },
} as const
