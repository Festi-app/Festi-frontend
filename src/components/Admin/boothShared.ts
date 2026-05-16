import { FESTI_TOKENS } from '../../tokens'
import type {
  BoothCategory,
  PermDay,
  PermTime,
} from '../../stores/useBoothSectionStore'

export type { BoothCategory, PermDay, PermTime }

export interface OrgAccount {
  id: string
  name: string
  type: '동아리' | '학생회' | '부서'
  color: string
  applications: Array<{ day: PermDay; time: PermTime }>
  dayCategory?: BoothCategory
}

export const CATEGORY_COLORS: Record<BoothCategory, string> = {
  정보: FESTI_TOKENS.mint,
  체험: FESTI_TOKENS.grape,
  마켓: FESTI_TOKENS.sun,
  활동: FESTI_TOKENS.pop,
}
