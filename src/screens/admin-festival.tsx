import type { ReactNode, ReactElement } from 'react'
import { SPOT_TOKENS, SPOT_FONT, tone, SpotterMark, I, PhotoSlot, Pill } from '../tokens'
import { Switch } from './mobile-waiting'

// ── Shared admin chrome ───────────────────────────────────────────────────────

export function AdminShell({ active = 'booths', children, dark = false }: {
  active?: string
  children: ReactNode
  dark?: boolean
}) {
  const t = tone()
  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: t.bg, fontFamily: SPOT_FONT, color: t.ink,
      overflow: 'hidden',
    }}>
      <AdminSidebar active={active} dark={dark} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function AdminSidebar({ active }: { active: string; dark?: boolean }) {
  const t = tone()
  const items: Array<{ id: string; l: string; ico: (c?: string) => ReactElement; n: number | null }> = [
    { id: 'home',     l: '대시보드',   ico: I.home,     n: null },
    { id: 'festival', l: '축제 설정',  ico: I.settings, n: null },
    { id: 'booths',   l: '부스 배치',  ico: I.map,      n: 77   },
    { id: 'menus',    l: '메뉴/상품',  ico: I.ticket,   n: null },
    { id: 'waiting',  l: '웨이팅 관리', ico: I.bell,    n: 14   },
    { id: 'trucks',   l: '푸드트럭',   ico: I.truck,    n: 11   },
    { id: 'notices',  l: '공지/이벤트', ico: I.star,    n: null },
  ]
  return (
    <div style={{
      width: 240, height: '100%', flexShrink: 0,
      background: t.surface, borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 22 }}>
        <SpotterMark size={20} />
        <Pill color={SPOT_TOKENS.alert} ink="#fff" style={{ fontSize: 9, letterSpacing: 0.5 }}>ADMIN</Pill>
      </div>

      <div style={{
        padding: '10px 12px', background: t.surfaceAlt,
        border: `1px solid ${t.border}`, borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: SPOT_TOKENS.mint, padding: 7, color: SPOT_TOKENS.ink }}>{I.star()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: t.ink60, letterSpacing: 0.5 }}>FESTIVAL</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, letterSpacing: -0.2 }}>2026 봄축제</div>
        </div>
        <div style={{ width: 14, height: 14, color: t.ink60 }}>{I.chev(undefined, 'd')}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const on = it.id === active
          return (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              background: on ? t.cta : 'transparent',
              color: on ? t.ctaInk : t.ink80,
              fontSize: 14, fontWeight: on ? 700 : 600, letterSpacing: -0.2,
              cursor: 'pointer',
            }}>
              <div style={{ width: 18, height: 18 }}>{it.ico(on ? '#fff' : t.ink60)}</div>
              <div style={{ flex: 1 }}>{it.l}</div>
              {it.n != null && (
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  background: on ? SPOT_TOKENS.mint : t.surfaceAlt,
                  color: on ? SPOT_TOKENS.ink : t.ink80,
                  padding: '2px 7px', borderRadius: 9999,
                }}>{it.n}</div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: 12, borderRadius: 14, background: t.cta, color: t.ctaInk, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: SPOT_TOKENS.mint, boxShadow: `0 0 0 3px ${SPOT_TOKENS.mint}33` }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>LIVE</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, letterSpacing: -0.2 }}>2일차 · 야간 모드</div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>20:14 · 1,243명 접속중</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: SPOT_TOKENS.pop, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>김</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.ink }}>김총학 매니저</div>
          <div style={{ fontSize: 10, color: t.ink60 }}>제 31대 총학생회</div>
        </div>
      </div>
    </div>
  )
}

