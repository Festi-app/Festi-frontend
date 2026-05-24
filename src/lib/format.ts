import { ZONES, NIGHT_ZONES } from '../data/zones'
import { TRUCK_ZONES } from '../stores/useTruckPlacementStore'

const ALL_ZONES = [...ZONES, ...NIGHT_ZONES, ...TRUCK_ZONES]

export function getZoneName(
  zoneLabel: string | null | undefined
): string | undefined {
  if (!zoneLabel) return undefined
  return ALL_ZONES.find((z) => z.id === zoneLabel)?.name ?? zoneLabel
}

export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

export function formatSections(sections: number[]): string {
  return sections.join('·')
}
