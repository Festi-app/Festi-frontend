import type { ZoneDef } from '../../../data/zones'
import type { GetLocationsResponseDto } from '../../../features/Map/types/LocationsResponseDto'
import { FESTIV_TOKENS } from '../../../tokens'

const CAT_COLOR_MAP: Record<string, string> = {
  ACTIVITY: FESTIV_TOKENS.pop,
  INFO: FESTIV_TOKENS.mint,
  MARKET: FESTIV_TOKENS.sun,
  EXPERIENCE: FESTIV_TOKENS.grape,
  PROMOTION: FESTIV_TOKENS.coral,
  ALCOHOL: FESTIV_TOKENS.alert,
}

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
            {zoneLocations.map((loc, gi) => {
              const booth = loc.boothSummary
              const isLast = gi === zoneLocations.length - 1
              const isSelected =
                selectedBoothCell?.zoneId === zone.id &&
                selectedBoothCell.slot === loc.index
              const slotColor = booth
                ? (CAT_COLOR_MAP[booth.category] ?? zone.color)
                : 'transparent'
              return (
                <button
                  key={loc.index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectCell(zone.id, loc.index, !!booth)
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
                        : { borderBottom: '1.5px solid rgba(20,26,31,0.22)' }),
                  }}
                >
                  {loc.index + 1}
                </button>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
