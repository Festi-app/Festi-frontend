import { create } from 'zustand'
import type { UserRole } from '../features/Auth/types/UserRole'

interface UserStore {
  userId: string
  festivalId: string
  name: string
  phone: string
  role: UserRole | null
  setUser: (user: {
    id: string
    festivalId: string
    name: string
    phone: string
    role: UserRole
  }) => void
  setName: (name: string) => void
  setPhone: (phone: string) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: '',
  festivalId: '',
  name: '',
  phone: '',
  role: null,
  setUser: ({ id, festivalId, name, phone, role }) =>
    set({ userId: id, festivalId, name, phone, role }),
  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  logout: () =>
    set({ userId: '', festivalId: '', name: '', phone: '', role: null }),
}))
