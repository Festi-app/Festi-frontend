// ── Enums / Primitive Types ───────────────────────────────────────────────
// DB 컬럼 타입과 1:1 대응. 실제 API 연동 시 서버 enum 값과 맞춰 조정.

/** booths.type */
export type BoothType = 'day' | 'night' | 'truck' | 'special'

/** booths.category */
export type BoothCategory = '정보' | '체험' | '마켓' | '활동'

/** waitings.status */
export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED'

/** users.role */
export type UserRole = 'USER' | 'BOOTH_MANAGER' | 'FESTIVAL_ADMIN'

/** 관리자 권한 일차 */
export type PermDay = 1 | 2 | 3

/** 관리자 권한 시간대 */
export type PermTime = '주간' | '야간'

// ── booths table ──────────────────────────────────────────────────────────

export interface Booth {
  id: number // DB: UUID — mock에선 숫자 사용
  festivalId?: number // DB: BIGINT (FK → festivals.id)
  managerId?: string // DB: VARCHAR(30) (FK → users.id)
  name: string // DB: VARCHAR(100)
  type: BoothType // DB: BoothType enum
  category?: string // DB: booth_category
  description?: string // DB: TEXT
  operatingHours?: string // DB: VARCHAR(100)
  imageUrl?: string // DB: VARCHAR(500)
  // booth_locations join (위치 정보)
  zoneId?: string // booth_locations.zone_label (구역 ID)
  sections?: number[] // booth_locations.index[] (0-based) — 구역 내 슬롯 위치, 표시 시 +1 하여 1-based로 사용
  days?: string[] // booth_locations.day[]
  // 프론트엔드 전용
  tone?: string // 포토 슬롯 색상 테마
  wait?: number // waitings 집계 대기 팀 수
  priceFrom?: string // 최저가 표시
}

// ── booth_locations table ─────────────────────────────────────────────────

export interface BoothLocation {
  id: number // DB: SMALLINT
  festivalId: number // DB: BIGINT (FK → festivals.id)
  boothId: number // DB: UUID (FK → booths.id)
  zoneLabel: string // DB: VARCHAR(100) — 구역 ID (예: 'A', 'N1')
  index: number // DB: SMALLINT — 부스 번호 (방문자 식별용, 예: #6, #8)
  day?: string // DB: DATE — 운영 날짜 (null = 전일)
  isFoodtruck: boolean // DB: BOOLEAN
}

// ── menu_items table ──────────────────────────────────────────────────────

export interface MenuItem {
  id?: number // DB: UUID
  boothId: number // DB: UUID (FK → booths.id)
  name: string // DB: VARCHAR(100)
  price?: number // DB: INTEGER
  description?: string // DB: TEXT
  imageUrl?: string // DB: VARCHAR(500)
  isSoldOut?: boolean // DB: BOOLEAN
  sortOrder?: number // DB: SMALLINT
  // 프론트엔드 전용
  tone?: string // 포토 슬롯 색상 테마
}

// ── waitings table ────────────────────────────────────────────────────────

export interface Waiting {
  id: string // DB: UUID
  boothId: number // DB: UUID (FK → booths.id)
  userId: string // DB: VARCHAR(30) (FK → users.id)
  festivalId: number // DB: BIGINT
  partySize: number // DB: SMALLINT
  status: WaitingStatus
  callCount: number // DB: SMALLINT
  registeredAt: string // DB: DATETIME
  updatedAt: string // DB: DATETIME
}

// ── festivals table ───────────────────────────────────────────────────────

export interface Festival {
  id: number // DB: BIGINT
  name: string // DB: VARCHAR(50)
  startAt: string // DB: DATETIME
  endAt: string // DB: DATETIME
}

// ── festival_days table ───────────────────────────────────────────────────

export interface FestivalDay {
  id: number // DB: BIGINT
  festivalId: number // DB: BIGINT (FK → festivals.id)
  day: number // DB: SMALLINT — 일차 번호
  date: string // DB: DATE
  dayStart: string // DB: TIME — 주간 시작
  dayEnd: string // DB: TIME — 주간 끝
  nightStart: string // DB: TIME — 야간 시작
  nightEnd: string // DB: TIME — 야간 끝
}

// ── notices table ─────────────────────────────────────────────────────────

