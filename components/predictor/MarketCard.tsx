'use client'

import { useState } from 'react'
import type { MarketData } from '@/app/api/predictor/route'
import PriceChart from './PriceChart'
import SignalBadge from './SignalBadge'
import { loadState, buyPosition, saveState } from '@/lib/simulator'

interface MarketCardProps {
  market: MarketData
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n}`
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const categoryColors: Record<string, string> = {
  Crypto: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  Deportes: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Política: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  Economía: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  General: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
}

function getCategoryColor(cat: string): string {
  for (const key of Object.keys(categoryColors)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return categoryColors[key]
  }
  return categoryColors.General
}

export default function MarketCard({ market }: MarketCardProps) {
  const [expanded, setExpanded]       = useState(false)
  const [showBetForm, setShowBetForm] = useState(false)
  const [betOutcome, setBetOutcome]   = useState<'Yes' | 'No'>('Yes')
  const [betAmount, setBetAmount]     = useState('10')
  const [betMsg, setBetMsg]           = useState('')

  const yesOutcome = market.outcomes[0]
  const noOutcome  = market.outcomes[1]

  function handleSimBet() {
    const amount = parseFloat(betAmount)
    const outcome = market.outcomes.find(o => o.name === betOutcome) ?? market.outcomes[0]
    const state = loadState()
    const { state: newState, error } = buyPosition(state, {
      marketId: market.id,
      question: market.question,
      outcome: betOutcome,
      currentPrice: outcome.price,
      amount,
      signal: market.signal.direction,
    })
    if (error) { setBetMsg(`Error: ${error}`); return }
    saveState(newState)
    setBetMsg(`Apuesta simulada: $${amount} en ${betOutcome} a ${(outcome.price * 100).toFixed(1)}¢`)
    setTimeout(() => { setBetMsg(''); setShowBetForm(false) }, 2500)
  }

  const priceChange = yesOutcome
    ? yesOutcome.priceHistory[yesOutcome.priceHistory.length - 1] - yesOutcome.priceHistory[0]
    : 0
  const pctChange = yesOutcome?.priceHistory[0]
    ? ((priceChange / yesOutcome.priceHistory[0]) * 100)
    : 0

  return (
    <div className="bg-gray-900 border border-gray-700/60 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200">
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(market.category)}`}>
              {market.category}
            </span>
            {market.hasRealHistory ? (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium">● Historial real</span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-700/50 border border-gray-600/30 text-gray-500 font-medium">~ Demo</span>
            )}
          </div>
          <SignalBadge signal={market.signal} compact />
        </div>
        <h3 className="text-sm font-semibold text-gray-100 leading-snug line-clamp-2">{market.question}</h3>
      </div>

      {yesOutcome && (
        <div className="px-4 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Precio YES</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">{(yesOutcome.price * 100).toFixed(1)}%</span>
              <span className={`text-xs font-semibold ${pctChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="h-16"><PriceChart prices={yesOutcome.priceHistory} height={64} /></div>
        </div>
      )}

      <div className="px-4 pb-3">
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mt-2">
          <div className="bg-green-500 rounded-l-full" style={{ width: `${(yesOutcome?.price ?? 0.5) * 100}%` }} />
          <div className="bg-red-500 rounded-r-full flex-1" />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>SÍ {((yesOutcome?.price ?? 0.5) * 100).toFixed(0)}%</span>
          <span>NO {((noOutcome?.price ?? 0.5) * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center">
        <div><div className="text-xs text-gray-500">Volumen</div><div className="text-xs font-semibold text-gray-300">{formatVolume(market.volume)}</div></div>
        <div><div className="text-xs text-gray-500">Liquidez</div><div className="text-xs font-semibold text-gray-300">{formatVolume(market.liquidity)}</div></div>
        <div><div className="text-xs text-gray-500">Vence</div><div className="text-xs font-semibold text-gray-300">{formatDate(market.endDate)}</div></div>
      </div>

      <div className="px-4 pb-3">
        {!showBetForm ? (
          <button onClick={() => setShowBetForm(true)} className="w-full py-2 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/40 text-yellow-400 text-xs font-bold rounded-xl transition-colors">
            Simular apuesta
          </button>
        ) : (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 space-y-2">
            <div className="flex gap-1">
              {market.outcomes.map(o => (
                <button key={o.name} onClick={() => setBetOutcome(o.name as 'Yes' | 'No')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${betOutcome === o.name ? (o.name === 'Yes' ? 'bg-green-500 text-black' : 'bg-red-500 text-white') : 'bg-gray-700 text-gray-400'}`}>
                  {o.name} {(o.price * 100).toFixed(0)}¢
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} placeholder="USDC"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500" min="1" />
              <button onClick={handleSimBet} className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors">Apostar</button>
              <button onClick={() => setShowBetForm(false)} className="px-2 py-1.5 bg-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-600 transition-colors">✕</button>
            </div>
            {betMsg && (
              <div className={`text-xs px-2 py-1.5 rounded-lg ${betMsg.startsWith('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{betMsg}</div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 bg-gray-800/50 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5">
        {expanded ? '▲' : '▼'} {expanded ? 'Ocultar análisis' : 'Ver análisis técnico'}
      </button>

      {expanded && (
        <div className="p-4 pt-3 border-t border-gray-700/50">
          <SignalBadge signal={market.signal} />
          {yesOutcome && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Historial de precio YES</div>
              <div className="h-32 bg-gray-800/40 rounded-xl p-2"><PriceChart prices={yesOutcome.priceHistory} height={112} showGrid /></div>
            </div>
          )}
          <div className="mt-3 space-y-2">
            {market.outcomes.map((o) => (
              <div key={o.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-8">{o.name}</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${o.name === 'Sí' || o.name === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${o.price * 100}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-200 w-10 text-right">{(o.price * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
