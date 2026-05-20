import { create } from 'zustand'
import { FESTIV_TOKENS } from '../tokens'
import type { MenuItem } from '../data/booths'
export type { MenuItem }

export type TruckTime = '주간' | '야간'
export type AssignmentMap = Record<string, string>

export interface TruckZoneDef {
  id: string
  label: string
  name: string
  color: string
  slotCount: number
  dir: 'row' | 'col'
  left: string
  top: string
  width: string
  height: string
  rotate: number
  mapX: number
  mapY: number
}

export const TRUCK_ZONES: TruckZoneDef[] = [
  {
    id: 'A',
    label: 'A구역',
    name: '야외무대 좌측',
    color: FESTIV_TOKENS.coral,
    slotCount: 1,
    dir: 'col',
    left: '21%',
    top: '41%',
    width: '5%',
    height: '12.8%',
    rotate: 15,
    mapX: 24,
    mapY: 50,
  },
  {
    id: 'B',
    label: 'B구역',
    name: '상단 구역',
    color: FESTIV_TOKENS.mint,
    slotCount: 3,
    dir: 'row',
    left: '22%',
    top: '28.5%',
    width: '21%',
    height: '7%',
    rotate: -26,
    mapX: 35,
    mapY: 30,
  },
  {
    id: 'C',
    label: 'C구역',
    name: '하단 구역',
    color: FESTIV_TOKENS.sun,
    slotCount: 2,
    dir: 'row',
    left: '30.8%',
    top: '66%',
    width: '17%',
    height: '7%',
    rotate: -1,
    mapX: 39,
    mapY: 72,
  },
  {
    id: 'D',
    label: 'D구역',
    name: '우측 열',
    color: FESTIV_TOKENS.grape,
    slotCount: 5,
    dir: 'col',
    left: '80%',
    top: '8.8%',
    width: '7%',
    height: '57.5%',
    rotate: 3,
    mapX: 85,
    mapY: 37,
  },
]

export type TruckDay = 1 | 2 | 3

export interface FoodTruck {
  id: string
  name: string
  days: TruckDay[]
  startTime: string
  endTime: string
  note: string
  menus: MenuItem[]
}

const INITIAL_TRUCKS: FoodTruck[] = [
  {
    id: '1',
    name: '골드',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [{ id: 'm1', name: '소프트 아이스크림컵·콘', price: '4,500' }],
  },
  {
    id: '2',
    name: '캡틴',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm2', name: '타코야끼', price: '6,000' },
      { id: 'm3', name: '회오리감자', price: '5,000' },
    ],
  },
  {
    id: '3',
    name: '안녕',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm4', name: '떡볶이', price: '5,000' },
      { id: 'm5', name: '순대', price: '5,000' },
      { id: 'm6', name: '어묵4p', price: '5,000' },
      { id: 'm7', name: '어묵2p', price: '3,000' },
    ],
  },
  {
    id: '4',
    name: '일광',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm8', name: '칠리/크림 새우', price: '10,000' },
      { id: 'm9', name: '반반새우', price: '15,000' },
    ],
  },
  {
    id: '5',
    name: '가마솥',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm10', name: '닭강정', price: '소 10,000 / 중 15,000 / 대 18,000' },
    ],
  },
  {
    id: '6',
    name: '아라',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [{ id: 'm11', name: '닭꼬치', price: '5,000' }],
  },
  {
    id: '7',
    name: '청춘',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm12', name: '야끼소바', price: '10,000' },
      { id: 'm13', name: '오꼬노미야끼', price: '10,000' },
      { id: 'm14', name: '소바빵', price: '6,000' },
    ],
  },
  {
    id: '8',
    name: '부엉이푸드',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [{ id: 'm15', name: '불초밥/새우초밥', price: '12,000' }],
  },
  {
    id: '9',
    name: '달리는푸드',
    days: [1, 2],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm16', name: '츄러스', price: '4,000' },
      { id: 'm17', name: '젤라또', price: '4,500' },
      { id: 'm18', name: '아츄', price: '6,000' },
    ],
  },
  {
    id: '10',
    name: '에페스케밥',
    days: [1, 2, 3],
    startTime: '10:00',
    endTime: '20:00',
    note: '',
    menus: [
      { id: 'm19', name: '케밥 (닭고기/양고기/믹스)', price: '8,000~10,000' },
      {
        id: 'm20',
        name: '박스 케밥 (닭고기/양고기/믹스)',
        price: '13,000~15,000',
      },
      { id: 'm21', name: '터키 아이스크림', price: '5,000~6,000' },
    ],
  },
]

interface TruckPlacementState {
  trucks: FoodTruck[]
  slotCounts: Record<string, number>
  zoneRotations: Record<string, number>
  assignments: AssignmentMap
  setTrucks: (trucks: FoodTruck[]) => void
  setSlotCount: (zoneId: string, count: number) => void
  setZoneRotation: (zoneId: string, rotate: number) => void
  setAssignment: (key: string, truckId: string) => void
  removeAssignment: (key: string) => void
  cleanupZoneSlots: (zoneId: string, fromIdx: number) => void
}

export const useTruckPlacementStore = create<TruckPlacementState>((set) => ({
  trucks: INITIAL_TRUCKS,
  slotCounts: Object.fromEntries(TRUCK_ZONES.map((z) => [z.id, z.slotCount])),
  zoneRotations: Object.fromEntries(TRUCK_ZONES.map((z) => [z.id, z.rotate])),
  assignments: {},
  setTrucks: (trucks) => set({ trucks }),
  setSlotCount: (zoneId, count) =>
    set((state) => ({ slotCounts: { ...state.slotCounts, [zoneId]: count } })),
  setZoneRotation: (zoneId, rotate) =>
    set((state) => ({
      zoneRotations: { ...state.zoneRotations, [zoneId]: rotate },
    })),
  setAssignment: (key, truckId) =>
    set((state) => ({ assignments: { ...state.assignments, [key]: truckId } })),
  removeAssignment: (key) =>
    set((state) => {
      const next = { ...state.assignments }
      delete next[key]
      return { assignments: next }
    }),
  cleanupZoneSlots: (zoneId, fromIdx) =>
    set((state) => {
      const next = { ...state.assignments }
      for (const k of Object.keys(next)) {
        const parts = k.split(':')
        // key format: day:time:zoneId:slotIdx
        const zId = parts[2]
        const sIdx = parseInt(parts[3])
        if (zId === zoneId && sIdx >= fromIdx) delete next[k]
      }
      return { assignments: next }
    }),
}))
