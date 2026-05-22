import { tabBarPb } from '../../../lib/safeArea'
import {
  BOOTH_CATEGORIES,
  BOOTH_CATEGORY_THEMES,
} from '../../../features/User/Map/utils/display'

export function MapLegend() {
  return (
    <div
      className="absolute inset-x-0 z-10 flex justify-center px-4"
      style={{ bottom: tabBarPb }}
    >
      <div className="flex items-center gap-3 rounded-full bg-white/65 px-3 py-1.5 text-ink-80 shadow-[0_1px_6px_rgba(20,26,31,0.08)] backdrop-blur-sm dark:bg-[#13262D]/65">
        {BOOTH_CATEGORIES.map((category) => {
          const theme = BOOTH_CATEGORY_THEMES[category]
          return (
            <div
              key={category}
              className="flex items-center gap-1 text-[11px] font-bold tracking-[-0.2px]"
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: theme.color }}
              />
              {category}
            </div>
          )
        })}
      </div>
    </div>
  )
}
