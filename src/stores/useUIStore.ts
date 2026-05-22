import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  dark: boolean
  setDark: (v: boolean) => void
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      dark: false,
      setDark: (dark) => {
        document.documentElement.classList.toggle('dark', dark)
        set({ dark })
      },
    }),
    { name: 'festi-ui' }
  )
)
