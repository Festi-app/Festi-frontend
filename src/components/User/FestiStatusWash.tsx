export function FestiStatusWash({
  color = '#A9E5E7',
  height = 58,
}: {
  color?: string
  height?: number
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 z-1"
      style={{ height, background: color }}
    />
  )
}
