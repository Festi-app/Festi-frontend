import { create } from 'zustand'

function uid() {
  return Math.random().toString(36).slice(2)
}

export type TimetableSlot = {
  id: string
  time: string
  end: string
  name: string
  artist: string
}

interface TimetableStore {
  venue: string
  currentDay: number
  days: Record<number, TimetableSlot[]>
  setVenue: (v: string) => void
  setCurrentDay: (day: number) => void
  addSlot: (day: number, slot: Omit<TimetableSlot, 'id'>) => void
  updateSlot: (
    day: number,
    id: string,
    patch: Partial<Omit<TimetableSlot, 'id'>>
  ) => void
  deleteSlot: (day: number, id: string) => void
  moveSlot: (day: number, id: string, dir: 'up' | 'down') => void
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  venue: '베어드홀 대공연장',
  currentDay: 2,
  days: {
    1: [
      {
        id: uid(),
        time: '14:00',
        end: '15:30',
        name: '오프닝 세레모니',
        artist: '총학생회',
      },
      {
        id: uid(),
        time: '15:30',
        end: '17:00',
        name: '버스킹 1부',
        artist: '어쿠스틱 트리오',
      },
      {
        id: uid(),
        time: '17:00',
        end: '18:30',
        name: '댄스 퍼포먼스',
        artist: '중앙 댄스동아리',
      },
      {
        id: uid(),
        time: '18:30',
        end: '20:00',
        name: '인디 밴드 공연',
        artist: '블루문 밴드',
      },
    ],
    2: [
      {
        id: uid(),
        time: '17:00',
        end: '18:30',
        name: '오프닝 퍼포먼스',
        artist: '총학생회',
      },
      {
        id: uid(),
        time: '18:30',
        end: '20:00',
        name: '밴드 공연',
        artist: '소울 인 더 박스',
      },
      {
        id: uid(),
        time: '20:00',
        end: '21:30',
        name: '버스킹',
        artist: '어쿠스틱 듀오 봄날',
      },
      {
        id: uid(),
        time: '21:30',
        end: '23:00',
        name: '피날레 공연',
        artist: '스페셜 게스트',
      },
    ],
    3: [
      {
        id: uid(),
        time: '16:00',
        end: '17:30',
        name: '오후 버스킹',
        artist: '재즈 앙상블',
      },
      {
        id: uid(),
        time: '17:30',
        end: '19:00',
        name: '록 밴드 공연',
        artist: '더 선셋',
      },
      {
        id: uid(),
        time: '19:00',
        end: '20:30',
        name: '힙합 스테이지',
        artist: 'MC 봄바람',
      },
      {
        id: uid(),
        time: '20:30',
        end: '22:30',
        name: '클로징 페스타',
        artist: '전체 출연진',
      },
    ],
  },

  setVenue: (venue) => set({ venue }),
  setCurrentDay: (currentDay) => set({ currentDay }),

  addSlot: (day, slot) =>
    set((s) => ({
      days: {
        ...s.days,
        [day]: [...(s.days[day] ?? []), { id: uid(), ...slot }],
      },
    })),

  updateSlot: (day, id, patch) =>
    set((s) => ({
      days: {
        ...s.days,
        [day]: (s.days[day] ?? []).map((sl) =>
          sl.id === id ? { ...sl, ...patch } : sl
        ),
      },
    })),

  deleteSlot: (day, id) =>
    set((s) => ({
      days: {
        ...s.days,
        [day]: (s.days[day] ?? []).filter((sl) => sl.id !== id),
      },
    })),

  moveSlot: (day, id, dir) =>
    set((s) => {
      const slots = [...(s.days[day] ?? [])]
      const idx = slots.findIndex((sl) => sl.id === id)
      if (idx < 0) return s
      const target = dir === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= slots.length) return s
      ;[slots[idx], slots[target]] = [slots[target], slots[idx]]
      return { days: { ...s.days, [day]: slots } }
    }),
}))
