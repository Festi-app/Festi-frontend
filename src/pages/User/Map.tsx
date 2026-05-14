import type { ReactElement } from 'react'
import { SPOT_TOKENS, SPOT_FONT, tone, I, Pill } from '../../tokens'
import { SpotTabBar } from './Home'
import soongsilMap from '../assets/soongsil-map.png'

// ── Stat cell ─────────────────────────────────────────────────────────────────

export function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon?: ReactElement
  color?: string
  dark?: boolean
}) {
  const t = tone()
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 10,
          color: t.ink60,
          fontWeight: 600,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: color || t.ink,
          letterSpacing: -0.3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {icon && <div style={{ width: 13, height: 13 }}>{icon}</div>}
        {value}
      </div>
    </div>
  )
}

// ── Screen: Map ───────────────────────────────────────────────────────────────

export function MobileMap({
  dark = false,
  period = 'day',
}: {
  dark?: boolean
  period?: string
}) {
  const t = tone()
  const isDay = period === 'day'

  const markers = [
    {
      id: 6,
      x: 47,
      y: 32,
      type: 'day',
      name: '학생회 굿즈샵',
      wait: 0,
      cat: '판매',
    },
    {
      id: 8,
      x: 55,
      y: 32,
      type: 'day',
      name: '플리마켓',
      wait: 1,
      cat: '판매',
    },
    {
      id: 12,
      x: 73,
      y: 32,
      type: 'day',
      name: '타로 카페',
      wait: 3,
      cat: '체험',
    },
    {
      id: 77,
      x: 25,
      y: 41,
      type: 'special',
      name: '본부 부스',
      wait: 0,
      cat: '안내',
    },
    {
      id: 16,
      x: 32,
      y: 43,
      type: 'night',
      name: '컴공 칵테일바',
      wait: 7,
      cat: '주점',
      hot: true,
    },
    {
      id: 22,
      x: 53,
      y: 43,
      type: 'night',
      name: '의약학부 주점',
      wait: 5,
      cat: '주점',
    },
    {
      id: 73,
      x: 22,
      y: 56,
      type: 'night',
      name: '국문과 술집',
      wait: 4,
      cat: '주점',
    },
    {
      id: 47,
      x: 85,
      y: 55,
      type: 'night',
      name: '미디어 라멘',
      wait: 5,
      cat: '면류',
    },
    {
      id: 38,
      x: 75,
      y: 60,
      type: 'night',
      name: '체대 곱창',
      wait: 3,
      cat: '야식',
    },
    {
      id: 53,
      x: 85,
      y: 69,
      type: 'night',
      name: '아랍어 비빔',
      wait: 2,
      cat: '식사',
    },
    {
      id: 70,
      x: 27,
      y: 83,
      type: 'truck',
      name: '훈제 통삼겹',
      wait: 4,
      cat: '트럭',
      hot: true,
    },
    {
      id: 67,
      x: 41,
      y: 83,
      type: 'truck',
      name: '청춘 만두',
      wait: 0,
      cat: '트럭',
    },
    {
      id: 64,
      x: 55,
      y: 83,
      type: 'truck',
      name: '도쿄 타코야끼',
      wait: 2,
      cat: '트럭',
    },
  ]

  const selectedId = 16

  const typeColor = (type: string) =>
    type === 'truck'
      ? SPOT_TOKENS.sun
      : type === 'night'
        ? SPOT_TOKENS.alert
        : type === 'special'
          ? SPOT_TOKENS.grape
          : SPOT_TOKENS.pop

  const waitStatus = (w: number) => {
    if (w === 0) return { color: SPOT_TOKENS.pop, label: '바로 입장' }
    if (w <= 2) return { color: SPOT_TOKENS.pop, label: `${w}팀` }
    return { color: SPOT_TOKENS.alert, label: `${w}팀` }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: dark ? '#0B1A1F' : '#E8F4F5',
        fontFamily: SPOT_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Map image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${soongsilMap})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: dark
            ? 'brightness(0.45) saturate(0.5)'
            : 'brightness(1.05) saturate(0.6)',
          opacity: dark ? 0.9 : 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? 'linear-gradient(180deg, rgba(11,26,31,0.35) 0%, rgba(11,26,31,0.55) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.55) 100%)',
        }}
      />

      {/* Markers layer */}
      <div
        style={{
          position: 'absolute',
          top: 178,
          left: 0,
          right: 0,
          bottom: 230,
        }}
      >
        {markers.map((m) => {
          const visible =
            (isDay &&
              (m.type === 'day' ||
                m.type === 'truck' ||
                m.type === 'special')) ||
            (!isDay &&
              (m.type === 'night' ||
                m.type === 'truck' ||
                m.type === 'special'))
          if (!visible) return null
          const isSel = m.id === selectedId && !isDay
          const pinColor = typeColor(m.type)
          const numColor =
            m.type === 'night' || m.type === 'truck' || m.type === 'day'
              ? '#fff'
              : SPOT_TOKENS.ink
          const labelRight = m.x < 50
          const ws = waitStatus(m.wait)
          return (
            <div
              key={m.id}
              style={{
                position: 'absolute',
                left: `${m.x}%`,
                top: `${m.y - 35}%`,
                transform: 'translate(-50%, 0)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexDirection: labelRight ? 'row' : 'row-reverse',
                zIndex: isSel ? 5 : 1,
              }}
            >
              <div
                style={{
                  width: isSel ? 32 : 26,
                  height: isSel ? 32 : 26,
                  borderRadius: '50%',
                  background: pinColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: numColor,
                  fontSize: isSel ? 13 : 11,
                  fontWeight: 800,
                  boxShadow: isSel
                    ? `inset 0 0 0 3px #fff, 0 6px 18px rgba(20,26,31,0.35)`
                    : `inset 0 0 0 2px #fff, 0 2px 8px rgba(20,26,31,0.25)`,
                  flexShrink: 0,
                  position: 'relative',
                  letterSpacing: -0.3,
                }}
              >
                {m.id}
                {isSel && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      background: pinColor,
                      opacity: 0.25,
                      zIndex: -1,
                      animation: 'spot-pulse 2s ease-out infinite',
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  background: dark ? '#1B3239' : '#fff',
                  padding: '5px 8px 5px 7px',
                  borderRadius: 9,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,26,31,0.08)'}`,
                  boxShadow: '0 3px 10px rgba(20,26,31,0.18)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: t.ink,
                  letterSpacing: -0.2,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: ws.color,
                    flexShrink: 0,
                  }}
                />
                {m.name}
                <span
                  style={{ color: ws.color, fontSize: 10, fontWeight: 800 }}
                >
                  {ws.label}
                </span>
                {m.hot && (
                  <span
                    style={{
                      background: SPOT_TOKENS.alert,
                      color: '#fff',
                      fontSize: 8,
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: 4,
                      letterSpacing: 0.3,
                    }}
                  >
                    HOT
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Top header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '54px 16px 14px',
          background: `linear-gradient(180deg, ${dark ? 'rgba(11,26,31,0.97)' : 'rgba(255,255,255,0.97)'} 0%, ${dark ? 'rgba(11,26,31,0)' : 'rgba(255,255,255,0)'} 100%)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              background: dark ? 'rgba(255,255,255,0.06)' : '#fff',
              border: `1px solid ${t.border}`,
              borderRadius: 9999,
              padding: '10px 14px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: SPOT_TOKENS.shadow.card,
            }}
          >
            <div style={{ width: 18, height: 18, color: t.ink60 }}>
              {I.search()}
            </div>
            <div style={{ fontSize: 14, color: t.ink60, fontWeight: 500 }}>
              부스 번호 또는 이름
            </div>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: t.cta,
              color: t.ctaInk,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: SPOT_TOKENS.shadow.card,
            }}
          >
            <div style={{ width: 20, height: 20 }}>{I.list()}</div>
          </div>
        </div>

        {/* Day/Night + day-N chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              background: dark ? 'rgba(19,38,45,0.95)' : '#fff',
              border: `1px solid ${t.border}`,
              borderRadius: 9999,
              padding: 3,
              display: 'flex',
              boxShadow: SPOT_TOKENS.shadow.card,
            }}
          >
            {[
              { id: 'day', label: '주간', ico: I.sun, color: SPOT_TOKENS.pop },
              {
                id: 'night',
                label: '야간',
                ico: I.moon,
                color: SPOT_TOKENS.alert,
              },
            ].map((o) => {
              const on = (o.id === 'day') === isDay
              return (
                <div
                  key={o.id}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: on ? o.color : 'transparent',
                    color: on ? '#fff' : t.ink60,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: -0.2,
                  }}
                >
                  <div style={{ width: 14, height: 14 }}>{o.ico()}</div>
                  {o.label}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1 }}>
            {['2일차', '1일차', '3일차'].map((d, i) => (
              <div
                key={d}
                style={{
                  padding: '8px 12px',
                  borderRadius: 9999,
                  background:
                    i === 0
                      ? t.cta
                      : dark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.85)',
                  color: i === 0 ? t.ctaInk : t.ink80,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: -0.2,
                  border: `1px solid ${i === 0 ? t.cta : t.border}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compact legend */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          right: 12,
          zIndex: 5,
          background: dark ? 'rgba(19,38,45,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 12,
          padding: '8px 10px',
          boxShadow: SPOT_TOKENS.shadow.card,
          border: `1px solid ${t.border}`,
          fontSize: 11,
          fontWeight: 700,
          color: t.ink80,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        {[
          isDay
            ? { c: SPOT_TOKENS.pop, l: '주간 부스' }
            : { c: SPOT_TOKENS.alert, l: '야간 주점' },
          { c: SPOT_TOKENS.sun, l: '푸드트럭' },
          { c: SPOT_TOKENS.grape, l: '안내·본부' },
        ].map((x) => (
          <div
            key={x.l}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: x.c,
                boxShadow: 'inset 0 0 0 1.5px #fff',
              }}
            />
            {x.l}
          </div>
        ))}
        <div
          style={{
            borderTop: `1px solid ${t.border}`,
            paddingTop: 5,
            marginTop: 1,
            fontSize: 10,
            fontWeight: 600,
            color: t.ink60,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 3,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: SPOT_TOKENS.pop,
              }}
            />
            여유 / 0–2팀
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: SPOT_TOKENS.alert,
              }}
            />
            대기 / 3팀+
          </div>
        </div>
      </div>

      {/* Bottom sheet — selected booth */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: t.surface,
          borderRadius: '24px 24px 0 0',
          padding: '10px 18px 100px',
          boxShadow: '0 -8px 32px rgba(15,42,51,0.18)',
          borderTop: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: t.ink20,
            borderRadius: 9999,
            margin: '0 auto 12px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: SPOT_TOKENS.alert,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 15,
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: 'inset 0 0 0 3px #fff, 0 4px 12px rgba(255,90,90,0.4)',
            }}
          >
            16
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 2,
              }}
            >
              <Pill
                color={SPOT_TOKENS.alertSoft}
                ink={SPOT_TOKENS.alert}
                style={{ fontSize: 10 }}
              >
                야간 · 주점
              </Pill>
              <span style={{ fontSize: 10, color: t.ink60, fontWeight: 600 }}>
                베어드홀 동측
              </span>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: t.ink,
                letterSpacing: -0.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              컴공과 칵테일 바
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            marginTop: 10,
            padding: 8,
            borderRadius: 12,
            background: t.surfaceAlt,
          }}
        >
          <Stat
            label="대기"
            value="7팀"
            color={SPOT_TOKENS.alert}
            dark={dark}
          />
          <div style={{ width: 1, background: t.border }} />
          <Stat label="예상" value="22분" dark={dark} />
          <div style={{ width: 1, background: t.border }} />
          <Stat
            label="평점"
            value="4.8"
            dark={dark}
            icon={I.star(SPOT_TOKENS.sun, SPOT_TOKENS.sun)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <div
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 14,
              background: t.surfaceAlt,
              color: t.ink,
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              border: `1px solid ${t.border}`,
            }}
          >
            상세보기
          </div>
          <div
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: 14,
              background: t.cta,
              color: t.ctaInk,
              fontSize: 14,
              fontWeight: 800,
              textAlign: 'center',
              boxShadow: SPOT_TOKENS.shadow.hit,
              letterSpacing: -0.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            웨이팅 걸기
            <span
              style={{
                background: SPOT_TOKENS.alert,
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 9999,
              }}
            >
              7팀
            </span>
          </div>
        </div>
      </div>

      <SpotTabBar active="map" dark={dark} />

      <style>{`
        @keyframes spot-pulse {
          0%   { transform: scale(0.7); opacity: 0.55; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
