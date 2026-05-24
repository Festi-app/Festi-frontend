import { create } from 'zustand'

export type ActiveWaiting = {
  boothId: string
  boothName: string
  boothTone?: string
  boothArea?: string
  boothSections?: number[]
  registered: string
  waitNo?: number | null
  callNo?: number | null
  progressPct?: number
  aheadTeams?: number
}

interface WaitingStore {
  waitings: ActiveWaiting[]
  addWaiting: (waiting: ActiveWaiting) => void
  cancelWaiting: (boothId: string) => void
}

export const useWaitingStore = create<WaitingStore>((set) => ({
  waitings: [],
  addWaiting: (waiting) => set((s) => ({ waitings: [...s.waitings, waiting] })),
  cancelWaiting: (boothId) =>
    set((s) => ({ waitings: s.waitings.filter((w) => w.boothId !== boothId) })),
}))
