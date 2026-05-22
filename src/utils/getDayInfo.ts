export function getDDayInfo(startDate: string, endDate: string) {
  const now = new Date()
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T23:59:59')
  if (now < start) {
    const diff = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    return { type: 'before' as const, days: diff }
  }
  if (now > end) {
    return { type: 'after' as const }
  }
  return { type: 'during' as const }
}