export interface Notice {
  id: number // DB: INT
  festivalId: number // DB: BIGINT (FK → festivals.id)
  title: string // DB: VARCHAR(50)
  content: string // DB: VARCHAR(200)
  pinned: boolean // DB: BOOLEAN
  createdAt: string // DB: DATETIME
  updatedAt: string // DB: DATETIME
}

// ── Mock Data ─────────────────────────────────────────────────────────────
// 실제 API 연동 전까지 사용하는 임시 데이터.
// id는 UUID 대신 숫자 사용 (가독성 목적).

export const DAY_BOOTHS: Booth[] = [
  {
    id: 6,
    name: '학생회 굿즈샵',
    type: 'day',
    category: '마켓',
    tone: 'sun',
    operatingHours: '10:00 ~ 18:00',
    description:
      '페스티벌 공식 굿즈를 만나보세요. 한정판 에코백, 키링, 스티커팩을 판매합니다.',
    zoneId: 'C',
    sections: [0, 1], // C구역 #1·2
  },
  {
    id: 8,
    name: '플리마켓',
    type: 'day',
    category: '마켓',
    tone: 'leaf',
    operatingHours: '11:00 ~ 17:00',
    description:
      '학생들이 직접 만든 핸드메이드 소품과 빈티지 아이템을 만나볼 수 있어요.',
    zoneId: 'B',
    sections: [0, 1, 2], // B구역 #1·2·3
  },
  {
    id: 12,
    name: '타로 카페',
    type: 'day',
    category: '체험',
    tone: 'grape',
    operatingHours: '10:00 ~ 18:00',
    description: '신비로운 타로 카드로 오늘의 운세를 확인해보세요.',
    zoneId: 'F',
    sections: [0, 1], // F구역 #1·2
  },
  {
    id: 77,
    name: '본부 부스',
    type: 'special',
    category: '정보',
    tone: 'mint',
    operatingHours: '10:00 ~ 18:00',
    description: '축제 일정, 지도, 이벤트 정보를 안내해 드립니다.',
    zoneId: 'G',
    sections: [0],
  },
]

export const NIGHT_BOOTHS: Booth[] = [
  {
    id: 16,
    name: '컴공과 칵테일 바',
    type: 'night',
    tone: 'rose',
    wait: 7,
    operatingHours: '17:00 ~ 22:00',
    description:
      '시원한 수제 칵테일과 안주로 오늘 밤을 특별하게 만들어 드려요 🍹',
    zoneId: 'N1',
    sections: [0, 1], // N1구역 #1·2
  },
  {
    id: 22,
    name: '의약학부 주점',
    type: 'night',
    tone: 'mint',
    wait: 5,
    operatingHours: '17:00 ~ 22:00',
    description:
      '의약학부가 정성껏 준비한 시그니처 칵테일과 다양한 안주를 즐겨보세요.',
    zoneId: 'N6',
    sections: [0], // N6구역 #1
  },
  {
    id: 38,
    name: '체대 곱창집',
    type: 'night',
    tone: 'leaf',
    wait: 2,
    operatingHours: '18:00 ~ 23:00',
    description:
      '체대생들이 직접 구워드리는 쫄깃한 곱창과 막창으로 야식을 즐겨보세요.',
    zoneId: 'N7',
    sections: [1, 2], // N7구역 #2·3
  },
  {
    id: 44,
    name: '경영 포차',
    type: 'night',
    tone: 'sun',
    wait: 0,
    operatingHours: '17:00 ~ 22:00',
    description:
      '경영학부가 운영하는 감성 포차. 대기 없이 바로 입장 가능합니다.',
    zoneId: 'N5',
    sections: [0, 1], // N5구역 #1·2
  },
  {
    id: 73,
    name: '국문과 술집',
    type: 'night',
    tone: 'coral',
    wait: 4,
    operatingHours: '17:00 ~ 22:00',
    description:
      '국문과가 준비한 문학적 감성 가득한 주점. 특색 있는 메뉴를 만나보세요.',
    zoneId: 'N4',
    sections: [2, 3], // N4구역 #3·4
  },
  {
    id: 47,
    name: '미디어부 라멘바',
    type: 'night',
    tone: 'grape',
    wait: 5,
    operatingHours: '18:00 ~ 23:00',
    description: '진한 국물의 정통 라멘을 축제 현장에서 즐겨보세요.',
    zoneId: 'N2',
    sections: [0, 1], // N2구역 #1·2
  },
  {
    id: 53,
    name: '아랍어과 비빔밥',
    type: 'night',
    tone: 'sun',
    wait: 2,
    operatingHours: '17:00 ~ 22:00',
    description: '아랍어과가 특별하게 준비한 건강하고 맛있는 비빔밥입니다.',
    zoneId: 'N3',
    sections: [0], // N3구역 #1
  },
]

