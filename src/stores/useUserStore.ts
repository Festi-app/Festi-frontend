import { create } from 'zustand'

interface UserStore {
  name: string
  phone: string
  userId: string
  setName: (name: string) => void
  setPhone: (phone: string) => void
  setUserId: (userId: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  name: '홍길동',
  phone: '010-2354-8821',
  userId: 'test',
  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  setUserId: (userId) => set({ userId }),
}))
