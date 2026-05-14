import { SPOT_TOKENS, SPOT_FONT, tone, I, PhotoSlot, Pill } from '../tokens'
import { SpotTabBar } from './Home'

// ── Sub-section header (shared with mobile-waiting) ───────────────────────────

export function SubHeader({
  title,
  right,
}: {
  title: string
  right?: string
  dark?: boolean
}) {
  const t = tone()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 22,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: t.ink,
          letterSpacing: -0.4,
        }}
      >
        {title}
      </div>
      {right && (
        <div style={{ fontSize: 12, color: t.ink60, fontWeight: 600 }}>
          {right}
        </div>
      )}
    </div>
  )
}

// ── Screen: Booth Detail ──────────────────────────────────────────────────────

export function MobileBoothDetail({ dark = false }: { dark?: boolean }) {
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
      {/* Photo hero */}
      <div style={{ height: 320, position: 'relative' }}>
        <PhotoSlot
          label="cover · booth #16"
          tone="rose"
          ratio="auto"
          radius={0}
          style={{ width: '100%', height: '100%', aspectRatio: 'auto' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 110,
            background:
              'linear-gradient(180deg, rgba(15,42,51,0.4) 0%, rgba(15,42,51,0) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 54,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: SPOT_TOKENS.ink,
            }}
          >
            <div style={{ width: 18, height: 18 }}>
              {I.chev(undefined, 'l')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([I.star, I.dots] as const).map((ic, i) => (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: SPOT_TOKENS.ink,
                }}
              >
                <div style={{ width: 18, height: 18 }}>{ic()}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 18 : 6,
                height: 6,
                borderRadius: 9999,
                background: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          marginTop: -28,
          background: t.surface,
          borderRadius: '28px 28px 0 0',
          padding: '20px 20px 110px',
          position: 'relative',
          zIndex: 2,
          height: 'calc(100% - 320px + 28px)',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <Pill color={SPOT_TOKENS.alert} ink="#fff">
            야간 주점
          </Pill>
          <Pill color={t.surfaceAlt} ink={t.ink80}>
            #16 · 베어드홀 동측
          </Pill>
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: t.ink,
            letterSpacing: -0.7,
            lineHeight: 1.2,
          }}
        >
          컴공과 칵테일 바
        </div>
        <div
          style={{
            fontSize: 13,
            color: t.ink60,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          시원한 수제 칵테일과 안주로 오늘 밤을
          <br />
          특별하게 만들어 드려요 🍹
        </div>

        {/* Meta strip */}
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: t.surfaceAlt,
            borderRadius: 16,
            padding: '12px 0',
          }}
        >
          {[
            { l: '평점', v: '4.8', s: 'IconStar' },
            { l: '현재 대기', v: '7팀', s: '예상 22분' },
            { l: '운영 시간', v: '~22시', s: '17시 오픈' },
          ].map((x, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${t.border}` : 'none',
              }}
            >
              <div style={{ fontSize: 11, color: t.ink60, fontWeight: 600 }}>
                {x.l}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: t.ink,
                  marginTop: 4,
                  letterSpacing: -0.3,
                }}
              >
                {x.v}
              </div>
              <div style={{ fontSize: 10, color: t.ink40, marginTop: 2 }}>
                {x.s}
              </div>
            </div>
          ))}
        </div>

        <SubHeader title="메뉴" right="총 6종" dark={dark} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              name: '청포도 모히토',
              desc: '무알콜 가능',
              price: 6000,
              t: 'leaf',
              hot: true,
            },
            {
              name: '히비스커스 진토닉',
              desc: '시그니처',
              price: 7000,
              t: 'rose',
              hot: false,
            },
            {
              name: '복숭아 슬러시',
              desc: '논알콜',
              price: 5000,
              t: 'sun',
              hot: false,
            },
            {
              name: '안주 — 나초 플래터',
              desc: '치즈 듬뿍',
              price: 8000,
              t: 'coral',
              hot: false,
            },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 8,
                borderRadius: 16,
                background: t.surface,
                border: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <PhotoSlot label="" tone={m.t} radius={12} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: t.ink,
                      letterSpacing: -0.3,
                    }}
                  >
                    {m.name}
                  </div>
                  {m.hot && (
                    <Pill
                      color={SPOT_TOKENS.pop}
                      ink={SPOT_TOKENS.ink}
                      style={{ fontSize: 10 }}
                    >
                      BEST
                    </Pill>
                  )}
                </div>
                <div style={{ fontSize: 12, color: t.ink60, marginTop: 2 }}>
                  {m.desc}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: t.ink,
                    marginTop: 4,
                    letterSpacing: -0.3,
                  }}
                >
                  {m.price.toLocaleString()}
                  <span
                    style={{ fontSize: 11, fontWeight: 600, color: t.ink60 }}
                  >
                    원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SubHeader title="부스 소개" dark={dark} />
        <div
          style={{
            padding: 14,
            borderRadius: 16,
            background: t.surfaceAlt,
            fontSize: 13,
            color: t.ink80,
            lineHeight: 1.55,
          }}
        >
          숭실대 컴퓨터학부 학생회가 운영합니다. 전 메뉴는
          <br />
          학생증 제시 시 1,000원 할인되며, 매일 21시 이후엔
          <br />
          한정 시그니처 메뉴를 추가 공개해요.
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 20px 28px',
          background: `linear-gradient(180deg, transparent 0%, ${t.surface} 30%)`,
        }}
      >
        <div
          style={{
            background: t.cta,
            color: t.ctaInk,
            borderRadius: 20,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: SPOT_TOKENS.shadow.hit,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  background: SPOT_TOKENS.pop,
                  color: SPOT_TOKENS.ink,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 9999,
                  letterSpacing: 0.3,
                }}
              >
                LIVE
              </span>
              현재 7팀 대기 · 예상 22분
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: -0.4,
                marginTop: 4,
              }}
            >
              웨이팅 걸기
            </div>
          </div>
          <div style={{ width: 18, height: 18 }}>{I.chev('#fff', 'r')}</div>
        </div>
      </div>
    </div>
  )
}

// ── Screen: Food Truck List ───────────────────────────────────────────────────

export function MobileFoodTrucks({ dark = false }: { dark?: boolean }) {
  const t = tone()
  const trucks = [
    {
      name: '브라더스 츄러스',
      spec: '츄러스 · 아이스크림',
      price: '4,000원',
      wait: 0,
      tone: 'coral',
      spot: '한경직 #64',
      open: true,
      tag: '디저트',
    },
    {
      name: '도쿄 타코야끼',
      spec: '타코야끼 · 야끼소바',
      price: '6,000원',
      wait: 2,
      tone: 'sun',
      spot: '한경직 #65',
      open: true,
      tag: '분식',
    },
    {
      name: '훈제 통삼겹',
      spec: '통삼겹 · 꼬치',
      price: '7,000원',
      wait: 4,
      tone: 'rose',
      spot: '한경직 #66',
      open: true,
      tag: '구이',
    },
    {
      name: '청춘 만두',
      spec: '왕만두 · 떡볶이',
      price: '5,000원',
      wait: 0,
      tone: 'leaf',
      spot: '한경직 #67',
      open: true,
      tag: '분식',
    },
    {
      name: '코코넛 라떼',
      spec: '음료 전문',
      price: '4,500원',
      wait: 1,
      tone: 'mint',
      spot: '한경직 #68',
      open: true,
      tag: '음료',
    },
    {
      name: '심야 라멘바',
      spec: '돈코츠 · 미소',
      price: '8,000원',
      wait: 3,
      tone: 'grape',
      spot: '한경직 #69',
      open: false,
      tag: '면류',
    },
  ]
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
            marginBottom: 14,
          }}
        >
          <div style={{ width: 36, height: 36, color: t.ink }}>
            <div style={{ width: 22, height: 22, marginTop: 7 }}>
              {I.chev(undefined, 'l')}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: 800,
              color: t.ink,
              letterSpacing: -0.4,
            }}
          >
            푸드트럭
          </div>
          <div style={{ width: 36, height: 36, padding: 8, color: t.ink60 }}>
            {I.search()}
          </div>
        </div>
        <div style={{ fontSize: 13, color: t.ink60 }}>
          한경직 기념관 앞 · 총 11대 운영 중
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            marginTop: 14,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {[
            { l: '전체', n: 11, on: true },
            { l: '분식', n: 4 },
            { l: '디저트', n: 3 },
            { l: '음료', n: 2 },
            { l: '구이', n: 2 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                padding: '8px 12px',
                borderRadius: 9999,
                background: c.on ? t.cta : t.surfaceAlt,
                color: c.on ? t.ctaInk : t.ink80,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: -0.2,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                border: `1px solid ${c.on ? t.cta : t.border}`,
              }}
            >
              {c.l} <span style={{ fontSize: 11, opacity: 0.7 }}>{c.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div
        style={{
          padding: '14px 16px 110px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {trucks.map((tr, i) => (
          <div
            key={i}
            style={{
              background: t.surface,
              borderRadius: 20,
              border: `1px solid ${t.border}`,
              overflow: 'hidden',
              opacity: tr.open ? 1 : 0.6,
            }}
          >
            <div style={{ display: 'flex', gap: 14, padding: 12 }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 14,
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <PhotoSlot label="" tone={tr.tone} radius={14} />
                {!tr.open && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(15,42,51,0.55)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 14,
                    }}
                  >
                    준비중
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Pill color={t.surfaceAlt} ink={t.ink80}>
                    {tr.tag}
                  </Pill>
                  <Pill
                    color="transparent"
                    ink={t.ink60}
                    style={{ padding: 0 }}
                  >
                    {tr.spot}
                  </Pill>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: t.ink,
                    letterSpacing: -0.3,
                    marginTop: 4,
                  }}
                >
                  {tr.name}
                </div>
                <div style={{ fontSize: 12, color: t.ink60, marginTop: 2 }}>
                  {tr.spec}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: t.ink,
                      letterSpacing: -0.3,
                    }}
                  >
                    {tr.price}{' '}
                    <span
                      style={{ fontSize: 11, fontWeight: 500, color: t.ink60 }}
                    >
                      부터
                    </span>
                  </div>
                  {tr.wait > 0 ? (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: SPOT_TOKENS.ink,
                        background: SPOT_TOKENS.pop,
                        padding: '4px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      현장 {tr.wait}팀
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: SPOT_TOKENS.pop,
                        background: SPOT_TOKENS.popSoft,
                        padding: '4px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      바로 주문 가능
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SpotTabBar active="home" dark={dark} />
    </div>
  )
}
