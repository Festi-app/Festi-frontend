import { create } from 'zustand'

export type OrgType = '동아리/소모임' | '단과대/학과'
export type OperatingTime = '주간' | '야간'
export type BoothCategoryType = '정보' | '체험' | '마켓' | '활동'

export interface NightMenuItem {
  id: string
  name: string
  price: string
  desc: string
  image?: string
}

export interface WaitingEntry {
  id: string
  number: number
  partyName: string
  phone: string
  groupSize: number
  registeredAt: string
  status: 'waiting' | 'called' | 'done' | 'cancelled'
}

export interface BoothAdminAccount {
  id: string
  studentId: string
  password: string
  representativeName: string
  orgType: OrgType
  orgName: string
  operatingTimes: OperatingTime[]
  dayBoothName: string
  dayBoothDesc: string
  dayCategory: BoothCategoryType | ''
  nightBoothName: string
  nightBoothDesc: string
  status: 'pending' | 'approved'
  dayDetailImage?: string
  nightMenus: NightMenuItem[]
  waitingList: WaitingEntry[]
}

interface BoothAdminState {
  accounts: BoothAdminAccount[]
  currentAccountId: string | null
  register: (
    data: Omit<
      BoothAdminAccount,
      'id' | 'status' | 'dayDetailImage' | 'nightMenus' | 'waitingList'
    >
  ) => void
  login: (studentId: string, password: string) => boolean
  logout: () => void
  updateInfo: (
    patch: Partial<
      Pick<
        BoothAdminAccount,
        | 'dayBoothName'
        | 'dayBoothDesc'
        | 'dayDetailImage'
        | 'nightBoothName'
        | 'nightBoothDesc'
        | 'nightMenus'
      >
    >
  ) => void
  callWaiting: (waitingId: string) => void
  completeWaiting: (waitingId: string) => void
  cancelWaiting: (waitingId: string) => void
}

const SEED_WAITING: WaitingEntry[] = [
  {
    id: 'w1',
    number: 1,
    partyName: '박민준',
    phone: '010-1234-5678',
    groupSize: 4,
    registeredAt: '18:32',
    status: 'waiting',
  },
  {
    id: 'w2',
    number: 2,
    partyName: '김지영',
    phone: '010-2345-6789',
    groupSize: 2,
    registeredAt: '18:35',
    status: 'waiting',
  },
  {
    id: 'w3',
    number: 3,
    partyName: '이서준',
    phone: '010-3456-7890',
    groupSize: 6,
    registeredAt: '18:40',
    status: 'called',
  },
  {
    id: 'w4',
    number: 4,
    partyName: '최유진',
    phone: '010-4567-8901',
    groupSize: 3,
    registeredAt: '18:45',
    status: 'waiting',
  },
  {
    id: 'w5',
    number: 5,
    partyName: '정하은',
    phone: '010-5678-9012',
    groupSize: 5,
    registeredAt: '18:52',
    status: 'waiting',
  },
  {
    id: 'w6',
    number: 6,
    partyName: '강도윤',
    phone: '010-6789-0123',
    groupSize: 4,
    registeredAt: '18:58',
    status: 'done',
  },
]

export const useBoothAdminStore = create<BoothAdminState>((set, get) => ({
  accounts: [
    {
      id: 'seed1',
      studentId: '20210001',
      password: '1234',
      representativeName: '홍길동',
      orgType: '동아리/소모임',
      orgName: '컴퓨터학부',
      operatingTimes: ['주간', '야간'],
      dayBoothName: '코딩 체험 부스',
      dayBoothDesc: '다양한 프로그래밍 체험을 즐겨보세요',
      dayCategory: '체험',
      nightBoothName: '해킹 주점',
      nightBoothDesc: '신나는 야간 주점입니다',
      status: 'approved',
      nightMenus: [
        { id: 'm1', name: '생맥주', price: '3,000', desc: '시원한 생맥주' },
        { id: 'm2', name: '소주', price: '4,000', desc: '참이슬 한 병' },
      ],
      waitingList: SEED_WAITING,
    },
    {
      id: 'seed2',
      studentId: '20220001',
      password: '1234',
      representativeName: '김철수',
      orgType: '단과대/학과',
      orgName: '경영대학',
      operatingTimes: ['주간'],
      dayBoothName: '경영대 홍보 부스',
      dayBoothDesc: '경영대를 소개합니다',
      dayCategory: '정보',
      nightBoothName: '',
      nightBoothDesc: '',
      status: 'pending',
      nightMenus: [],
      waitingList: [],
    },
  ],
  currentAccountId: null,

  register: (data) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({
      accounts: [
        ...s.accounts,
        { ...data, id, status: 'pending', nightMenus: [], waitingList: [] },
      ],
    }))
  },

  login: (studentId, password) => {
    const account = get().accounts.find(
      (a) => a.studentId === studentId && a.password === password
    )
    if (account) {
      set({ currentAccountId: account.id })
      return true
    }
    return false
  },

  logout: () => set({ currentAccountId: null }),

  updateInfo: (patch) => {
    const id = get().currentAccountId
    if (!id) return
    set((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }))
  },

  callWaiting: (waitingId) => {
    const id = get().currentAccountId
    if (!id) return
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === id
          ? {
              ...a,
              waitingList: a.waitingList.map((w) =>
                w.id === waitingId ? { ...w, status: 'called' as const } : w
              ),
            }
          : a
      ),
    }))
  },

  completeWaiting: (waitingId) => {
    const id = get().currentAccountId
    if (!id) return
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === id
          ? {
              ...a,
              waitingList: a.waitingList.map((w) =>
                w.id === waitingId ? { ...w, status: 'done' as const } : w
              ),
            }
          : a
      ),
    }))
  },

  cancelWaiting: (waitingId) => {
    const id = get().currentAccountId
    if (!id) return
    set((s) => ({
      accounts: s.accounts.map((a) =>
        a.id === id
          ? {
              ...a,
              waitingList: a.waitingList.map((w) =>
                w.id === waitingId ? { ...w, status: 'cancelled' as const } : w
              ),
            }
          : a
      ),
    }))
  },
}))