export function AdminTopBar({ title, sub, right }: {
  title: string
  sub?: string
  dark?: boolean
  right?: ReactNode
}) {
  const t = tone()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${t.border}`,
      background: t.surface,
    }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.ink, letterSpacing: -0.5 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: t.ink60, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>
    </div>
  )
}

export function AdminBtn({ children, primary, ghost, icon }: {
  children?: ReactNode
  primary?: boolean
  ghost?: boolean
  dark?: boolean
  icon?: ReactElement
}) {
  const t = tone()
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '9px 14px', borderRadius: 12,
      background: primary ? t.cta : ghost ? 'transparent' : t.surface,
      color: primary ? t.ctaInk : t.ink80,
      border: `1px solid ${primary ? t.cta : t.border}`,
      fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      {icon && <div style={{ width: 14, height: 14 }}>{icon}</div>}
      {children}
    </div>
  )
}

// ── Internal card / field primitives ─────────────────────────────────────────

function Card({ title, right, children }: {
  title?: string
  right?: ReactNode
  children: ReactNode
  dark?: boolean
}) {
  const t = tone()
  return (
    <div style={{ background: t.surface, borderRadius: 18, border: `1px solid ${t.border}`, padding: 18 }}>
      {(title || right) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: t.ink, letterSpacing: -0.3 }}>{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode; dark?: boolean }) {
  const t = tone()
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.ink60, letterSpacing: -0.1, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

function TextInput({ value, icon }: { value: string; dark?: boolean; icon?: ReactElement }) {
  const t = tone()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 12px', borderRadius: 12,
      background: t.bg, border: `1px solid ${t.border}`,
      fontSize: 13, fontWeight: 600, color: t.ink, letterSpacing: -0.2,
    }}>
      {icon && <div style={{ width: 14, height: 14 }}>{icon}</div>}
      <div style={{ flex: 1 }}>{value}</div>
    </div>
  )
}

function ToggleRow({ title, sub, on, last }: {
  title: string
  sub?: string
  on?: boolean
  dark?: boolean
  last?: boolean
}) {
  const t = tone()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${t.border}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, letterSpacing: -0.2 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>{sub}</div>}
      </div>
      <Switch on={!!on} />
    </div>
  )
}

function TimeRow({ ico, label, range }: {
  ico: () => ReactElement
  label: string
  range: string
  dark?: boolean
}) {
  const t = tone()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: t.surface, padding: 6, color: t.ink60, border: `1px solid ${t.border}` }}>{ico()}</div>
      <div>
        <div style={{ fontSize: 10, color: t.ink60, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, letterSpacing: -0.2, fontFamily: 'ui-monospace, "SF Mono", monospace' }}>{range}</div>
      </div>
    </div>
  )
}

// ── Screen: Festival Settings ─────────────────────────────────────────────────

export function AdminFestival({ dark = false }: { dark?: boolean }) {
  const t = tone()
  return (
    <AdminShell active="festival" dark={dark}>
      <AdminTopBar
        title="축제 설정"
        sub="기본 정보와 일정, 운영 시간을 관리해요"
        dark={dark}
        right={<>
          <AdminBtn dark={dark} ghost>변경사항 취소</AdminBtn>
          <AdminBtn dark={dark} primary icon={I.check('#fff')}>저장</AdminBtn>
        </>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, padding: 24, overflow: 'auto' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Card dark={dark} title="기본 정보">
            <Field label="축제명" dark={dark}>
              <TextInput value="2026 숭실대학교 봄축제" dark={dark} />
            </Field>
            <Field label="부제 / 슬로건" dark={dark}>
              <TextInput value="비상 飛上 — 다시, 봄" dark={dark} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="시작일" dark={dark}>
                <TextInput value="2026.05.20 (수)" dark={dark} icon={I.clock(SPOT_TOKENS.ink60)} />
              </Field>
              <Field label="종료일" dark={dark}>
                <TextInput value="2026.05.22 (금)" dark={dark} icon={I.clock(SPOT_TOKENS.ink60)} />
              </Field>
            </div>
          </Card>

          <Card dark={dark} title="일자별 운영 시간"
                right={<AdminBtn dark={dark} ghost icon={I.plus(SPOT_TOKENS.ink60)}>일차 추가</AdminBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { d: '1일차', date: '05.20 수', day: '11:00 — 17:00', night: '17:00 — 22:00', booths: 58  },
                { d: '2일차', date: '05.21 목', day: '11:00 — 17:00', night: '17:00 — 23:00', booths: 77, current: true },
                { d: '3일차', date: '05.22 금', day: '11:00 — 16:00', night: '16:00 — 21:00', booths: 64  },
              ].map((d, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '92px 1fr 1fr 80px 28px',
                  gap: 12, alignItems: 'center',
                  padding: 12, borderRadius: 14,
                  background: d.current ? SPOT_TOKENS.coralSoft : t.surfaceAlt,
                  border: `1px solid ${d.current ? SPOT_TOKENS.coral : t.border}`,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: t.ink, letterSpacing: -0.3 }}>{d.d}</div>
                    <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>{d.date}</div>
                  </div>
                  <TimeRow ico={I.sun} label="주간" range={d.day} dark={dark} />
                  <TimeRow ico={I.moon} label="야간" range={d.night} dark={dark} />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>{d.booths}</div>
                    <div style={{ fontSize: 10, color: t.ink60 }}>부스</div>
                  </div>
                  <div style={{ width: 18, height: 18, color: t.ink40 }}>{I.dots()}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card dark={dark} title="공개 설정">
            <ToggleRow dark={dark} title="사용자 앱에 공개"      sub="비공개 시 사용자는 시작 전 안내 화면을 봐요" on />
            <ToggleRow dark={dark} title="웨이팅 시스템 활성화"   sub="야간 부스는 별도로 설정 가능" on />
            <ToggleRow dark={dark} title="푸드트럭 별도 카테고리"  sub="홈에 푸드트럭 섹션 노출" on />
            <ToggleRow dark={dark} title="실시간 혼잡도 표시"     sub="ML 추정치 기준" last />
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card dark={dark} title="브랜드 컬러">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[
                { l: '메인', c: SPOT_TOKENS.mint, on: true  },
                { l: '장착', c: SPOT_TOKENS.pop              },
                { l: '강조', c: SPOT_TOKENS.sun              },
                { l: '잉크', c: SPOT_TOKENS.ink              },
              ].map((x, i) => (
                <div key={i} style={{ borderRadius: 12, padding: 8, border: `2px solid ${x.on ? t.cta : t.border}` }}>
                  <div style={{ height: 44, borderRadius: 8, background: x.c, marginBottom: 6 }} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.ink, letterSpacing: -0.2 }}>{x.l}</div>
                  <div style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: t.ink60 }}>{x.c}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card dark={dark} title="배너 이미지">
            <div style={{ position: 'relative' }}>
              <PhotoSlot label="hero banner · 1920×720" tone="mint" ratio="16/6" radius={12} />
              <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 6 }}>
                <Pill color="rgba(255,255,255,0.92)" ink={SPOT_TOKENS.ink}>변경</Pill>
                <Pill color="rgba(255,255,255,0.92)" ink={SPOT_TOKENS.ink}>편집</Pill>
              </div>
            </div>
            <div style={{ fontSize: 11, color: t.ink60, marginTop: 8 }}>
              메인 홈 상단과 알림 카드에 표시됩니다.
            </div>
          </Card>

          <Card dark={dark} title="권한 관리"
                right={<AdminBtn dark={dark} ghost icon={I.plus(SPOT_TOKENS.ink60)}>초대</AdminBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { n: '김총학',  r: '최고관리자',    c: SPOT_TOKENS.ink   },
                { n: '박운영',  r: '부스 관리자',   c: SPOT_TOKENS.grape },
                { n: '이미디어', r: '컨텐츠 편집자', c: SPOT_TOKENS.leaf  },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, background: t.surfaceAlt }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: p.c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800 }}>{p.n[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.ink, letterSpacing: -0.2 }}>{p.n}</div>
                    <div style={{ fontSize: 11, color: t.ink60 }}>{p.r}</div>
                  </div>
                  <div style={{ width: 16, height: 16, color: t.ink40 }}>{I.dots()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
