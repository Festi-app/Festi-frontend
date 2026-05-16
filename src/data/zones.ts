import { FESTI_TOKENS } from '../tokens'

export interface ZoneDef {
  id: string
  name: string
  defaultCount: number
  dir: 'row' | 'column'
  color: string
  left: string
  top: string
  width: string
  height: string
}

// 주간 지도 (1072 × 998)
export const ZONES: ZoneDef[] = [
  { id: 'A', name: '진리관 앞',    defaultCount: 14, dir: 'row',    color: FESTI_TOKENS.mint,  left: '24%',   top: '31%',   width: '62%',   height: '4.5%' },
  { id: 'B', name: '중앙 가로줄', defaultCount: 12, dir: 'row',    color: FESTI_TOKENS.coral, left: '28%',   top: '38.5%', width: '48%',   height: '4.5%' },
  { id: 'C', name: '동측 세로줄', defaultCount: 16, dir: 'column', color: FESTI_TOKENS.mint,  left: '76%',   top: '40%',   width: '7%',    height: '39%'  },
  { id: 'D', name: '외측 세로줄', defaultCount: 16, dir: 'column', color: FESTI_TOKENS.sun,   left: '83.5%', top: '40%',   width: '7%',    height: '39%'  },
  { id: 'E', name: '하단 가로줄', defaultCount: 12, dir: 'row',    color: FESTI_TOKENS.coral, left: '28%',   top: '81%',   width: '48.5%', height: '4.5%' },
  { id: 'F', name: '서측 세로줄', defaultCount:  6, dir: 'column', color: FESTI_TOKENS.mint,  left: '23%',   top: '48%',   width: '5%',    height: '30%'  },
  { id: 'G', name: '시계탑',      defaultCount:  1, dir: 'row',    color: FESTI_TOKENS.grape, left: '22%',   top: '38%',   width: '4%',    height: '4.5%' },
]

// 야간 지도 (1430 × 846)
export const NIGHT_ZONES: ZoneDef[] = [
  { id: 'N1', name: '베어드홀 앞',          defaultCount: 4, dir: 'row',    color: FESTI_TOKENS.mint,  left: '18%',   top: '55%',   width: '12%',  height: '8%'  },
  { id: 'N2', name: '형남공학관 앞',        defaultCount: 6, dir: 'row',    color: FESTI_TOKENS.coral, left: '15.5%', top: '70%',   width: '19%',  height: '8%'  },
  { id: 'N3', name: '중앙광장 서측',        defaultCount: 3, dir: 'column', color: FESTI_TOKENS.sun,   left: '36.5%', top: '43%',   width: '6%',   height: '23%' },
  { id: 'N4', name: '중앙광장 하단',        defaultCount: 6, dir: 'row',    color: FESTI_TOKENS.coral, left: '43%',   top: '64%',   width: '23%',  height: '7%'  },
  { id: 'N5', name: '백마상 위',            defaultCount: 6, dir: 'row',    color: FESTI_TOKENS.mint,  left: '42.5%', top: '37%',   width: '21%',  height: '8%'  },
  { id: 'N6', name: '진리관 앞',            defaultCount: 4, dir: 'column', color: FESTI_TOKENS.grape, left: '50%',   top: '6.5%',  width: '8%',   height: '19%' },
  { id: 'N7', name: '조만식·신양관 사이',  defaultCount: 4, dir: 'column', color: FESTI_TOKENS.rose,  left: '64.5%', top: '17%',   width: '6.5%', height: '18%' },
  { id: 'N8', name: '웨스트민스터홀 앞',   defaultCount: 4, dir: 'row',    color: FESTI_TOKENS.leaf,  left: '76%',   top: '16.5%', width: '11%',  height: '12%' },
  { id: 'N9', name: '신양관 옆',            defaultCount: 4, dir: 'row',    color: FESTI_TOKENS.pop,   left: '63%',   top: '42%',   width: '8%',   height: '22%' },
]

export const ALL_ZONES = [...ZONES, ...NIGHT_ZONES]
