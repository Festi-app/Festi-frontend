import { I } from '../../tokens'

const NOTICES = [
  {
    id: 1,
    title: '2일차 야간 부스 운영 시간 변경',
    body: '우천으로 인해 야간 부스 운영이 22시에서 21시로 단축됩니다. 양해 부탁드립니다.',
    date: '05.16',
  },
  {
    id: 2,
    title: '스탬프 투어 경품 추가',
    body: '스탬프 10개 완성 시 경품이 추가되었습니다. 학생회관 부스에서 교환 가능합니다.',
    date: '05.16',
  },
  {
    id: 3,
    title: '베어드홀 앞 혼잡 안내',
    body: '현재 베어드홀 앞 구역이 혼잡합니다. 우회로를 이용해 주시기 바랍니다.',
    date: '05.16',
  },
  {
    id: 4,
    title: '분실물 센터 운영 안내',
    body: '분실물 센터는 학생회관 1층 안내 데스크에서 운영합니다. 운영 시간은 10시~22시입니다.',
    date: '05.15',
  },
  {
    id: 5,
    title: '포토부스 운영 시작',
    body: '형남공학관 앞 포토부스가 운영을 시작했습니다. 축제 기념 사진을 남겨보세요!',
    date: '05.15',
  },
  {
    id: 6,
    title: '축제 기간 주차 안내',
    body: '축제 기간 중 캠퍼스 내 일반 차량 진입이 제한됩니다. 외부 주차장을 이용해 주세요.',
    date: '05.14',
  },
]

export function NoticeSheet({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        className="absolute inset-0 z-30 bg-[rgba(0,0,0,0.4)]"
        style={{ animation: 'festi-fade-in 0.18s ease both' }}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[24px] bg-surface pb-10"
        style={{
          maxHeight: '70%',
          animation:
            'festi-sheet-up 0.28s cubic-bezier(0.25,0.46,0.45,0.94) both',
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div className="size-5 text-ink-80">{I.megaphone()}</div>
            <span className="text-[17px] font-extrabold tracking-[-0.4px] text-ink">
              공지사항
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-surface-alt p-1.5 text-ink-60"
          >
            <svg viewBox="0 0 16 16" fill="none" width="100%" height="100%">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto px-5">
          {NOTICES.map((n) => (
            <div
              key={n.id}
              className="rounded-[16px] border border-border bg-bg p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                <div className="text-[14px] font-bold tracking-[-0.3px] text-ink">
                  {n.title}
                </div>
                <span className="shrink-0 text-[11px] text-ink-40">
                  {n.date}
                </span>
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-ink-60">
                {n.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
