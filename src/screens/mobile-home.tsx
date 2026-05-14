import { SPOT_TOKENS, SPOT_FONT, tone, SpotterMark, I, PhotoSlot } from '../tokens'

// ── Bottom tab bar (shared across mobile screens) ────────────────────────────

export function SpotTabBar({ active = 'home', dark = false }: { active?: string; dark?: boolean }) {
  const t = tone()
  const items = [
    { id: 'home', label: '홈',    icon: I.home   },
    { id: 'map',  label: '배치도', icon: I.map    },
    { id: 'wait', label: '웨이팅', icon: I.ticket },
    { id: 'me',   label: '마이',  icon: I.user   },
  ]
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14,
      borderRadius: 28, background: dark ? 'rgba(19,38,45,0.92)' : 'rgba(255,255,255,0.92)',
      boxShadow: SPOT_TOKENS.shadow.pop,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,42,51,0.06)'}`,
      display: 'flex', alignItems: 'stretch',
      padding: 6, zIndex: 30,
      fontFamily: SPOT_FONT,
    }}>
      {items.map(it => {
        const on = it.id === active
        return (
          <div key={it.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            padding: '8px 0', borderRadius: 22,
            background: on ? SPOT_TOKENS.mint : 'transparent',
            color: on ? SPOT_TOKENS.ink : t.ink60,
            transition: 'all .15s',
          }}>
            <div style={{ width: 22, height: 22 }}>{it.icon(on ? SPOT_TOKENS.ink : t.ink60)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: -0.2 }}>{it.label}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Top status bar color wash ─────────────────────────────────────────────────

export function SpotStatusWash({ color = '#A9E5E7', height = 58 }: { color?: string; height?: number }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height,
      background: color, zIndex: 1,
    }} />
  )
}

// ── Section header ────────────────────────────────────────────────────────────

export function SectionHeader({ title, sub, more = false }: {
  title: string
  sub: string
  dark?: boolean
  more?: boolean
}) {
  const t = tone()
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 20px', marginBottom: 12,
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.ink, letterSpacing: -0.5 }}>{title}</div>
        <div style={{ fontSize: 12, color: t.ink60, marginTop: 2 }}>{sub}</div>
      </div>
      {more && (
        <div style={{ fontSize: 13, fontWeight: 600, color: t.ink60, display: 'flex', alignItems: 'center', gap: 2 }}>
          전체 <div style={{ width: 12, height: 12 }}>{I.chev(undefined, 'r')}</div>
        </div>
      )}
    </div>
  )
}

// ── Booth card ────────────────────────────────────────────────────────────────

export function BoothCard({ n, name, tag, wait, tone: ph }: {
  n: number
  name: string
  tag: string
  wait: string
  tone: string
  dark?: boolean
}) {
  const t = tone()
  return (
    <div style={{
      flexShrink: 0, width: 152, background: t.surface,
      borderRadius: 20, padding: 10, border: `1px solid ${t.border}`,
    }}>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <PhotoSlot label="" tone={ph} ratio="1/1" radius={14} />
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(15,42,51,0.85)', color: '#fff',
          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999,
        }}>#{n}</div>
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: SPOT_TOKENS.alert, color: '#fff',
          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999,
        }}>{wait}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: t.ink, letterSpacing: -0.3, lineHeight: 1.2 }}>{name}</div>
      <div style={{ fontSize: 11, color: t.ink60, marginTop: 4 }}>{tag} · 진리관 앞</div>
    </div>
  )
}

// ── Screen: Home ─────────────────────────────────────────────────────────────

