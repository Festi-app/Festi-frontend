export type MapMarker = {
  id: number
  x: number
  y: number
  type: string
  name: string
  wait: number
  cat: string
  hours: string
  desc?: string
}

export const MAP_MARKERS: MapMarker[] = [
  {
    id: 6,
    x: 47,
    y: 32,
    type: 'day',
    name: '학생회 굿즈샵',
    wait: 0,
    cat: '마켓',
    hours: '10시 ~ 18시',
    desc: '페스티벌 공식 굿즈를 만나보세요. 한정판 에코백, 키링, 스티커팩을 판매합니다.',
  },
  {
    id: 8,
    x: 55,
    y: 32,
    type: 'day',
    name: '플리마켓',
    wait: 1,
    cat: '마켓',
    hours: '11시 ~ 17시',
    desc: '학생들이 직접 만든 핸드메이드 제품과 빈티지 소품을 판매합니다.',
  },
  {
    id: 12,
    x: 73,
    y: 32,
    type: 'day',
    name: '타로 카페',
    wait: 3,
    cat: '체험',
    hours: '10시 ~ 18시',
    desc: '신비로운 타로카드로 오늘의 운세를 확인해 보세요.',
  },
  {
    id: 77,
    x: 25,
    y: 41,
    type: 'special',
    name: '본부 부스',
    wait: 0,
    cat: '정보',
    hours: '10시 ~ 18시',
    desc: '축제 안내 및 각종 정보를 제공합니다.',
  },
  {
    id: 16,
    x: 32,
    y: 43,
    type: 'night',
    name: '칵테일바',
    wait: 7,
    cat: '컴공과',
    hours: '17시 ~ 22시',
    desc: '시원한 수제 칵테일과 안주로 오늘 밤을 특별하게.',
  },
  {
    id: 22,
    x: 53,
    y: 43,
    type: 'night',
    name: '주점',
    wait: 5,
    cat: '의약학부',
    hours: '17시 ~ 22시',
    desc: '의약학부가 준비한 다양한 주류와 안주를 즐겨보세요.',
  },
  {
    id: 73,
    x: 22,
    y: 56,
    type: 'night',
    name: '술집',
    wait: 4,
    cat: '국문과',
    hours: '17시 ~ 22시',
    desc: '국문과의 감성 가득한 이야기 안줏집.',
  },
  {
    id: 47,
    x: 85,
    y: 55,
    type: 'night',
    name: '라멘바',
    wait: 5,
    cat: '미디어학부',
    hours: '18시 ~ 23시',
    desc: '깊은 육수와 탱글한 면발의 정통 라멘.',
  },
  {
    id: 38,
    x: 75,
    y: 60,
    type: 'night',
    name: '곱창',
    wait: 3,
    cat: '체육학부',
    hours: '17시 ~ 22시',
    desc: '체육학부가 구워드리는 즉석 곱창과 막창.',
  },
  {
    id: 53,
    x: 85,
    y: 69,
    type: 'night',
    name: '비빔밥',
    wait: 2,
    cat: '아랍어학과',
    hours: '17시 ~ 22시',
    desc: '아랍어학과의 알찬 손맛 비빔밥.',
  },
]
