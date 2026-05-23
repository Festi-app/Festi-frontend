import { create } from 'zustand'

export type BoothType = 'night' | 'day' | 'truck'

export type SavedBooth = {
  id: number
  userId: string
  boothId: string
  boothType: BoothType
  festivalId: number
  createdAt: string
}

function key(boothType: BoothType, boothId: string) {
  return `${boothType}-${boothId}`
}

const INITIAL_SAVED: SavedBooth[] = []

interface FavoritesStore {
  savedBooths: SavedBooth[]
  savedKeys: Set<string>
  isSaved: (boothType: BoothType, boothId: string) => boolean
  toggleSave: (boothType: BoothType, boothId: string) => void
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
