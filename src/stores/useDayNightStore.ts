import { create } from 'zustand'

interface DayNightState {
  isDay: boolean
  setIsDay: (isDay: boolean) => void
  toggleDayNight: () => void
}

export const useDayNightStore = create<DayNightState>((set) => ({
  isDay: true,
  setIsDay: (isDay) => set({ isDay }),
  toggleDayNight: () => set((state) => ({ isDay: !state.isDay })),
}))
