'use client'

import { useState } from 'react'
import type { PolyMarket } from '@/lib/polymarket'

interface MarketCardProps {
  market: PolyMarket
  onPredict: (market: PolyMarket) => void
  onBet: (market: PolyMarket, outcome: string) => void
  loading?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  Crypto:   'bg-yellow-100 text-yellow-800',
  Sports:   'bg-green-100 text-green-800',
  Politics: 'bg-blue-100 text-blue-800',
  default:  'bg-gray-100 text-gray-800',
}

export default function MarketCard({ market, onPredict, onBet, loading }: MarketCardProps) {
  const [expanded, setExpanded] = useState(false)

  const volume    = Number(market.volume  || 0)
  const liquidity = Number(market.liquidity || 0)

  const catColor = CATEGORY_COLORS[market.category] ?? CATEGORY_COLORS.default

  const endDate = market.endDate
    ? new Date(market.endDate).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—'

  return (
    <div className="card border border-gray-200 hover:border-blue-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
          {market.category || 'General'}
        </span>
        <span className="text-xs text-gray-400 whitespace-nowrap">Cierra: {endDate}</span>
      </div>

      {/* Question */}
      <h3
        className="font-semibold text-gray-900 mb-3 cursor-pointer hover:text-blue-700 leading-snug"
        onClick={() => setExpanded(v => !v)}
      >
        {market.question}
      </h3>

      {/* Outcomes */}
      <div className="flex flex-wrap gap-2 mb-3">
        {market.outcomes.map((outcome, i) => {
          const price = parseFloat(market.outcomePrices[i] ?? '0')
          const pct   = (price * 100).toFixed(1)
          const barW  = Math.round(price * 100)
          return (
            <button
              key={outcome}
              onClick={() => onBet(market, outcome)}
              className="flex-1 min-w-[100px] border border-gray-200 rounded-lg p-2 text-left hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                  {outcome}
                </span>
                <span className="text-sm font-bold text-blue-600">{pct}¢</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${barW}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* Description (expandable) */}
      {expanded && market.description && (
        <p className="text-sm text-gray-600 mb-3 leading-relaxed border-t pt-2">
          {market.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>Vol: <strong>${volume.toLocaleString()}</strong> USDC</span>
        <span>Liq: <strong>${liquidity.toLocaleString()}</strong> USDC</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onPredict(market)}
          disabled={loading}
          className="flex-1 btn-primary text-sm py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Analizando…
            </span>
          ) : '🤖 Predecir con IA'}
        </button>
        <button
          onClick={() => setExpanded(v => !v)}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  )
}
