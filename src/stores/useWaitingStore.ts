import { create } from 'zustand'

export type ActiveWaiting = {
  boothId: number
  boothName: string
  boothTone?: string
  boothArea?: string
  boothSections?: number[]
  registered: string
  waitNo: number
  callNo: number
  progressPct: number
  aheadTeams: number
}

interface WaitingStore {
  waitings: ActiveWaiting[]
  addWaiting: (waiting: ActiveWaiting) => void
  cancelWaiting: (boothId: number) => void
}

export const useWaitingStore = create<WaitingStore>((set) => ({
  waitings: [
    {
      boothId: 16,
      boothName: '컴공과 칵테일 바',
      boothTone: 'rose',
      boothArea: '베어드홀 앞',
      boothSections: [0, 1],
      registered: '4인 · 21:14 등록',
      waitNo: 34,
      callNo: 32,
      progressPct: 72,
      aheadTeams: 2,
    },
    {
      boothId: 38,
      boothName: '체대 곱창집',
      boothTone: 'leaf',
      boothArea: '조만식·신양관 사이',
      boothSections: [1, 2],
      registered: '2인 · 21:05 등록',
      waitNo: 22,
      callNo: 20,
      progressPct: 85,
      aheadTeams: 2,
    },
    {
      boothId: 47,
      boothName: '미디어부 라멘바',
      boothTone: 'grape',
      boothArea: '형남공학관 앞',
      boothSections: [0, 1],
      registered: '3인 · 20:58 등록',
      waitNo: 18,
      callNo: 15,
      progressPct: 60,
      aheadTeams: 3,
    },
  ],
  addWaiting: (waiting) => set((s) => ({ waitings: [...s.waitings, waiting] })),
  cancelWaiting: (boothId) =>
    set((s) => ({ waitings: s.waitings.filter((w) => w.boothId !== boothId) })),
}))
