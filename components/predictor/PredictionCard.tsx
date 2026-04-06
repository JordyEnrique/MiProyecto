'use client'

import { useState } from 'react'

interface PredictionCardProps {
  prediction: {
    id: string
    question: string
    prediction: string
    confidence: number
    reasoning: string
    suggestedBetSize: number
    currentOdds: string   // JSON
    status: string
    createdAt: string
    category?: string
  }
  onBet?: (predictionId: string, outcome: string, amount: number) => void
  mode?: 'paper' | 'real'
}

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  won:     'bg-green-100 text-green-800',
  lost:    'bg-red-100 text-red-800',
  void:    'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Abierto',
  won:     '✅ Ganado',
  lost:    '❌ Perdido',
  void:    'Anulado',
}

export default function PredictionCard({ prediction, onBet, mode }: PredictionCardProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [betAmount, setBetAmount] = useState(prediction.suggestedBetSize.toFixed(2))

  const odds = (() => {
    try { return JSON.parse(prediction.currentOdds) as Record<string, number> }
    catch { return {} }
  })()

  const marketPrice = odds[prediction.prediction] ?? 0
  const potentialWin = marketPrice > 0 ? Number(betAmount) / marketPrice : 0

  const confPct = (prediction.confidence * 100).toFixed(0)
  const confColor =
    prediction.confidence >= 0.75 ? 'text-green-600' :
    prediction.confidence >= 0.55 ? 'text-yellow-600' : 'text-red-500'

  const badge = STATUS_BADGES[prediction.status] ?? STATUS_BADGES.void
  const label = STATUS_LABELS[prediction.status] ?? prediction.status

  return (
    <div className="card border border-gray-200">
      {/* Status badge */}
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
        <span className="text-xs text-gray-400">
          {new Date(prediction.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      </div>

      {/* Question */}
      <p className="text-sm text-gray-600 mb-2 leading-snug">{prediction.question}</p>

      {/* Prediction summary */}
      <div className="bg-blue-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Predicción</span>
            <p className="font-bold text-blue-700 text-lg">{prediction.prediction}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Confianza</span>
            <p className={`font-bold text-xl ${confColor}`}>{confPct}%</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Cotización</span>
            <p className="font-bold text-gray-700">{(marketPrice * 100).toFixed(1)}¢</p>
          </div>
        </div>
      </div>

      {/* Reasoning toggle */}
      <button
        onClick={() => setShowReasoning(v => !v)}
        className="text-xs text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
      >
        {showReasoning ? '▲ Ocultar análisis' : '▼ Ver análisis completo'}
      </button>

      {showReasoning && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
          {prediction.reasoning}
        </div>
      )}

      {/* Bet action (only for pending bets) */}
      {prediction.status === 'pending' && onBet && (
        <div className="border-t pt-3 mt-1">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Monto a apostar (USDC)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={betAmount}
                onChange={e => setBetAmount(e.target.value)}
                className="input-field text-sm py-1.5"
              />
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block mb-1">Ganancia potencial</span>
              <span className="text-sm font-bold text-green-600">
                ${potentialWin.toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onBet(prediction.id, prediction.prediction, Number(betAmount))}
            className={`w-full mt-2 text-sm py-2 rounded-lg font-semibold transition-colors ${
              mode === 'real'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {mode === 'real' ? '💰 Apostar dinero real' : '📄 Apostar en modo prueba'}
          </button>
        </div>
      )}
    </div>
  )
}
