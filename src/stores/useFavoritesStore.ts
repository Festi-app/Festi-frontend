import { create } from 'zustand'

export type BoothType = 'night' | 'day' | 'truck'

export type SavedBooth = {
  id: number
  userId: string
  boothId: number
  boothType: BoothType
  festivalId: number
  createdAt: string
}

function key(boothType: BoothType, boothId: number) {
  return `${boothType}-${boothId}`
}

const INITIAL_SAVED: SavedBooth[] = [
  {
    id: 1,
    userId: 'hong123',
    boothId: 16,
    boothType: 'night',
    festivalId: 1,
    createdAt: '2026-05-15T10:00:00',
  },
  {
    id: 2,
    userId: 'hong123',
    boothId: 38,
    boothType: 'night',
    festivalId: 1,
    createdAt: '2026-05-16T10:05:00',
  },
  {
    id: 3,
    userId: 'hong123',
    boothId: 47,
    boothType: 'night',
    festivalId: 1,
    createdAt: '2026-05-17T10:10:00',
  },
  {
    id: 4,
    userId: 'hong123',
    boothId: 2,
    boothType: 'day',
    festivalId: 1,
    createdAt: '2026-05-18T10:15:00',
  },
  {
    id: 5,
    userId: 'hong123',
    boothId: 8,
    boothType: 'day',
    festivalId: 1,
    createdAt: '2026-05-18T11:00:00',
  },
  {
    id: 6,
    userId: 'hong123',
    boothId: 1,
    boothType: 'truck',
    festivalId: 1,
    createdAt: '2026-05-19T09:30:00',
  },
  {
    id: 7,
    userId: 'hong123',
    boothId: 3,
    boothType: 'truck',
    festivalId: 1,
    createdAt: '2026-05-19T09:45:00',
  },
]

interface FavoritesStore {
  savedBooths: SavedBooth[]
  savedKeys: Set<string>
  isSaved: (boothType: BoothType, boothId: number) => boolean
  toggleSave: (boothType: BoothType, boothId: number) => void
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  savedBooths: INITIAL_SAVED,
  savedKeys: new Set(INITIAL_SAVED.map((s) => key(s.boothType, s.boothId))),
  isSaved: (boothType, boothId) => get().savedKeys.has(key(boothType, boothId)),
  toggleSave: (boothType, boothId) =>
    set((s) => {
      const k = key(boothType, boothId)
      const nextKeys = new Set(s.savedKeys)
      if (nextKeys.has(k)) {
        nextKeys.delete(k)
        return {
          savedKeys: nextKeys,
          savedBooths: s.savedBooths.filter(
            (b) => !(b.boothId === boothId && b.boothType === boothType)
          ),
        }
      }
      nextKeys.add(k)
      return {
        savedKeys: nextKeys,
        savedBooths: [
          ...s.savedBooths,
          {
            id: Date.now(),
            userId: 'hong123',
            boothId,
            boothType,
            festivalId: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      }
    }),
}))
