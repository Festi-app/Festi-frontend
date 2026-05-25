import type { ZoneDef } from '../../../data/zones'
import type { GetLocationsResponseDto } from '../../../features/Map/types/LocationsResponseDto'
import type { BoothSummary } from '../../../types/common'
import { FESTIV_TOKENS } from '../../../tokens'

const CAT_COLOR: Record<string, string> = {
  ACTIVITY: FESTIV_TOKENS.pop,
  INFO: FESTIV_TOKENS.mint,
  MARKET: FESTIV_TOKENS.sun,
  EXPERIENCE: FESTIV_TOKENS.grape,
  PROMOTION: FESTIV_TOKENS.coral,
  ALCOHOL: FESTIV_TOKENS.alert,
}

interface Props {
  mapView: 'day' | 'night'
  activeBoothZones: ZoneDef[]
  locationsByZone: Record<string, GetLocationsResponseDto[]>
  selectedBoothCell: { zoneId: string; slot: number } | null
  onSelectCell: (zoneId: string, slot: number, hasBooth: boolean) => void
}

interface SlotGroup {
  start: number
  end: number
  booth: BoothSummary | null
  category: string | null
}

function buildGroups(
  zoneLocations: GetLocationsResponseDto[],
  defaultCount: number
): SlotGroup[] {
  const groups: SlotGroup[] = []
  for (let slotIndex = 1; slotIndex <= defaultCount; slotIndex++) {
    const loc = zoneLocations.find((l) => l.index === slotIndex)
    const booth = loc?.boothSummary ?? null
    const category = booth?.category ?? null
    const last = groups[groups.length - 1]
    if (last && booth !== null && last.booth?.id === booth.id) {
      last.end = slotIndex
    } else {
      groups.push({ start: slotIndex, end: slotIndex, booth, category })
    }
  }
  return groups
}

export function MapDayNightZones({
  mapView,
  activeBoothZones,
  locationsByZone,
  selectedBoothCell,
  onSelectCell,
}: Props) {
  const isDay = mapView === 'day'

  return (
    <>
      {activeBoothZones.map((zone) => {
        const zoneLocations = locationsByZone[zone.id] ?? []
        const groups = buildGroups(zoneLocations, zone.defaultCount)
        return (
          <div
            key={zone.id}
            className="absolute z-2 flex rounded-sm"
            style={{
              left: zone.left,
              top: zone.top,
              width: zone.width,
              height: zone.height,
              flexDirection: zone.dir,
              background: zone.color,
              border: '1.5px solid rgba(20,26,31,0.22)',
            }}
          >
            {groups.map((group, gi) => {
              const { start, end, booth, category } = group
              const span = end - start + 1
              const isLast = gi === groups.length - 1
              const isSelected =
                selectedBoothCell?.zoneId === zone.id &&
                selectedBoothCell.slot >= start &&
                selectedBoothCell.slot <= end
              const label = start === end ? `${start}` : `${start}-${end}`
              const bgColor = booth
                ? isDay
                  ? (CAT_COLOR[category ?? ''] ?? zone.color)
                  : zone.color
                : 'rgba(0,0,0,0.15)'

              return (
                <button
                  key={start}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectCell(zone.id, start, !!booth)
                  }}
                  className="relative flex min-h-0 min-w-0 select-none items-center justify-center overflow-hidden text-[7px] font-extrabold transition-[background,box-shadow,opacity]"
                  style={{
                    flex: span,
                    background: bgColor,
                    color: FESTIV_TOKENS.ink,
                    boxShadow: isSelected
                      ? 'inset 0 0 0 2px rgba(255,255,255,0.95), 0 0 0 1px rgba(20,26,31,0.2)'
                      : undefined,
                    ...(isLast
                      ? {}
                      : zone.dir === 'row'
                        ? { borderRight: '1.5px solid rgba(20,26,31,0.22)' }
                        : { borderBottom: '1.5px solid rgba(20,26,31,0.22)' }),
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
