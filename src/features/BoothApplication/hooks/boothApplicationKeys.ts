export const boothApplicationKeys = {
  all: ['booth-applications'] as const,
  mine: () => ['booth-applications', 'me'] as const,
  adminList: () => ['booth-applications', 'admin', 'list'] as const,
  adminDetail: (applicationId: string) =>
    ['booth-applications', 'admin', applicationId] as const,
}
