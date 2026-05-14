import type { ReactElement } from 'react'
import { SPOT_TOKENS, SPOT_FONT, tone, I, PhotoSlot, Pill } from '../../tokens'
import { AdminShell, AdminTopBar, AdminBtn } from './Festival'
import soongsilMap from '../../assets/soongsil-map.png'

// ── Filter controls ───────────────────────────────────────────────────────────

export function Segmented({
  value,
  options,
  icons,
}: {
  value: string
  options: string[]
  icons?: Array<(c?: string) => ReactElement>
  dark?: boolean
}) {
  const t = tone()
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 3,
        borderRadius: 10,
        background: t.surfaceAlt,
        border: `1px solid ${t.border}`,
      }}
    >
      {options.map((o, i) => {
        const on = o === value
        return (
          <div
            key={i}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: on ? t.surface : 'transparent',
              color: on ? t.ink : t.ink60,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: -0.2,
              boxShadow: on ? '0 1px 2px rgba(15,42,51,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {icons && icons[i] && (
              <div style={{ width: 13, height: 13 }}>{icons[i]()}</div>
            )}
            {o}
          </div>
        )
      })}
    </div>
  )
}

export function Chip({
  label,
  badge,
  active,
}: {
  label: string
  badge?: string
  active?: boolean
  dark?: boolean
}) {
  const t = tone()
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 11px',
        borderRadius: 9999,
        background: active ? t.cta : t.surface,
        color: active ? t.ctaInk : t.ink80,
        border: `1px solid ${active ? t.cta : t.border}`,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: -0.2,
      }}
    >
      {label}
      {badge && (
        <span
          style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 9999,
            background: active ? SPOT_TOKENS.pop : t.surfaceAlt,
            color: active ? '#fff' : t.ink60,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

// ── Screen: Booth Placement ───────────────────────────────────────────────────

export function AdminBooths({ dark = false }: { dark?: boolean }) {
  const t = tone()

  const boothList = [
    {
      id: 16,
      name: '컴공과 칵테일 바',
      type: 'night',
      cat: '주점',
      placed: true,
      slots: '4인×8',
      wait: 7,
      tone: 'rose',
    },
    {
      id: 17,
      name: '경영대 호프 1관',
      type: 'night',
      cat: '주점',
      placed: true,
      slots: '4인×6',
      wait: 12,
      tone: 'leaf',
    },
    {
      id: 22,
      name: '의약학부 술집',
      type: 'night',
      cat: '주점',
      placed: true,
      slots: '4인×6',
      wait: 5,
      tone: 'rose',
    },
    {
      id: 24,
      name: '글로벌통상학과',
      type: 'night',
      cat: '주점',
      placed: true,
      slots: '4인×4',
      wait: 2,
      tone: 'leaf',
    },
    {
      id: 6,
      name: '학생회 굿즈샵',
      type: 'day',
      cat: '체험',
      placed: true,
      slots: '—',
      wait: 0,
      tone: 'grape',
    },
    {
      id: 8,
      name: '플리마켓 — 식물',
      type: 'day',
      cat: '판매',
      placed: true,
      slots: '—',
      wait: 0,
      tone: 'leaf',
    },
    {
      id: 12,
      name: '타로 카페',
      type: 'day',
      cat: '체험',
      placed: true,
      slots: '1인×6',
      wait: 3,
      tone: 'grape',
    },
    {
      id: '?',
      name: '베어드홀 영화관',
      type: 'day',
      cat: '체험',
      placed: false,
      slots: '—',
      wait: 0,
      tone: 'sun',
    },
    {
      id: '?',
      name: '컴공 체험관',
      type: 'day',
      cat: '체험',
      placed: false,
      slots: '—',
      wait: 0,
      tone: 'mint',
    },
  ]

  return (
    <AdminShell active="booths" dark={dark}>
      <AdminTopBar
        title="부스 배치"
        sub="2일차 · 야간 · 총 77개 부스 / 미배치 5개"
        dark={dark}
        right={
          <>
            <AdminBtn dark={dark} icon={I.edit(SPOT_TOKENS.ink60)}>
              가져오기
            </AdminBtn>
            <AdminBtn dark={dark} ghost icon={I.plus(SPOT_TOKENS.ink60)}>
              부스 추가
            </AdminBtn>
            <AdminBtn dark={dark} primary icon={I.check('#fff')}>
              배치 저장
            </AdminBtn>
          </>
        }
      />

      {/* Filter row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 28px',
          borderBottom: `1px solid ${t.border}`,
          background: t.surface,
        }}
      >
        <Segmented
          dark={dark}
          value="2일차"
          options={['1일차', '2일차', '3일차']}
        />
        <div
          style={{
            width: 1,
            height: 22,
            background: t.border,
            margin: '0 4px',
          }}
        />
        <Segmented
          dark={dark}
          value="야간"
          options={['주간', '야간']}
          icons={[I.sun, I.moon]}
        />
        <div
          style={{
            width: 1,
            height: 22,
            background: t.border,
            margin: '0 4px',
          }}
        />
        <Chip dark={dark} label="모든 카테고리" />
        <Chip dark={dark} label="주점" badge="32" active />
        <Chip dark={dark} label="푸드트럭" badge="11" />
        <Chip dark={dark} label="체험·판매" badge="24" />
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 10,
            background: t.surfaceAlt,
            border: `1px solid ${t.border}`,
            fontSize: 13,
            color: t.ink60,
          }}
        >
          <div style={{ width: 14, height: 14 }}>{I.search()}</div>
          <span>부스 검색…</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Booth list sidebar */}
        <div
          style={{
            width: 320,
            borderRight: `1px solid ${t.border}`,
            background: t.surface,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: '12px 14px 0',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {['배치됨 72', '미배치 5', '대기 8'].map((l, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px 10px 0 0',
                  color: i === 0 ? t.ink : t.ink60,
                  borderBottom:
                    i === 0 ? `2px solid ${t.cta}` : '2px solid transparent',
                }}
              >
                {l}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '6px 0' }}>
            {boothList.map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 14px',
                  background:
                    b.id === 16 ? SPOT_TOKENS.coralSoft : 'transparent',
                  borderLeft:
                    b.id === 16
                      ? `3px solid ${t.cta}`
                      : '3px solid transparent',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <PhotoSlot label="" tone={b.tone} radius={10} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Pill
                      color={
                        b.type === 'night'
                          ? SPOT_TOKENS.alert
                          : SPOT_TOKENS.popSoft
                      }
                      ink={b.type === 'night' ? '#fff' : SPOT_TOKENS.ink}
                    >
                      {b.type === 'night' ? '야간' : '주간'}
                    </Pill>
                    <Pill color="transparent" ink={t.ink60}>
                      {b.cat}
                    </Pill>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: t.ink,
                      letterSpacing: -0.2,
                      marginTop: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.name}
                  </div>
                  <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>
                    {b.placed ? `#${b.id} · ${b.slots}` : '위치 미지정'}
                  </div>
                </div>
                {!b.placed && (
                  <div
                    style={{
                      fontSize: 10,
                      padding: '3px 6px',
                      borderRadius: 8,
                      background: SPOT_TOKENS.sun,
                      color: SPOT_TOKENS.ink,
                      fontWeight: 700,
                      alignSelf: 'flex-start',
                      marginTop: 2,
                    }}
                  >
                    드래그
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map canvas */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            background: dark ? '#0B1A1F' : '#E8F4F5',
            fontFamily: SPOT_FONT,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${soongsilMap})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: dark
                ? 'brightness(0.6) saturate(0.8)'
                : 'brightness(0.97)',
            }}
          />

          {/* Selected booth marker */}
          <div
            style={{
              position: 'absolute',
              left: '32%',
              top: '43%',
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: SPOT_TOKENS.pop,
                opacity: 0.35,
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50% 50% 50% 4px',
                background: SPOT_TOKENS.pop,
                transform: 'rotate(-45deg)',
                boxShadow: `0 8px 24px rgba(20,26,31,0.25), inset 0 0 0 3px #fff`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: SPOT_TOKENS.ink,
              }}
            >
              <div
                style={{
                  transform: 'rotate(45deg)',
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                16
              </div>
            </div>
          </div>

          {/* Other markers */}
          {[
            { x: 47, y: 32, t: 'day' },
            { x: 55, y: 32, t: 'day' },
            { x: 73, y: 32, t: 'day' },
            { x: 53, y: 43, t: 'night' },
            { x: 76, y: 60, t: 'night' },
            { x: 86, y: 56, t: 'night' },
            { x: 86, y: 70, t: 'night' },
            { x: 22, y: 55, t: 'night' },
            { x: 50, y: 82, t: 'truck' },
            { x: 41, y: 82, t: 'truck' },
            { x: 27, y: 82, t: 'truck' },
          ].map((m, i) => {
            const c =
              m.t === 'truck'
                ? SPOT_TOKENS.sun
                : m.t === 'night'
                  ? SPOT_TOKENS.coral
                  : SPOT_TOKENS.mint
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: c,
                  boxShadow:
                    'inset 0 0 0 2.5px #fff, 0 2px 8px rgba(15,42,51,0.2)',
                }}
              />
            )
          })}

          {/* Detail callout */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 300,
              background: t.surface,
              borderRadius: 18,
              border: `1px solid ${t.border}`,
              boxShadow: SPOT_TOKENS.shadow.pop,
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Pill color={SPOT_TOKENS.alert} ink="#fff">
                야간 · 주점
              </Pill>
              <Pill color={t.surfaceAlt} ink={t.ink80}>
                #16 선택중
              </Pill>
              <div style={{ flex: 1 }} />
              <div style={{ width: 18, height: 18, color: t.ink40 }}>
                {I.dots()}
              </div>
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: t.ink,
                letterSpacing: -0.3,
              }}
            >
              컴공과 칵테일 바
            </div>
            <div style={{ fontSize: 12, color: t.ink60, marginTop: 4 }}>
              베어드홀 광장 동측 · 4인 테이블 8개
            </div>
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: t.surfaceAlt,
                fontSize: 12,
                color: t.ink80,
                lineHeight: 1.55,
              }}
            >
              위치를 변경하려면 지도에서 드래그하거나 번호를 클릭해 교체할 수
              있어요.
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 12,
              }}
            >
              <AdminBtn dark={dark} icon={I.edit(SPOT_TOKENS.ink60)}>
                정보 편집
              </AdminBtn>
              <AdminBtn dark={dark} icon={I.trash(SPOT_TOKENS.ink60)}>
                위치 해제
              </AdminBtn>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              bottom: 24,
              background: t.surface,
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              boxShadow: SPOT_TOKENS.shadow.card,
              padding: '10px 14px',
              display: 'flex',
              gap: 18,
              fontSize: 12,
              color: t.ink80,
              fontWeight: 600,
            }}
          >
            {[
              { c: SPOT_TOKENS.mint, l: '주간 부스' },
              { c: SPOT_TOKENS.coral, l: '야간 주점' },
              { c: SPOT_TOKENS.sun, l: '푸드트럭' },
            ].map((x) => (
              <div
                key={x.l}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: x.c,
                    boxShadow: 'inset 0 0 0 2px #fff',
                  }}
                />
                {x.l}
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div
            style={{
              position: 'absolute',
              right: 24,
              bottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              background: t.surface,
              borderRadius: 12,
              border: `1px solid ${t.border}`,
              padding: 4,
              boxShadow: SPOT_TOKENS.shadow.card,
            }}
          >
            {([I.plus, I.minus] as const).map((ic, i) => (
              <div
                key={i}
                style={{ width: 32, height: 32, padding: 8, color: t.ink60 }}
              >
                {ic()}
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 24,
              display: 'flex',
              gap: 4,
              background: t.surface,
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              padding: 4,
            }}
          >
            {[
              { ico: I.map, on: true },
              { ico: I.grid, on: false },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 12px',
                  borderRadius: 7,
                  background: m.on ? t.cta : 'transparent',
                  color: m.on ? t.ctaInk : t.ink60,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div style={{ width: 14, height: 14 }}>{m.ico()}</div>
                {m.on ? '지도' : '그리드'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
