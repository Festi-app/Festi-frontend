import { TRUCK_ZONES } from '../../../stores/useTruckPlacementStore'
import type { GetLocationsResponseDto } from '../../../features/Map/types/LocationsResponseDto'
import { FESTIV_TOKENS } from '../../../tokens'

interface Props {
  zoneRotations: Record<string, number>
  locationsByZone: Record<string, GetLocationsResponseDto[]>
  selectedSection: { zoneId: string; slot: number } | null
  onSelectSection: (zoneId: string, slot: number, hasTruck: boolean) => void
}

export function MapTruckZones({
  zoneRotations,
  locationsByZone,
  selectedSection,
  onSelectSection,
}: Props) {
  return (
    <>
      {TRUCK_ZONES.map((zone) => {
        const zoneLocations = locationsByZone[zone.id] ?? []
        const rotate = zoneRotations[zone.id] ?? zone.rotate
        return (
          <div
            key={zone.id}
            className="absolute flex"
            style={{
              left: zone.left,
              top: zone.top,
              width: zone.width,
              height: zone.height,
              flexDirection: zone.dir === 'row' ? 'row' : 'column',
              background: zone.color,
              border: '1.5px solid rgba(20,26,31,0.22)',
              borderRadius: '2px',
              transform: `rotate(${rotate}deg)`,
              transformOrigin: 'center',
              zIndex: 2,
            }}
          >
            {Array.from({ length: zone.slotCount }, (_, i) => i + 1).map(
              (slotIndex) => {
                const loc = zoneLocations.find((l) => l.index === slotIndex)
                const truck = loc?.boothSummary ?? null
                const isSelected =
                  selectedSection?.zoneId === zone.id &&
                  selectedSection.slot === slotIndex
                const isLast = slotIndex === zone.slotCount
                return (
                  <button
                    key={slotIndex}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSection(zone.id, slotIndex, !!truck)
                    }}
                    className="flex min-h-0 min-w-0 flex-1 select-none items-center justify-center text-[7px] font-extrabold"
                    style={{
                      background: isSelected
                        ? zone.color
                        : truck
                          ? zone.color
                          : 'rgba(0,0,0,0.15)',
                      color: FESTIV_TOKENS.ink,
                      boxShadow: isSelected
                        ? 'inset 0 0 0 2px rgba(255,255,255,0.9)'
                        : undefined,
                      ...(isLast
                        ? {}
                        : zone.dir === 'row'
                          ? { borderRight: '1px solid rgba(20,26,31,0.18)' }
                          : { borderBottom: '1px solid rgba(20,26,31,0.18)' }),
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
