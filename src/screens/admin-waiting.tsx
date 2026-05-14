import type { ReactElement, ReactNode } from 'react'
import { SPOT_TOKENS, SPOT_FONT, tone, I, PhotoSlot, Pill } from '../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './admin-festival'
import { Chip } from './admin-booths'

// ── Row action button ─────────────────────────────────────────────────────────

export function RowBtn({
  children,
  primary,
  icon,
}: {
  children?: ReactNode
  primary?: boolean
  icon?: ReactElement
  dark?: boolean
}) {
  const t = tone()
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: children ? '6px 10px' : 6,
        borderRadius: 9,
        background: primary ? t.cta : t.surface,
        color: primary ? t.ctaInk : t.ink80,
        border: `1px solid ${primary ? t.cta : t.border}`,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: -0.2,
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <div style={{ width: 13, height: 13 }}>{icon}</div>}
      {children}
    </div>
  )
}

// ── Screen: Waiting Management ────────────────────────────────────────────────

export function AdminWaiting({ dark = false }: { dark?: boolean }) {
  const t = tone()

  const queue = [
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

  const stateMeta: Record<string, { l: string; c: string; fc: string }> = {
    seated: { l: '입장 완료', c: t.surfaceAlt, fc: t.ink60 },
    called: { l: '호출중', c: SPOT_TOKENS.pop, fc: SPOT_TOKENS.ink },
    waiting: { l: '대기중', c: SPOT_TOKENS.popSoft, fc: SPOT_TOKENS.ink },
    'no-show': { l: '미도착', c: '#F3D1D1', fc: '#7A2E2E' },
  }

  return (
    <AdminShell active="waiting" dark={dark}>
      <AdminTopBar
        title="웨이팅 관리"
        sub="컴공과 칵테일 바 (#16) · 2일차 야간 · 21:28 기준"
        dark={dark}
        right={
          <>
            <AdminBtn dark={dark} icon={I.bell(SPOT_TOKENS.ink60)}>
              전체 알림
            </AdminBtn>
            <AdminBtn dark={dark} ghost icon={I.minus(SPOT_TOKENS.ink60)}>
              일시정지
            </AdminBtn>
            <AdminBtn dark={dark} primary icon={I.plus('#fff')}>
              현장 등록
            </AdminBtn>
          </>
        }
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          fontFamily: SPOT_FONT,
        }}
      >
        {/* Booth selector sidebar */}
        <div
          style={{
            width: 260,
            borderRight: `1px solid ${t.border}`,
            background: t.surface,
            display: 'flex',
            flexDirection: 'column',
            padding: '14px 0',
          }}
        >
          <div
            style={{
              padding: '0 14px 8px',
              fontSize: 11,
              fontWeight: 700,
              color: t.ink60,
              letterSpacing: 0.4,
            }}
          >
            웨이팅 운영 부스
          </div>
          {[
            {
              id: 16,
              name: '컴공과 칵테일 바',
              total: 5,
              wait: 5,
              tone: 'rose',
              on: true,
            },
            {
              id: 17,
              name: '경영대 호프 1관',
              total: 12,
              wait: 12,
              tone: 'leaf',
            },
            { id: 22, name: '의약학부 술집', total: 3, wait: 3, tone: 'rose' },
            { id: 24, name: '글로벌통상학과', total: 2, wait: 2, tone: 'leaf' },
            { id: 38, name: '체대 곱창집', total: 8, wait: 8, tone: 'mint' },
            { id: 47, name: '미디어부 라멘', total: 0, wait: 0, tone: 'sun' },
            { id: 53, name: '아랍어과 비빔', total: 4, wait: 4, tone: 'coral' },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: b.on ? SPOT_TOKENS.coralSoft : 'transparent',
                borderLeft: b.on
                  ? `3px solid ${t.cta}`
                  : '3px solid transparent',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <PhotoSlot label="" tone={b.tone} radius={9} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.ink,
                    letterSpacing: -0.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {b.name}
                </div>
                <div style={{ fontSize: 11, color: t.ink60 }}>#{b.id}</div>
              </div>
              <div
                style={{
                  background: b.wait > 0 ? SPOT_TOKENS.alert : t.surfaceAlt,
                  color: b.wait > 0 ? '#fff' : t.ink60,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 7px',
                  borderRadius: 9999,
                  minWidth: 22,
                  textAlign: 'center',
                }}
              >
                {b.wait}
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 24, overflow: 'auto', minWidth: 0 }}>
          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              {
                l: '대기중',
                v: 5,
                sub: '오늘 누적 32팀',
                c: SPOT_TOKENS.ink,
                big: true,
              },
              {
                l: '평균 대기 시간',
                v: '14분',
                sub: '직전 30분 기준',
                c: SPOT_TOKENS.ink,
              },
              {
                l: '입장 완료',
                v: 27,
                sub: '회전율 양호',
                c: SPOT_TOKENS.leaf,
              },
              { l: '미도착', v: 2, sub: '자동 취소 적용', c: SPOT_TOKENS.sun },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: t.surface,
                  borderRadius: 16,
                  border: `1px solid ${t.border}`,
                  padding: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -12,
                    top: -12,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: s.c,
                    opacity: 0.12,
                  }}
                />
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: t.ink60,
                    letterSpacing: -0.1,
                  }}
                >
                  {s.l}
                </div>
                <div
                  style={{
                    fontSize: s.big ? 36 : 26,
                    fontWeight: 800,
                    color: t.ink,
                    letterSpacing: -1,
                    lineHeight: 1.1,
                    marginTop: 6,
                  }}
                >
                  {s.v}
                </div>
                <div style={{ fontSize: 11, color: t.ink60, marginTop: 4 }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Chip dark={dark} label="전체" badge="10" active />
            <Chip dark={dark} label="대기중" badge="5" />
            <Chip dark={dark} label="호출중" badge="2" />
            <Chip dark={dark} label="입장 완료" badge="2" />
            <Chip dark={dark} label="미도착" badge="1" />
            <div style={{ flex: 1 }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 11px',
                borderRadius: 10,
                background: t.surface,
                border: `1px solid ${t.border}`,
                fontSize: 12,
                color: t.ink60,
                fontWeight: 600,
              }}
            >
              <div style={{ width: 13, height: 13 }}>{I.clock()}</div>
              자동 호출 5분 미도착 시 취소
            </div>
          </div>

          {/* Queue table */}
          <div
            style={{
              background: t.surface,
              borderRadius: 18,
              border: `1px solid ${t.border}`,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '54px 1.4fr 76px 96px 100px 100px 200px',
                padding: '12px 18px',
                gap: 12,
                borderBottom: `1px solid ${t.border}`,
                fontSize: 11,
                fontWeight: 700,
                color: t.ink60,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                background: t.surfaceAlt,
              }}
            >
              <div>대기번호</div>
              <div>고객 / 연락처</div>
              <div>인원</div>
              <div>등록 시각</div>
              <div>경과</div>
              <div>상태</div>
              <div style={{ textAlign: 'right' }}>액션</div>
            </div>
            {queue.map((q, i) => {
              const sm = stateMeta[q.state] ?? stateMeta['waiting']
              return (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '54px 1.4fr 76px 96px 100px 100px 200px',
                    padding: '12px 18px',
                    gap: 12,
                    alignItems: 'center',
                    background: q.highlight
                      ? SPOT_TOKENS.coralSoft
                      : i % 2 === 1
                        ? t.bg
                        : 'transparent',
                    borderBottom:
                      i < queue.length - 1 ? `1px solid ${t.border}` : 'none',
                    borderLeft: q.highlight
                      ? `3px solid ${t.cta}`
                      : '3px solid transparent',
                    marginLeft: q.highlight ? -3 : 0,
                    fontSize: 13,
                    color: t.ink,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: q.state === 'waiting' ? t.cta : t.surfaceAlt,
                      color: q.state === 'waiting' ? t.ctaInk : t.ink80,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: -0.4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {q.no}
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <PhotoSlot label="" tone={q.tone} radius={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, letterSpacing: -0.2 }}>
                        {q.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: t.ink60,
                          fontFamily: 'ui-monospace, monospace',
                        }}
                      >
                        {q.phone}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {q.size}
                    <span style={{ fontSize: 11, color: t.ink60 }}>명</span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: t.ink80,
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {q.enter}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: q.state === 'waiting' ? SPOT_TOKENS.ink : t.ink60,
                    }}
                  >
                    {q.wait}
                  </div>
                  <div>
                    <Pill color={sm.c} ink={sm.fc} style={{ fontSize: 11 }}>
                      {q.state === 'called' && (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: sm.fc,
                            display: 'inline-block',
                            marginRight: 4,
                          }}
                        />
                      )}
                      {sm.l}
                    </Pill>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      justifyContent: 'flex-end',
                    }}
                  >
                    {q.state === 'waiting' && (
                      <>
                        <RowBtn dark={dark} primary icon={I.call('#fff')}>
                          호출
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.check(SPOT_TOKENS.ink60)}>
                          입장
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.dots(SPOT_TOKENS.ink60)} />
                      </>
                    )}
                    {q.state === 'called' && (
                      <>
                        <RowBtn dark={dark} primary icon={I.check('#fff')}>
                          입장
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.call(SPOT_TOKENS.ink60)}>
                          재호출
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.dots(SPOT_TOKENS.ink60)} />
                      </>
                    )}
                    {q.state === 'seated' && (
                      <>
                        <RowBtn dark={dark} icon={I.check(SPOT_TOKENS.leaf)}>
                          완료
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.dots(SPOT_TOKENS.ink60)} />
                      </>
                    )}
                    {q.state === 'no-show' && (
                      <>
                        <RowBtn dark={dark} icon={I.call(SPOT_TOKENS.ink60)}>
                          재시도
                        </RowBtn>
                        <RowBtn dark={dark} icon={I.trash(SPOT_TOKENS.ink60)}>
                          삭제
                        </RowBtn>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              fontSize: 12,
              color: t.ink60,
            }}
          >
            <div>총 32건 중 1-10 · 다음 호출 예측 #35 (정시현 4명 다음)</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <AdminBtn dark={dark} icon={I.chev(SPOT_TOKENS.ink60, 'l')} />
              <AdminBtn dark={dark} icon={I.chev(SPOT_TOKENS.ink60, 'r')} />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
