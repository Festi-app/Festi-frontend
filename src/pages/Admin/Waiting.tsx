import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { FESTI_TOKENS, I, PhotoSlot, Pill } from '../../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'

type QueueState = 'seated' | 'called' | 'waiting' | 'no-show'

interface QueueEntry {
  no: number
  name: string
  phone: string
  size: number
  state: QueueState
  enter: string
  wait: string
  tone: string
  highlight?: boolean
}

interface BoothWaitItem {
  id: number
  name: string
  wait: number
  tone: string
}

const BOOTHS: BoothWaitItem[] = [
  { id: 16, name: '컴공과 칵테일 바', wait: 5, tone: 'rose' },
  { id: 17, name: '경영대 호프 1관', wait: 12, tone: 'leaf' },
  { id: 22, name: '의약학부 술집', wait: 3, tone: 'rose' },
  { id: 24, name: '글로벌통상학과', wait: 2, tone: 'leaf' },
  { id: 38, name: '체대 곱창집', wait: 8, tone: 'mint' },
  { id: 47, name: '미디어부 라멘', wait: 0, tone: 'sun' },
  { id: 53, name: '아랍어과 비빔', wait: 4, tone: 'coral' },
]

const INITIAL_QUEUE: QueueEntry[] = [
  {
    no: 30,
    name: '김민준',
    phone: '010-•••-2384',
    size: 4,
    state: 'seated',
    enter: '20:42',
    wait: '12분',
    tone: 'rose',
  },
  {
    no: 31,
    name: '이서윤',
    phone: '010-•••-7720',
    size: 2,
    state: 'seated',
    enter: '20:48',
    wait: '10분',
    tone: 'mint',
  },
  {
    no: 32,
    name: '박지우',
    phone: '010-•••-0114',
    size: 6,
    state: 'called',
    enter: '20:55',
    wait: '8분',
    tone: 'coral',
  },
  {
    no: 33,
    name: '최도현',
    phone: '010-•••-9904',
    size: 3,
    state: 'called',
    enter: '21:02',
    wait: '6분',
    tone: 'sun',
  },
  {
    no: 34,
    name: '정시현',
    phone: '010-•••-8821',
    size: 4,
    state: 'waiting',
    enter: '21:14',
    wait: '진행중',
    tone: 'grape',
    highlight: true,
  },
  {
    no: 35,
    name: '한지민',
    phone: '010-•••-3340',
    size: 2,
    state: 'waiting',
    enter: '21:18',
    wait: '+4분',
    tone: 'leaf',
  },
  {
    no: 36,
    name: '오태윤',
    phone: '010-•••-5512',
    size: 5,
    state: 'waiting',
    enter: '21:21',
    wait: '+7분',
    tone: 'rose',
  },
  {
    no: 37,
    name: '서윤아',
    phone: '010-•••-1180',
    size: 3,
    state: 'waiting',
    enter: '21:24',
    wait: '+10분',
    tone: 'mint',
  },
  {
    no: 38,
    name: '조하은',
    phone: '010-•••-7755',
    size: 4,
    state: 'waiting',
    enter: '21:27',
    wait: '+14분',
    tone: 'coral',
  },
  {
    no: 29,
    name: '문건우',
    phone: '010-•••-2118',
    size: 2,
    state: 'no-show',
    enter: '20:38',
    wait: '미도착',
    tone: 'sun',
  },
]

const STATE_META: Record<
  QueueState,
  { label: string; color: string; ink: string }
> = {
  seated: {
    label: '입장 완료',
    color: 'var(--surface-alt)',
    ink: 'var(--ink-60)',
  },
  called: { label: '호출중', color: FESTI_TOKENS.pop, ink: FESTI_TOKENS.ink },
  waiting: {
    label: '대기중',
    color: FESTI_TOKENS.popSoft,
    ink: FESTI_TOKENS.ink,
  },
  'no-show': { label: '미도착', color: '#F3D1D1', ink: '#7A2E2E' },
}

const FILTERS = ['전체', '대기중', '호출중', '입장 완료', '미도착'] as const

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Row action button ─────────────────────────────────────────────────────────

export function RowBtn({
  children,
  primary,
  icon,
  onClick,
}: {
  children?: ReactNode
  primary?: boolean
  icon?: ReactElement
  dark?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-[9px] border px-2.5 py-1.5 text-xs font-bold tracking-[-0.2px]',
        !children && 'p-1.5',
        primary
          ? 'border-cta bg-cta text-cta-ink'
          : 'border-border bg-surface text-ink-80'
      )}
    >
      {icon && <div className="size-3.25">{icon}</div>}
      {children}
    </button>
  )
}

