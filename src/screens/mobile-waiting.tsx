import type { ReactNode } from 'react'
import {
  SPOT_TOKENS,
  SPOT_FONT,
  tone,
  SpotterMark,
  I,
  PhotoSlot,
  Pill,
} from '../tokens'
import { SpotTabBar } from './mobile-home'
import { SubHeader } from './mobile-detail'

// ── Field label ───────────────────────────────────────────────────────────────

export function FieldLabel({
  children,
}: {
  children: ReactNode
  dark?: boolean
}) {
  const t = tone()
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: t.ink80,
        marginTop: 20,
        marginBottom: 8,
        letterSpacing: -0.2,
      }}
    >
      {children}
    </div>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

export function Switch({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 42,
        height: 26,
        borderRadius: 9999,
        padding: 2,
        background: on ? SPOT_TOKENS.pop : '#D3DBDE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}

// ── Screen: Waiting Register ──────────────────────────────────────────────────

export function MobileWaitingRegister({ dark = false }: { dark?: boolean }) {
  const t = tone()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: t.bg,
        fontFamily: SPOT_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '54px 20px 16px',
          background: t.surface,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 6,
          }}
        >
          <div style={{ width: 24, height: 24, color: t.ink }}>
            {I.chev(undefined, 'l')}
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 17,
              fontWeight: 800,
              color: t.ink,
              letterSpacing: -0.4,
            }}
          >
            웨이팅 등록
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '18px 20px 140px',
          overflow: 'auto',
          height: 'calc(100% - 130px)',
        }}
      >
        {/* Booth card */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 12,
            background: t.surface,
            borderRadius: 18,
            border: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <PhotoSlot label="" tone="rose" radius={14} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <Pill color={SPOT_TOKENS.alert} ink="#fff">
                #16
              </Pill>
              <Pill color={t.surfaceAlt} ink={t.ink80}>
                야간 주점
              </Pill>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: t.ink,
                marginTop: 4,
                letterSpacing: -0.3,
              }}
            >
              컴공과 칵테일 바
            </div>
            <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>
              현재 7팀 대기 · 예상 22분
            </div>
          </div>
        </div>

        {/* People picker */}
        <FieldLabel dark={dark}>인원</FieldLabel>
        <div
          style={{
            background: t.surface,
            borderRadius: 18,
            border: `1px solid ${t.border}`,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: t.ink60, fontWeight: 600 }}>
              방문 인원
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: t.ink,
                letterSpacing: -0.6,
                marginTop: 4,
              }}
            >
              4{' '}
              <span style={{ fontSize: 14, fontWeight: 600, color: t.ink60 }}>
                명
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {([I.minus, I.plus] as const).map((ic, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: i === 1 ? SPOT_TOKENS.mint : t.surfaceAlt,
                  color: SPOT_TOKENS.ink,
                  padding: 12,
                  border: `1px solid ${t.border}`,
                }}
              >
                {ic()}
              </div>
            ))}
          </div>
        </div>

        {/* Quick chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {([2, 4, 6, 8, 10] as const).map((n, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '8px 0',
                textAlign: 'center',
                borderRadius: 12,
                background: n === 4 ? SPOT_TOKENS.ink : t.surface,
                color: n === 4 ? '#fff' : t.ink80,
                fontSize: 13,
                fontWeight: 700,
                border: `1px solid ${n === 4 ? SPOT_TOKENS.ink : t.border}`,
              }}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Notification toggles */}
        <FieldLabel dark={dark}>알림 설정</FieldLabel>
        <div
          style={{
            background: t.surface,
            borderRadius: 18,
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
          }}
        >
          {[
            { l: '내 차례 3팀 전 알림', s: '카카오톡 + 푸시', on: true },
            { l: '내 차례 호출 알림', s: '진동 + 사운드', on: true },
          ].map((row, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                gap: 10,
                borderBottom:
                  i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: t.ink,
                    letterSpacing: -0.3,
                  }}
                >
                  {row.l}
                </div>
                <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>
                  {row.s}
                </div>
              </div>
              <Switch on={row.on} />
            </div>
          ))}
        </div>

        {/* Terms */}
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            background: t.surfaceAlt,
            fontSize: 11,
            color: t.ink60,
            lineHeight: 1.5,
          }}
        >
          호출 후 5분 이내 미도착 시 자동 취소될 수 있어요. 웨이팅은 1인 1팀만
          등록 가능합니다.
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 20px 28px',
          background: `linear-gradient(180deg, transparent 0%, ${t.bg} 30%)`,
        }}
      >
        <div
          style={{
            background: t.cta,
            color: t.ctaInk,
            borderRadius: 20,
            padding: '16px 20px',
            textAlign: 'center',
            boxShadow: SPOT_TOKENS.shadow.hit,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>
            4명 · 010-2354-8821
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: -0.4,
              marginTop: 2,
            }}
          >
            웨이팅 등록하기
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Screen: My Waiting Status ─────────────────────────────────────────────────

