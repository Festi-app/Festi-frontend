import { create } from 'zustand'

interface FestivalStore {
  startDate: string
  endDate: string
  setDates: (start: string, end: string) => void
}

export const useFestivalStore = create<FestivalStore>((set) => ({
  startDate: '2026-05-20',
  endDate: '2026-05-22',
  setDates: (startDate, endDate) => set({ startDate, endDate }),
}))

// 접속 허용 기간: 시작일 -3일 ~ 종료일 +1일
export function isFestivalActive(startDate: string, endDate: string): boolean {
  const now = new Date()
  const accessStart = new Date(startDate + 'T00:00:00')
  accessStart.setDate(accessStart.getDate() - 3)
  const accessEnd = new Date(endDate + 'T23:59:59')
  accessEnd.setDate(accessEnd.getDate() + 1)
  return now >= accessStart && now <= accessEnd
}