export const TRUCK_BOOTHS: Booth[] = [
  {
    id: 1,
    name: '브라더스 츄러스',
    type: 'truck',
    operatingHours: '10:00 ~ 20:00',
    tone: 'coral',
    priceFrom: '4,000원~',
    description:
      '바삭하고 달콤한 수제 츄러스와 소프트 아이스크림을 판매합니다.',
    zoneId: 'A',
    sections: [0],
  },
  {
    id: 2,
    name: '도쿄 타코야끼',
    type: 'truck',
    operatingHours: '12:00 ~ 21:00',
    tone: 'sun',
    priceFrom: '6,000원~',
    description: '일본 현지 레시피로 만든 타코야끼와 바삭한 회오리감자.',
    zoneId: 'B',
    sections: [0],
  },
  {
    id: 3,
    name: '훈제 통삼겹',
    type: 'truck',
    operatingHours: '16:00 ~ 22:00',
    tone: 'rose',
    priceFrom: '7,000원~',
    description: '직화 훈제로 구워낸 통삼겹과 다양한 꼬치 메뉴.',
    zoneId: 'B',
    sections: [1],
  },
  {
    id: 4,
    name: '마라탕&마라샹궈',
    type: 'truck',
    operatingHours: '11:00 ~ 21:00',
    tone: 'leaf',
    description: '얼얼하고 칼칼한 정통 마라 요리. 원하는 재료를 골라 담으세요.',
    zoneId: 'B',
    sections: [2],
  },
  {
    id: 5,
    name: '수제버거',
    type: 'truck',
    operatingHours: '11:00 ~ 20:00',
    tone: 'mint',
    description: '직접 빚은 패티로 만든 수제버거. 클래식부터 더블패티까지.',
    zoneId: 'C',
    sections: [0],
  },
  {
    id: 6,
    name: '흑당버블티',
    type: 'truck',
    operatingHours: '10:00 ~ 21:00',
    tone: 'grape',
    description: '진한 흑당 시럽과 쫀득한 타피오카가 들어간 대만식 버블티.',
    zoneId: 'C',
    sections: [1],
  },
  {
    id: 7,
    name: '에페스 케밥',
    type: 'truck',
    operatingHours: '11:00 ~ 22:00',
    tone: 'sun',
    description: '터키 현지 스타일의 케밥과 터키 아이스크림.',
    zoneId: 'D',
    sections: [0],
  },
  {
    id: 8,
    name: '닭강정&꼬치',
    type: 'truck',
    operatingHours: '12:00 ~ 21:00',
    tone: 'coral',
    description: '바삭달콤한 닭강정과 숯불향 가득한 닭꼬치.',
    zoneId: 'D',
    sections: [1],
  },
  {
    id: 9,
    name: '소프트 아이스크림',
    type: 'truck',
    operatingHours: '10:00 ~ 20:00',
    tone: 'mint',
    description: '부드럽고 달콤한 소프트 아이스크림. 컵과 콘 중 선택 가능.',
    zoneId: 'D',
    sections: [2],
  },
]

// ── DefaultPermission (관리자 부스 배치) ──────────────────────────────────

export interface DefaultPermission {
  id: string
  zoneId: string
  sections: number[]
  orgId: string
  orgName: string
  color: string
  category: BoothCategory
  day: PermDay
  time: PermTime
}

const CATEGORY_COLOR: Record<string, string> = {
  정보: '#00C6E0',
  체험: '#9B72E8',
  마켓: '#F5A623',
  활동: '#00D49C',
}

function toCategory(cat?: string): BoothCategory {
  if (cat === '마켓') return '마켓'
  if (cat === '체험') return '체험'
  if (cat === '정보') return '정보'
  return '활동'
}