export function MobileWaitingStatus({ dark = false }: { dark?: boolean }) {
  const t = tone()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: t.bg,
        fontFamily: SPOT_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '54px 20px 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 6,
            marginBottom: 4,
          }}
        >
          <SpotterMark size={18} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 36, height: 36, padding: 8, color: t.ink60 }}>
            {I.bell()}
          </div>
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: t.ink,
            letterSpacing: -0.7,
          }}
        >
          내 웨이팅
        </div>
      </div>

      <div
        style={{
          padding: '4px 20px 110px',
          overflow: 'auto',
          height: 'calc(100% - 100px)',
        }}
      >
        {/* Main ticket card */}
        <div
          style={{
            background: dark ? '#1A3137' : SPOT_TOKENS.ink,
            color: dark ? '#EAF6F7' : '#fff',
            borderRadius: 28,
            padding: 22,
            position: 'relative',
            overflow: 'hidden',
            border: dark ? `1px solid ${t.border}` : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 80% 20%, ${SPOT_TOKENS.mint}55 0%, transparent 55%),
                         radial-gradient(circle at 20% 100%, ${SPOT_TOKENS.pop}33 0%, transparent 50%)`,
            }}
          />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Pill
                color="rgba(169,229,231,0.18)"
                ink={SPOT_TOKENS.mint}
                style={{ fontSize: 11 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: SPOT_TOKENS.mint,
                    display: 'inline-block',
                    marginRight: 4,
                    animation: 'spot-blink 1.6s ease-in-out infinite',
                  }}
                />
                LIVE · 진행중
              </Pill>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>
                대기번호
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  color: SPOT_TOKENS.mint,
                  letterSpacing: -4,
                  lineHeight: 1,
                  fontFamily: SPOT_FONT,
                }}
              >
                34
              </div>
              <div>
                <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 600 }}>
                  현재 호출
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: -1,
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  30
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  height: 6,
                  borderRadius: 9999,
                  background: 'rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '60%',
                    height: '100%',
                    borderRadius: 9999,
                    background: `linear-gradient(90deg, ${SPOT_TOKENS.mint} 0%, ${SPOT_TOKENS.pop} 100%)`,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <span style={{ opacity: 0.7 }}>
                  앞에 <strong style={{ color: '#fff' }}>4팀</strong> 남음
                </span>
                <span style={{ opacity: 0.7 }}>
                  예상 대기 <strong style={{ color: '#fff' }}>~14분</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Ticket perforation */}
          <div
            style={{
              margin: '20px -22px 14px',
              position: 'relative',
              height: 1,
              borderTop: '1.5px dashed rgba(255,255,255,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -12,
                top: -12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: t.bg,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -12,
                top: -12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: t.bg,
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <PhotoSlot label="" tone="rose" radius={12} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}
              >
                컴공과 칵테일 바
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                #16 · 4인 · 21:14 등록
              </div>
            </div>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.1)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              취소
            </div>
          </div>
        </div>

        {/* Notification banner */}
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 18,
            background: SPOT_TOKENS.popSoft,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: SPOT_TOKENS.pop,
              color: '#fff',
              padding: 8,
              flexShrink: 0,
            }}
          >
            {I.bell()}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: SPOT_TOKENS.ink,
                letterSpacing: -0.2,
              }}
            >
              곧 호출돼요!
            </div>
            <div
              style={{ fontSize: 12, color: SPOT_TOKENS.ink80, marginTop: 2 }}
            >
              부스 근처에서 대기해 주세요. 호출 후 5분 안에 도착!
            </div>
          </div>
        </div>

        <SubHeader title="다른 웨이팅" right="2건" dark={dark} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              n: 38,
              name: '체대 곱창집',
              state: '대기중',
              sub: '앞에 12팀 · ~38분',
              tone: 'mint',
              color: SPOT_TOKENS.mint,
            },
            {
              n: 47,
              name: '미디어부 라멘',
              state: '예약',
              sub: '20:30 도착 예약',
              tone: 'sun',
              color: SPOT_TOKENS.sun,
            },
          ].map((w, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                background: t.surface,
                borderRadius: 18,
                padding: 12,
                border: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <PhotoSlot label="" tone={w.tone} radius={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <Pill color={w.color} ink={SPOT_TOKENS.ink}>
                    {w.state}
                  </Pill>
                  <Pill color="transparent" ink={t.ink60}>
                    #{w.n}
                  </Pill>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: t.ink,
                    marginTop: 4,
                    letterSpacing: -0.3,
                  }}
                >
                  {w.name}
                </div>
                <div style={{ fontSize: 11, color: t.ink60, marginTop: 2 }}>
                  {w.sub}
                </div>
              </div>
              <div style={{ width: 14, height: 14, color: t.ink40 }}>
                {I.chev(undefined, 'r')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SpotTabBar active="wait" dark={dark} />

      <style>{`
        @keyframes spot-blink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.3 }
        }
      `}</style>
    </div>
  )
}
