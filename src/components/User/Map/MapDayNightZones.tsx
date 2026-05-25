import type { ZoneDef } from '../../../data/zones'
import type { GetLocationsResponseDto } from '../../../features/Map/types/LocationsResponseDto'
import { FESTIV_TOKENS } from '../../../tokens'

interface Props {
  activeBoothZones: ZoneDef[]
  locationsByZone: Record<string, GetLocationsResponseDto[]>
  selectedBoothCell: { zoneId: string; slot: number } | null
  onSelectCell: (zoneId: string, slot: number, hasBooth: boolean) => void
}

export function MapDayNightZones({
  activeBoothZones,
  locationsByZone,
  selectedBoothCell,
  onSelectCell,
}: Props) {
  return (
    <>
      {activeBoothZones.map((zone) => {
        const zoneLocations = locationsByZone[zone.id] ?? []
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
            {Array.from({ length: zone.defaultCount }, (_, i) => i + 1).map(
              (slotIndex) => {
                const loc = zoneLocations.find((l) => l.index === slotIndex)
                const booth = loc?.boothSummary ?? null
                const isLast = slotIndex === zone.defaultCount
                const isSelected =
                  selectedBoothCell?.zoneId === zone.id &&
                  selectedBoothCell.slot === slotIndex
                const slotColor = booth ? zone.color : 'transparent'
                return (
                  <button
                    key={slotIndex}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCell(zone.id, slotIndex, !!booth)
                    }}
                    className="relative flex min-h-0 min-w-0 select-none items-center justify-center overflow-hidden text-[7px] font-extrabold transition-[background,box-shadow,opacity]"
                    style={{
                      flex: 1,
                      background: slotColor,
                      color: FESTIV_TOKENS.ink,
                      boxShadow: isSelected
                        ? 'inset 0 0 0 2px rgba(255,255,255,0.95), 0 0 0 1px rgba(20,26,31,0.2)'
                        : undefined,
                      ...(isLast
                        ? {}
                        : zone.dir === 'row'
                          ? { borderRight: '1.5px solid rgba(20,26,31,0.22)' }
                          : {
                              borderBottom: '1.5px solid rgba(20,26,31,0.22)',
                            }),
                    }}
                  >
                    {slotIndex}
                  </button>
                )
              }
            )}
          </div>
        )
      })}
    </>
  )
}
