import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FESTIV_TOKENS, I, PhotoSlot } from '../../tokens'
import { boothUrl } from '../../constants/routes'
import { useLocations } from '../../features/Map/hooks/useLocations'
import { useBooths } from '../../features/Booth/hooks/useBooths'
import { useFestivalDays } from '../../features/Festival/hooks/useFestivalDays'
import { getZoneName } from '../../lib/format'

const _d = new Date()
const todayStr = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`

export function QuickEntrySection({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)

  function handleRefresh() {
    setSpinning(true)
    refetchLocations()
    refetchBooths()
  }

  const { data: festivalDaysList = [] } = useFestivalDays()
  const todayFestivalDay =
    festivalDaysList.find((d) => d.day === todayStr)?.day ?? ''
  const { data: nightLocations = [], refetch: refetchLocations } = useLocations({
    day: todayFestivalDay,
    type: 'NIGHT',
  })
  const { data: nightBooths = [], refetch: refetchBooths } = useBooths({
    day: todayFestivalDay,
    type: 'NIGHT',
  })

  const booths = nightBooths
    .filter((booth) => (booth.waitingTeamCount ?? Infinity) <= 2)
    .map((booth) => ({
      booth,
      location: nightLocations.find(
        (loc) => loc.boothSummary?.id === booth.id
      ),
    }))

  return (
    <>
      {compact ? (
        <div className="flex items-center gap-3 px-5 pb-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-bold tracking-[0.3px] text-ink-40">
            빠른 입장 가능한 부스
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : (
        <div className="mb-3 flex items-end justify-between px-5">
          <div>
            <div className="text-lg font-extrabold tracking-[-0.5px] text-ink">
              지금 바로 입장 가능
            </div>
            <div className="mt-0.5 text-xs text-ink-60">
              대기 2팀 이하 · 빠르게 방문해보세요
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            onAnimationEnd={() => setSpinning(false)}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-surface-alt p-1.5 text-ink-60"
            style={
              spinning
                ? { animation: 'festi-spin-once 0.5s ease both' }
                : undefined
            }
          >
            {I.refresh()}
          </button>
        </div>
      )}
      {booths.length === 0 ? (
        <div
          className={`mx-5 flex items-center justify-center rounded-[18px] border border-border bg-surface py-6 text-[13px] text-ink-40 ${compact ? '' : 'mb-6'}`}
        >
          지금 바로 입장 가능한 부스가 없어요
        </div>
      ) : (
        <div
          className={`flex gap-3 overflow-x-auto px-5 pb-1 ${compact ? 'mb-0' : 'mb-6'}`}
        >
          {booths.map(({ booth, location }) => {
            const wait = booth.waitingTeamCount ?? 0
            const badgeBg =
              wait === 0
                ? FESTIV_TOKENS.pop
                : wait === 1
                  ? '#A3E635'
                  : FESTIV_TOKENS.sun
            return (
              <button
                key={booth.id}
                type="button"
                onClick={() => navigate(boothUrl('night', booth.id))}
                className="w-36 shrink-0 rounded-[20px] border border-border bg-surface p-2.5 text-left transition-transform duration-100 active:scale-[0.97]"
              >
                <div className="relative mb-2.5">
                  <PhotoSlot
                    label=""
                    tone={undefined}
                    ratio="1/1"
                    radius={14}
                  />
                  {location?.index != null && (
                    <div className="absolute top-2 left-2 rounded-full bg-[rgba(15,42,51,0.85)] px-2 py-0.75 text-[11px] font-bold text-white">
                      #{location.index + 1}
                    </div>
                  )}
                  <div
                    className="absolute right-2 bottom-2 rounded-full px-2 py-0.75 text-[11px] font-bold text-[#141A1F]"
                    style={{ background: badgeBg }}
                  >
                    {wait === 0 ? '바로 입장' : `${wait}팀`}
                  </div>
                </div>
                <div className="text-sm font-bold leading-[1.2] tracking-[-0.3px] text-ink">
                  {booth.name}
                </div>
                <div className="mt-1 text-[11px] text-ink-60">
                  {location ? getZoneName(location.zoneLabel) : ''}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
