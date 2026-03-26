'use client'

interface PriceChartProps {
  prices: number[]
  color?: string
  height?: number
  showGrid?: boolean
}

export default function PriceChart({ prices, color = '#22c55e', height = 80, showGrid = false }: PriceChartProps) {
  if (!prices || prices.length < 2) return null
  const width = 300
  const padding = { top: 4, bottom: 4, left: 2, right: 2 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 0.01
  const toX = (i: number) => padding.left + (i / (prices.length - 1)) * innerW
  const toY = (v: number) => padding.top + (1 - (v - min) / range) * innerH
  const linePath = prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ')
  const areaPath = [`M${toX(0).toFixed(1)},${(padding.top + innerH).toFixed(1)}`, ...prices.map((p, i) => `L${toX(i).toFixed(1)},${toY(p).toFixed(1)}`), `L${toX(prices.length - 1).toFixed(1)},${(padding.top + innerH).toFixed(1)}`, 'Z'].join(' ')
  const gradId = `grad-${color.replace('#', '')}`
  const isUp = prices[prices.length - 1] >= prices[0]
  const areaColor = isUp ? '#22c55e' : '#ef4444'
  const lineColor = isUp ? '#22c55e' : '#ef4444'
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={areaColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={areaColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {showGrid && [0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padding.left} y1={padding.top + f * innerH} x2={padding.left + innerW} y2={padding.top + f * innerH} stroke="#374151" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={toX(prices.length - 1)} cy={toY(prices[prices.length - 1])} r="2.5" fill={lineColor} />
    </svg>
  )
}
