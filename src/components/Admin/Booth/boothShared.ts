import type {
  BoothCategory,
  PermDay,
  PermTime,
} from '../../../stores/useBoothSectionStore'

export type { BoothCategory, PermDay, PermTime }

export interface OrgAccount {
  id: string
  name: string
  type: '동아리' | '학생회' | '부서'
  color: string
  applications: Array<{ day: PermDay; time: PermTime }>
  dayCategory?: BoothCategory
}
