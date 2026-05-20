import { create } from 'zustand'
import { ALL_ZONES } from '../data/zones'

export type PermDay = 1 | 2 | 3
export type PermTime = '주간' | '야간'
export type BoothCategory = '정보' | '체험' | '마켓' | '활동'

export interface BoothPermission {
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

export type BoothMapMode = '주간' | '야간' | '푸드트럭'

interface BoothSectionState {
  permissions: BoothPermission[]
  zoneDivisions: Record<string, number>
  configuredModes: BoothMapMode[]
  addPermission: (p: BoothPermission) => void
  removePermission: (id: string) => void
  setZoneDivisions: (
    fn: (prev: Record<string, number>) => Record<string, number>
  ) => void
  markModeConfigured: (mode: BoothMapMode) => void
  clearPermissionsForZoneBeyond: (zoneId: string, maxSection: number) => void
}

export const useBoothSectionStore = create<BoothSectionState>((set) => ({
  permissions: [],
  zoneDivisions: Object.fromEntries(
    ALL_ZONES.map((z) => [z.id, z.defaultCount])
  ),
  configuredModes: [],
  addPermission: (p) => set((s) => ({ permissions: [...s.permissions, p] })),
  removePermission: (id) =>
    set((s) => ({ permissions: s.permissions.filter((p) => p.id !== id) })),
  setZoneDivisions: (fn) =>
    set((s) => ({ zoneDivisions: fn(s.zoneDivisions) })),
  markModeConfigured: (mode) =>
    set((s) => ({
      configuredModes: s.configuredModes.includes(mode)
        ? s.configuredModes
        : [...s.configuredModes, mode],
    })),
  clearPermissionsForZoneBeyond: (zoneId, maxSection) =>
    set((s) => ({
      permissions: s.permissions
        .map((p) =>
          p.zoneId === zoneId
            ? { ...p, sections: p.sections.filter((sec) => sec < maxSection) }
            : p
        )
        .filter((p) => p.sections.length > 0),
    })),
}))
