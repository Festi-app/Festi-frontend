import { create } from 'zustand'

interface FestivalState {
  brandImage: string
  setBrandImage: (v: string) => void
}

export const useFestivalStore = create<FestivalState>((set) => ({
  brandImage: '',
  setBrandImage: (brandImage) => set({ brandImage }),
}))
