import { create } from 'zustand'

export interface Notice {
  id: string
  title: string
  content: string
  createdAt: string
  pinned: boolean
}

interface NoticeStore {
  notices: Notice[]
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  updateNotice: (id: string, patch: Partial<Omit<Notice, 'id'>>) => void
  deleteNotice: (id: string) => void
  togglePin: (id: string) => void
}

export const useNoticeStore = create<NoticeStore>((set) => ({
  notices: [
    {
      id: '1',
      title: '2026 봄축제 운영 안내',
      content:
        '2026년 봄축제가 5월 20일(수)부터 22일(금)까지 숭실대학교 중앙광장 일대에서 진행됩니다. 부스 운영 시간은 주간 11:00~17:00, 야간 17:00~22:00입니다.',
      createdAt: '2026-05-10',
      pinned: true,
    },
    {
      id: '2',
      title: '스탬프 투어 이벤트',
      content:
        '부스 5곳을 방문하고 스탬프를 모아 경품을 받으세요! 학생회관 앞 이벤트 부스에서 스탬프 카드를 수령하실 수 있습니다.',
      createdAt: '2026-05-12',
      pinned: false,
    },
    {
      id: '3',
      title: '우천 시 운영 변경 안내',
      content:
        '우천 시 야외 부스 일부가 실내로 이전될 수 있습니다. 실시간 공지를 확인해주세요.',
      createdAt: '2026-05-14',
      pinned: false,
    },
  ],
  addNotice: (notice) =>
    set((s) => ({
      notices: [
        {
          ...notice,
          id: String(Date.now()),
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...s.notices,
      ],
    })),
  updateNotice: (id, patch) =>
    set((s) => ({
      notices: s.notices.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),
  deleteNotice: (id) =>
    set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),
  togglePin: (id) =>
    set((s) => ({
      notices: s.notices.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      ),
    })),
}))