export const DEFAULT_PERMISSIONS: DefaultPermission[] = [
  ...[...DAY_BOOTHS, ...NIGHT_BOOTHS]
    .filter((b) => b.zoneId && b.sections?.length)
    .flatMap((b) =>
      ([1, 2, 3] as PermDay[]).map((day) => ({
        id: `default-${b.id}-d${day}-${b.zoneId}`,
        zoneId: b.zoneId!,
        sections: b.sections!,
        orgId: `default-${b.id}`,
        orgName: b.name,
        color: CATEGORY_COLOR[toCategory(b.category)] ?? '#00D49C',
        category: toCategory(b.category),
        day,
        time: (DAY_BOOTHS.includes(b) ? '주간' : '야간') as PermTime,
      }))
    ),
]

// ── Menu Mock Data ────────────────────────────────────────────────────────

export const NIGHT_BOOTH_MENUS: MenuItem[] = [
  {
    id: 1,
    boothId: 16,
    name: '청포도 모히토',
    description: '무알콜 가능',
    price: 6000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 2,
    boothId: 16,
    name: '히비스커스 진토닉',
    description: '시그니처',
    price: 7000,
    tone: 'rose',
    isSoldOut: true,
  },
  {
    id: 3,
    boothId: 16,
    name: '복숭아 슬러시',
    description: '논알콜',
    price: 5000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 4,
    boothId: 16,
    name: '안주 - 나초 플래터',
    description: '치즈 듬뿍',
    price: 8000,
    tone: 'coral',
    isSoldOut: true,
  },
  {
    id: 5,
    boothId: 22,
    name: '소주 한 병',
    description: '기본 제공',
    price: 5000,
    tone: 'mint',
    isSoldOut: false,
  },
  {
    id: 6,
    boothId: 22,
    name: '맥주',
    description: '생맥주',
    price: 4000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 7,
    boothId: 22,
    name: '안주 플레이트',
    description: '2인 기준',
    price: 9000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 8,
    boothId: 38,
    name: '곱창 1인분',
    description: '소금/양념',
    price: 10000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 9,
    boothId: 38,
    name: '막창 1인분',
    description: '직화 구이',
    price: 10000,
    tone: 'sun',
    isSoldOut: true,
  },
  {
    id: 10,
    boothId: 38,
    name: '소주',
    price: 5000,
    tone: 'mint',
    isSoldOut: false,
  },
  {
    id: 11,
    boothId: 44,
    name: '포차 세트 A',
    description: '2인 기본',
    price: 18000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 12,
    boothId: 44,
    name: '막걸리',
    description: '1L',
    price: 6000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 13,
    boothId: 44,
    name: '전 모듬',
    description: '김치·해물',
    price: 9000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 14,
    boothId: 73,
    name: '문학주 칵테일',
    description: '시그니처',
    price: 7000,
    tone: 'grape',
    isSoldOut: false,
  },
  {
    id: 15,
    boothId: 73,
    name: '와인 한 잔',
    description: '레드/화이트',
    price: 6000,
    tone: 'rose',
    isSoldOut: false,
  },
  {
    id: 16,
    boothId: 73,
    name: '치즈 안주',
    description: '3종 구성',
    price: 8000,
    tone: 'mint',
    isSoldOut: true,
  },
  {
    id: 17,
    boothId: 47,
    name: '쇼유 라멘',
    description: '진한 간장',
    price: 8000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 18,
    boothId: 47,
    name: '미소 라멘',
    description: '구수한 된장',
    price: 8000,
    tone: 'grape',
    isSoldOut: false,
  },
  {
    id: 19,
    boothId: 47,
    name: '교자 만두',
    description: '5개',
    price: 4000,
    tone: 'coral',
    isSoldOut: true,
  },
  {
    id: 20,
    boothId: 53,
    name: '비빔밥',
    description: '나물+고추장',
    price: 6000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 21,
    boothId: 53,
    name: '된장찌개',
    description: '뚝배기',
    price: 5000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 22,
    boothId: 53,
    name: '공기밥 추가',
    price: 1000,
    tone: 'mint',
    isSoldOut: false,
  },
]

