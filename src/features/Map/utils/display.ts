import { FESTIV_TOKENS } from '../../../../tokens'
import type { BoothCategory } from '../../../../stores/useBoothSectionStore'

export const BOOTH_CATEGORY_THEMES: Record<
  BoothCategory,
  { color: string; soft: string }
> = {
  정보: { color: FESTIV_TOKENS.mint, soft: FESTIV_TOKENS.mintSoft },
  체험: { color: FESTIV_TOKENS.grape, soft: FESTIV_TOKENS.grapeSoft },
  마켓: { color: FESTIV_TOKENS.sun, soft: FESTIV_TOKENS.sunSoft },
  활동: { color: FESTIV_TOKENS.pop, soft: FESTIV_TOKENS.popSoft },
}

export const BOOTH_CATEGORIES = Object.keys(
  BOOTH_CATEGORY_THEMES
) as BoothCategory[]

export function typeColor(type: string): string {
  if (type === 'truck') return FESTIV_TOKENS.sun
  if (type === 'night') return FESTIV_TOKENS.alert
  if (type === 'special') return FESTIV_TOKENS.grape
  return FESTIV_TOKENS.pop
}

export function typeLabel(type: string): string {
  if (type === 'truck') return '푸드트럭'
  if (type === 'night') return '야간'
  if (type === 'special') return '안내'
  return '주간'
}

export function waitStatus(w: number): { color: string; label: string } {
  if (w === 0) return { color: FESTIV_TOKENS.pop, label: '바로 입장' }
  if (w <= 2) return { color: FESTIV_TOKENS.pop, label: `${w}팀` }
  return { color: FESTIV_TOKENS.alert, label: `${w}팀` }
}
