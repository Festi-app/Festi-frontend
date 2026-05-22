/** paddingBottom for the tab bar's outer wrapper (home indicator clearance). */
export const tabBarOuterPb = 'calc(0.875rem + env(safe-area-inset-bottom))'

/** paddingBottom that clears the floating tab bar (pill ~70px + outer padding 14px = ~84px). */
export const tabBarPb = 'calc(6rem + env(safe-area-inset-bottom))'

/** tabBarPb + ~86px for the sticky CTA button (pt-3 + button ~74px) above the tab bar. */
export const tabBarPbTall = 'calc(11.5rem + env(safe-area-inset-bottom))'