export const DAY_BOOTH_MENUS: MenuItem[] = [
  {
    id: 1,
    boothId: 6,
    name: '페스티벌 에코백',
    description: '로고 디자인 · 한정판',
    price: 12000,
    tone: 'mint',
    isSoldOut: true,
  },
  {
    id: 2,
    boothId: 6,
    name: '축제 키링',
    description: '3종 랜덤 증정',
    price: 5000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 3,
    boothId: 6,
    name: '스티커팩',
    description: 'A/B 타입 선택',
    price: 3000,
    tone: 'leaf',
    isSoldOut: true,
  },
  {
    id: 4,
    boothId: 6,
    name: '포토카드 세트',
    description: '4장 구성',
    price: 8000,
    tone: 'coral',
    isSoldOut: true,
  },
  {
    id: 5,
    boothId: 8,
    name: '핸드메이드 파우치',
    description: '수작업 제품',
    price: 8000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 6,
    boothId: 8,
    name: '빈티지 엽서',
    description: '5장 세트',
    price: 3000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 7,
    boothId: 8,
    name: '소이 캔들',
    description: '핸드메이드',
    price: 9000,
    tone: 'grape',
    isSoldOut: true,
  },
  {
    id: 8,
    boothId: 12,
    name: '타로 리딩',
    description: '카드 3장 기본',
    price: 0,
    tone: 'grape',
    isSoldOut: false,
  },
  {
    id: 9,
    boothId: 12,
    name: '즉석 포토부스',
    description: '인화 1장 포함',
    price: 0,
    tone: 'mint',
    isSoldOut: false,
  },
]

export const TRUCK_BOOTH_MENUS: MenuItem[] = [
  {
    id: 1,
    boothId: 1,
    name: '오리지널 츄러스',
    price: 4000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 2,
    boothId: 1,
    name: '초코 츄러스',
    price: 4500,
    tone: 'grape',
    isSoldOut: true,
  },
  {
    id: 3,
    boothId: 1,
    name: '소프트 아이스크림',
    price: 3000,
    tone: 'grape',
    isSoldOut: false,
  },
  {
    id: 4,
    boothId: 2,
    name: '타코야끼',
    price: 6000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 5,
    boothId: 2,
    name: '회오리감자',
    price: 5000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 6,
    boothId: 3,
    name: '훈제통삼겹 (1인)',
    price: 12000,
    tone: 'rose',
    isSoldOut: false,
  },
  {
    id: 7,
    boothId: 3,
    name: '꼬치',
    price: 6000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 8,
    boothId: 4,
    name: '마라탕',
    price: 8000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 9,
    boothId: 4,
    name: '마라샹궈',
    price: 10000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 10,
    boothId: 5,
    name: '클래식버거',
    price: 7000,
    tone: 'mint',
    isSoldOut: false,
  },
  {
    id: 11,
    boothId: 5,
    name: '치즈버거',
    price: 8000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 12,
    boothId: 5,
    name: '더블패티버거',
    price: 10000,
    tone: 'coral',
    isSoldOut: true,
  },
  {
    id: 13,
    boothId: 6,
    name: '흑당버블티',
    price: 5500,
    tone: 'grape',
    isSoldOut: false,
  },
  {
    id: 14,
    boothId: 6,
    name: '타로버블티',
    price: 5500,
    tone: 'mint',
    isSoldOut: false,
  },
  {
    id: 15,
    boothId: 6,
    name: '딸기버블티',
    price: 5500,
    tone: 'rose',
    isSoldOut: true,
  },
  {
    id: 16,
    boothId: 7,
    name: '케밥 (닭/양/믹스)',
    price: 8000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 17,
    boothId: 7,
    name: '박스 케밥',
    price: 13000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 18,
    boothId: 7,
    name: '터키 아이스크림',
    price: 5000,
    tone: 'mint',
    isSoldOut: false,
  },
  {
    id: 19,
    boothId: 8,
    name: '닭강정 소',
    price: 10000,
    tone: 'coral',
    isSoldOut: false,
  },
  {
    id: 20,
    boothId: 8,
    name: '닭강정 중',
    price: 15000,
    tone: 'sun',
    isSoldOut: false,
  },
  {
    id: 21,
    boothId: 8,
    name: '닭꼬치',
    price: 5000,
    tone: 'leaf',
    isSoldOut: false,
  },
  {
    id: 22,
    boothId: 9,
    name: '소프트 아이스크림컵·콘',
    price: 4500,
    tone: 'mint',
    isSoldOut: false,
  },
]