export function MobileHome({ dark = false, period = 'day' }: { dark?: boolean; period?: string }) {
  const t = tone()
  const isDay = period === 'day'

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: t.bg, fontFamily: SPOT_FONT,
      overflow: 'hidden',
    }}>
      {/* Hero header */}
      <div style={{
        background: t.surface,
        padding: '54px 20px 24px',
        borderBottom: `1px solid ${t.border}`,
        position: 'relative',
      }}>
        {/* nav row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 22, marginTop: 8,
        }}>
          <SpotterMark size={22} color={t.ink} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: t.surfaceAlt, padding: 10, color: t.ink80,
            }}>{I.search()}</div>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: t.surfaceAlt, padding: 10, color: t.ink80, position: 'relative',
            }}>
              {I.bell()}
              <div style={{
                position: 'absolute', top: 8, right: 8, width: 9, height: 9,
                borderRadius: '50%', background: SPOT_TOKENS.pop,
                boxShadow: `0 0 0 2px ${t.surface}`,
              }} />
            </div>
          </div>
        </div>

        {/* Live chip + greeting */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px 4px 4px', borderRadius: 9999,
          background: t.ink, color: '#fff',
          fontSize: 12, fontWeight: 700, letterSpacing: -0.2,
          marginBottom: 14,
        }}>
          <span style={{
            background: SPOT_TOKENS.pop, color: t.ink,
            fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 9999,
            letterSpacing: 0.3,
          }}>LIVE</span>
          2일차 · 봄축제 둘째 날
        </div>
        <div style={{
          fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15,
          color: t.ink,
        }}>
          오늘은 어떤 부스를<br />가볼까요?
        </div>

        {/* Day/Night toggle */}
        <div style={{
          marginTop: 18, background: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: 9999, padding: 3, display: 'flex',
        }}>
          {([
            { id: 'day',   label: '주간', ico: I.sun,  time: '11–17시' },
            { id: 'night', label: '야간', ico: I.moon, time: '17–22시' },
          ] as const).map(o => {
            const on = (o.id === 'day') === isDay
            return (
              <div key={o.id} style={{
                flex: 1, padding: '10px 12px', borderRadius: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: on ? t.cta : 'transparent',
                color: on ? t.ctaInk : t.ink60,
                fontWeight: 700, fontSize: 14, letterSpacing: -0.3,
              }}>
                <div style={{ width: 16, height: 16 }}>{o.ico()}</div>
                {o.label}
                <span style={{ fontSize: 11, fontWeight: 600, opacity: on ? 0.6 : 0.8 }}>
                  · {o.time}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ padding: '18px 0 110px', overflow: 'visible' }}>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, padding: '0 20px', marginBottom: 22 }}>
          {[
            { ico: I.map,    bg: SPOT_TOKENS.mintSoft,  label: '배치도' },
            { ico: I.ticket, bg: SPOT_TOKENS.coralSoft,  label: '내 웨이팅' },
            { ico: I.truck,  bg: SPOT_TOKENS.sunSoft,    label: '푸드트럭' },
            { ico: I.star,   bg: SPOT_TOKENS.grapeSoft,  label: '즐겨찾기' },
          ].map((a, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: a.bg, borderRadius: 18, height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 6, color: SPOT_TOKENS.ink,
              }}>
                <div style={{ width: 24, height: 24 }}>{a.ico()}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.ink80, letterSpacing: -0.2 }}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* Live waiting strip */}
        <div style={{ padding: '0 20px', marginBottom: 22 }}>
          <div style={{
            background: t.cta, color: t.ctaInk,
            borderRadius: 20, padding: 16,
            display: 'flex', alignItems: 'center', gap: 14,
            position: 'relative', overflow: 'hidden',
            boxShadow: SPOT_TOKENS.shadow.hit,
          }}>
            <div style={{
              position: 'absolute', right: -30, top: -30, width: 120, height: 120,
              borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
            }} />
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: SPOT_FONT,
            }}>34</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600, marginBottom: 2 }}>웨이팅 진행 중</div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>경영대 주점 · 앞에 4팀</div>
            </div>
            <div style={{
              padding: '8px 14px', borderRadius: 9999, background: '#fff',
              color: t.cta, fontSize: 13, fontWeight: 800,
            }}>현황</div>
          </div>
        </div>

        {/* 오늘 인기 부스 */}
        <SectionHeader title="오늘 인기 부스" sub="베어드홀 광장 · 78팀 방문 중" dark={dark} />
        <div style={{ display: 'flex', gap: 12, padding: '0 20px', overflowX: 'auto', marginBottom: 24 }}>
          {[
            { n: 16, name: '컴공과 칵테일바', tag: '음료', wait: '7팀',  tone: 'rose'  },
            { n: 24, name: '경영대 호프',      tag: '주점', wait: '12팀', tone: 'leaf'  },
            { n: 38, name: '체대 곱창집',      tag: '야식', wait: '3팀',  tone: 'mint'  },
            { n: 47, name: '미디어부 라멘',    tag: '면류', wait: '5팀',  tone: 'sun'   },
          ].map((b, i) => (
            <BoothCard key={i} {...b} dark={dark} />
          ))}
        </div>

        {/* 푸드트럭 */}
        <SectionHeader title="푸드트럭" sub="총 11대 · 한경직 기념관 앞" dark={dark} more />
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { name: '브라더스 츄러스', sub: '츄러스 · 아이스크림', price: '4,000원~', tone: 'coral' },
            { name: '도쿄 타코야끼',   sub: '타코야끼 · 야끼소바',  price: '6,000원~', tone: 'sun'   },
            { name: '훈제 통삼겹',     sub: '꼬치 · 통삼겹',        price: '7,000원~', tone: 'rose'  },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'center',
              background: t.surface, borderRadius: 18, padding: 10,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                <PhotoSlot label="" tone={f.tone} radius={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.ink, letterSpacing: -0.3 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: t.ink60, marginTop: 2 }}>{f.sub}</div>
                <div style={{ fontSize: 12, color: SPOT_TOKENS.coral, fontWeight: 700, marginTop: 4 }}>{f.price}</div>
              </div>
              <div style={{ width: 16, height: 16, color: t.ink40 }}>{I.chev(undefined, 'r')}</div>
            </div>
          ))}
        </div>

      </div>

      <SpotTabBar active="home" dark={dark} />
    </div>
  )
}

