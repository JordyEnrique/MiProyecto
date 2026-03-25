'use client'

import type { PredictionSignal } from '@/app/api/predictor/route'

interface SignalBadgeProps {
  signal: PredictionSignal
  compact?: boolean
}

const dirConfig = {
  BUY:  { label: 'COMPRAR', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40', dot: 'bg-green-400', barColor: 'bg-green-500' },
  SELL: { label: 'VENDER',  bg: 'bg-red-500/20',   text: 'text-red-400',   border: 'border-red-500/40',   dot: 'bg-red-400',   barColor: 'bg-red-500' },
  HOLD: { label: 'ESPERAR', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40', dot: 'bg-yellow-400', barColor: 'bg-yellow-500' },
}

const trendIcon = { UP: '↑', DOWN: '↓', SIDEWAYS: '→' }
const trendColor = { UP: 'text-green-400', DOWN: 'text-red-400', SIDEWAYS: 'text-gray-400' }

export default function SignalBadge({ signal, compact = false }: SignalBadgeProps) {
  const cfg = dirConfig[signal.direction]

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
        {cfg.label}
      </span>
    )
  }

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      {/* Encabezado señal */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`text-lg font-black tracking-wider ${cfg.text}`}>{cfg.label}</span>
        </div>
        <span className={`text-sm font-semibold ${trendColor[signal.trend]}`}>
          {trendIcon[signal.trend]} {signal.trend}
        </span>
      </div>

      {/* Barra de confianza */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Confianza</span>
          <span className={cfg.text}>{signal.confidence}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
            style={{ width: `${signal.confidence}%` }}
          />
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-0.5">RSI</div>
          <div className={`text-sm font-bold ${signal.rsi < 30 ? 'text-green-400' : signal.rsi > 70 ? 'text-red-400' : 'text-gray-200'}`}>
            {signal.rsi}
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-0.5">Momentum</div>
          <div className={`text-sm font-bold ${signal.momentum > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {signal.momentum > 0 ? '+' : ''}{signal.momentum}%
          </div>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-0.5">SMA7/14</div>
          <div className="text-sm font-bold text-gray-200">
            {(signal.sma7 * 100).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  )
}