function FilterChip({
  label,
  badge,
  active,
  onClick,
}: {
  label: string
  badge: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.25 rounded-full border px-2.75 py-1.75 text-xs font-bold tracking-[-0.2px]',
        active
          ? 'border-cta bg-cta text-cta-ink'
          : 'border-border bg-surface text-ink-80'
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 py-0.25 text-[10px]',
          active ? 'bg-pop text-white' : 'bg-surface-alt text-ink-60'
        )}
      >
        {badge}
      </span>
    </button>
  )
}

function stateCount(queue: QueueEntry[], filter: string) {
  if (filter === '대기중')
    return queue.filter((q) => q.state === 'waiting').length
  if (filter === '호출중')
    return queue.filter((q) => q.state === 'called').length
  if (filter === '입장 완료') {
    return queue.filter((q) => q.state === 'seated').length
  }
  if (filter === '미도착')
    return queue.filter((q) => q.state === 'no-show').length
  return queue.length
}

// ── Screen: Waiting Management ────────────────────────────────────────────────

export function AdminWaiting({ dark = false }: { dark?: boolean }) {
  const [notice, setNotice] = useState('컴공과 칵테일 바 (#16) · 2일차 야간')
  const [selectedBoothId, setSelectedBoothId] = useState(16)
  const [queueFilter, setQueueFilter] = useState('전체')
  const [paused, setPaused] = useState(false)
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL_QUEUE)

  const filteredQueue = queue.filter((entry) => {
    if (queueFilter === '대기중') return entry.state === 'waiting'
    if (queueFilter === '호출중') return entry.state === 'called'
    if (queueFilter === '입장 완료') return entry.state === 'seated'
    if (queueFilter === '미도착') return entry.state === 'no-show'
    return true
  })

  const updateQueueState = (no: number, state: QueueState, wait: string) => {
    setQueue((current) =>
      current.map((entry) =>
        entry.no === no ? { ...entry, state, wait, highlight: true } : entry
      )
    )
  }

  return (
    <AdminShell active="waiting" dark={dark}>
      <AdminTopBar
        title="웨이팅 관리"
        sub={`${notice} · ${paused ? '일시정지 중' : '운영중'}`}
        dark={dark}
        right={
          <>
            <AdminBtn
              dark={dark}
              icon={I.bell(FESTI_TOKENS.ink60)}
              onClick={() => setNotice('전체 알림을 발송했어요')}
            >
              전체 알림
            </AdminBtn>
            <AdminBtn
              dark={dark}
              ghost
              icon={I.minus(FESTI_TOKENS.ink60)}
              onClick={() => {
                setPaused((current) => !current)
                setNotice(
                  paused
                    ? '웨이팅 운영을 재개했어요'
                    : '웨이팅 접수를 일시정지했어요'
                )
              }}
            >
              {paused ? '재개' : '일시정지'}
            </AdminBtn>
            <AdminBtn
              dark={dark}
              primary
              icon={I.plus('#fff')}
              onClick={() => {
                const nextNo = Math.max(...queue.map((entry) => entry.no)) + 1
                setQueue((current) => [
                  ...current,
                  {
                    no: nextNo,
                    name: '현장 등록',
                    phone: '010-•••-0000',
                    size: 2,
                    state: 'waiting',
                    enter: '방금',
                    wait: '진행중',
                    tone: 'mint',
                    highlight: true,
                  },
                ])
                setNotice(`#${nextNo} 현장 대기를 등록했어요`)
              }}
            >
              현장 등록
            </AdminBtn>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 font-festi">
        <aside className="flex w-65 shrink-0 flex-col border-r border-border bg-surface py-3.5">
          <div className="px-3.5 pb-2 text-[11px] font-bold tracking-[0.4px] text-ink-60">
            웨이팅 운영 부스
          </div>

          {BOOTHS.map((booth) => {
            const selected = booth.id === selectedBoothId
            return (
              <button
                type="button"
                key={booth.id}
                onClick={() => {
                  setSelectedBoothId(booth.id)
                  setNotice(`${booth.name} (#${booth.id}) 웨이팅을 보고 있어요`)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 border-y-0 border-r-0 py-2.5 pr-3.5 pl-3 text-left',
                  selected
                    ? 'border-l-3 border-l-cta bg-coral-soft'
                    : 'border-l-3 border-l-transparent bg-transparent'
                )}
              >
                <div className="size-8.5 shrink-0 overflow-hidden rounded-[9px]">
                  <PhotoSlot label="" tone={booth.tone} radius={9} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold tracking-[-0.2px] text-ink">
                    {booth.name}
                  </div>
                  <div className="text-[11px] text-ink-60">#{booth.id}</div>
                </div>
                <div
                  className={cn(
                    'min-w-5.5 rounded-full px-1.75 py-0.75 text-center text-[11px] font-extrabold',
                    booth.wait > 0
                      ? 'bg-alert text-white'
                      : 'bg-surface-alt text-ink-60'
                  )}
                >
                  {booth.wait}
                </div>
              </button>
            )
          })}
        </aside>

        <main className="min-w-0 flex-1 overflow-auto p-6">
          <div className="mb-4.5 grid grid-cols-4 gap-3">
            {[
              {
                label: '대기중',
                value: stateCount(queue, '대기중'),
                sub: '오늘 누적 32팀',
                accent: 'bg-ink',
                big: true,
              },
              {
                label: '평균 대기 시간',
                value: '14분',
                sub: '직전 30분 기준',
                accent: 'bg-ink',
              },
              {
                label: '입장 완료',
                value: stateCount(queue, '입장 완료'),
                sub: '회전율 양호',
                accent: 'bg-leaf',
              },
              {
                label: '미도착',
                value: stateCount(queue, '미도착'),
                sub: '자동 취소 적용',
                accent: 'bg-sun',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4"
              >
                <div
                  className={cn(
                    'absolute -top-3 -right-3 size-14 rounded-full opacity-12',
                    stat.accent
                  )}
                />
                <div className="text-[11px] font-bold tracking-[-0.1px] text-ink-60">
                  {stat.label}
                </div>
                <div
                  className={cn(
                    'mt-1.5 leading-[1.1] font-extrabold tracking-[-1px] text-ink',
                    stat.big ? 'text-4xl' : 'text-[26px]'
                  )}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-ink-60">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="mb-3 flex items-center gap-2">
            {FILTERS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                badge={String(stateCount(queue, filter))}
                active={queueFilter === filter}
                onClick={() => {
                  setQueueFilter(filter)
                  setNotice(`${filter} 목록을 보고 있어요`)
                }}
              />
            ))}
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 rounded-[10px] border border-border bg-surface px-2.75 py-1.75 text-xs font-semibold text-ink-60">
              <div className="size-3.25">{I.clock()}</div>
              자동 호출 5분 미도착 시 취소
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-border bg-surface">
            <div className="grid grid-cols-[54px_1.4fr_76px_96px_100px_100px_200px] gap-3 border-b border-border bg-surface-alt px-4.5 py-3 text-[11px] font-bold tracking-[0.3px] text-ink-60 uppercase">
              <div>대기번호</div>
              <div>고객 / 연락처</div>
              <div>인원</div>
              <div>등록 시각</div>
              <div>경과</div>
              <div>상태</div>
              <div className="text-right">액션</div>
            </div>

            {filteredQueue.map((entry, index) => {
              const meta = STATE_META[entry.state]
              return (
                <div
                  key={entry.no}
                  className={cn(
                    'grid grid-cols-[54px_1.4fr_76px_96px_100px_100px_200px] items-center gap-3 border-l-3 px-4.5 py-3 text-[13px] text-ink',
                    index < filteredQueue.length - 1 &&
                      'border-b border-border',
                    entry.highlight
                      ? 'border-l-cta bg-coral-soft'
                      : index % 2 === 1
                        ? 'border-l-transparent bg-bg'
                        : 'border-l-transparent bg-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex size-9.5 items-center justify-center rounded-[10px] text-sm font-extrabold tracking-[-0.4px]',
                      entry.state === 'waiting'
                        ? 'bg-cta text-cta-ink'
                        : 'bg-surface-alt text-ink-80'
                    )}
                  >
                    {entry.no}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="size-7 shrink-0 overflow-hidden rounded-full">
                      <PhotoSlot label="" tone={entry.tone} radius={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold tracking-[-0.2px]">
                        {entry.name}
                      </div>
                      <div className="font-mono text-[11px] text-ink-60">
                        {entry.phone}
                      </div>
                    </div>
                  </div>

                  <div className="font-bold">
                    {entry.size}
                    <span className="text-[11px] text-ink-60">명</span>
                  </div>
                  <div className="font-mono text-xs text-ink-80">
                    {entry.enter}
                  </div>
                  <div
                    className={cn(
                      'text-xs font-bold',
                      entry.state === 'waiting' ? 'text-ink' : 'text-ink-60'
                    )}
                  >
                    {entry.wait}
                  </div>
                  <div>
                    <Pill color={meta.color} ink={meta.ink}>
                      {entry.state === 'called' && (
                        <span className="mr-1 inline-block size-[5px] rounded-full bg-[#141A1F]" />
                      )}
                      {meta.label}
                    </Pill>
                  </div>

                  <div className="flex justify-end gap-1.5">
                    {entry.state === 'waiting' && (
                      <>
                        <RowBtn
                          dark={dark}
                          primary
                          icon={I.call('#fff')}
                          onClick={() => {
                            updateQueueState(entry.no, 'called', '호출중')
                            setNotice(
                              `#${entry.no} ${entry.name}님을 호출했어요`
                            )
                          }}
                        >
                          호출
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.check(FESTI_TOKENS.ink60)}
                          onClick={() => {
                            updateQueueState(entry.no, 'seated', '입장 완료')
                            setNotice(
                              `#${entry.no} ${entry.name}님 입장을 완료했어요`
                            )
                          }}
                        >
                          입장
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.dots(FESTI_TOKENS.ink60)}
                          onClick={() =>
                            setNotice(`#${entry.no} 상세 메뉴를 열었어요`)
                          }
                        />
                      </>
                    )}
                    {entry.state === 'called' && (
                      <>
                        <RowBtn
                          dark={dark}
                          primary
                          icon={I.check('#fff')}
                          onClick={() => {
                            updateQueueState(entry.no, 'seated', '입장 완료')
                            setNotice(
                              `#${entry.no} ${entry.name}님 입장을 완료했어요`
                            )
                          }}
                        >
                          입장
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.call(FESTI_TOKENS.ink60)}
                          onClick={() =>
                            setNotice(
                              `#${entry.no} ${entry.name}님을 재호출했어요`
                            )
                          }
                        >
                          재호출
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.dots(FESTI_TOKENS.ink60)}
                          onClick={() =>
                            setNotice(`#${entry.no} 상세 메뉴를 열었어요`)
                          }
                        />
                      </>
                    )}
                    {entry.state === 'seated' && (
                      <>
                        <RowBtn
                          dark={dark}
                          icon={I.check(FESTI_TOKENS.leaf)}
                          onClick={() =>
                            setNotice(
                              `#${entry.no} 입장 완료 상태를 확인했어요`
                            )
                          }
                        >
                          완료
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.dots(FESTI_TOKENS.ink60)}
                          onClick={() =>
                            setNotice(`#${entry.no} 상세 메뉴를 열었어요`)
                          }
                        />
                      </>
                    )}
                    {entry.state === 'no-show' && (
                      <>
                        <RowBtn
                          dark={dark}
                          icon={I.call(FESTI_TOKENS.ink60)}
                          onClick={() => {
                            updateQueueState(entry.no, 'called', '재호출')
                            setNotice(
                              `#${entry.no} ${entry.name}님을 재시도 호출했어요`
                            )
                          }}
                        >
                          재시도
                        </RowBtn>
                        <RowBtn
                          dark={dark}
                          icon={I.trash(FESTI_TOKENS.ink60)}
                          onClick={() => {
                            setQueue((current) =>
                              current.filter((item) => item.no !== entry.no)
                            )
                            setNotice(`#${entry.no} 대기를 삭제했어요`)
                          }}
                        >
                          삭제
                        </RowBtn>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3.5 flex items-center justify-between text-xs text-ink-60">
            <div>
              총 {queue.length}건 중 1-{filteredQueue.length} · 다음 호출 예측
              #35 (정시현 4명 다음)
            </div>
            <div className="flex gap-1.5">
              <AdminBtn
                dark={dark}
                icon={I.chev(FESTI_TOKENS.ink60, 'l')}
                onClick={() => setNotice('이전 페이지로 이동했어요')}
              />
              <AdminBtn
                dark={dark}
                icon={I.chev(FESTI_TOKENS.ink60, 'r')}
                onClick={() => setNotice('다음 페이지로 이동했어요')}
              />
            </div>
          </div>
        </main>
      </div>
    </AdminShell>
  )
}
