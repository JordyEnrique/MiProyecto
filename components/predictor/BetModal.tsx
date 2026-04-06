'use client'

import { useState } from 'react'
import type { PolyMarket } from '@/lib/polymarket'

interface BetModalProps {
  market: PolyMarket
  initialOutcome?: string
  balance: number
  mode: 'paper' | 'real'
  onConfirm: (outcome: string, amount: number) => Promise<void>
  onClose: () => void
}

export default function BetModal({ market, initialOutcome, balance, mode, onConfirm, onClose }: BetModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState(initialOutcome ?? market.outcomes[0])
  const [amount, setAmount] = useState('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const outcomeIdx = market.outcomes.indexOf(selectedOutcome)
  const price      = parseFloat(market.outcomePrices[outcomeIdx] ?? '0.5')
  const potWin     = price > 0 ? Number(amount) / price : 0
  const profit     = potWin - Number(amount)

  async function handleConfirm() {
    const amt = Number(amount)
    if (isNaN(amt) || amt <= 0) {
      setError('Ingresa un monto válido mayor a 0')
      return
    }
    if (amt > balance) {
      setError(`Balance insuficiente. Disponible: $${balance.toFixed(2)}`)
      return
    }
    setError('')
    setLoading(true)
    try {
      await onConfirm(selectedOutcome, amt)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al colocar apuesta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 pr-4">
            {mode === 'real' ? '💰 Apostar dinero real' : '📄 Apostar en modo prueba'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Market question */}
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 leading-snug">
          {market.question}
        </p>

        {/* Outcome selector */}
        <div className="mb-4">
          <label className="label-field">Selecciona el resultado</label>
          <div className="flex gap-2 mt-1">
            {market.outcomes.map((outcome, i) => {
              const p = parseFloat(market.outcomePrices[i] ?? '0')
              return (
                <button
                  key={outcome}
                  onClick={() => setSelectedOutcome(outcome)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedOutcome === outcome
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {outcome}
                  <span className="block text-xs opacity-75 mt-0.5">{(p * 100).toFixed(1)}¢</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="label-field">Monto a apostar (USDC)</label>
          <input
            type="number"
            min="1"
            step="0.5"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="input-field mt-1"
            placeholder="Ej: 10"
          />
          <p className="text-xs text-gray-400 mt-1">
            Balance disponible: <strong>${balance.toFixed(2)} USDC</strong>
          </p>
          {/* Quick amounts */}
          <div className="flex gap-1 mt-2">
            {[5, 10, 25, 50].map(v => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200"
              >
                ${v}
              </button>
            ))}
            <button
              onClick={() => setAmount(Math.floor(balance * 0.1).toString())}
              className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200"
            >
              10%
            </button>
          </div>
        </div>

        {/* Payout preview */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Cotización:</span>
            <span className="font-medium">{(price * 100).toFixed(1)}¢ por acción</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Acciones a comprar:</span>
            <span className="font-medium">{price > 0 ? (Number(amount) / price).toFixed(2) : '—'}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Payout si ganas:</span>
            <span className="font-bold text-green-600">${potWin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ganancia neta:</span>
            <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-2 mb-3">{error}</div>
        )}

        {/* Real money warning */}
        {mode === 'real' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-2 mb-3">
            ⚠️ Esta apuesta usará fondos reales en Polymarket. Verifica que tienes USDC disponible en tu cuenta.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 btn-secondary py-2">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 ${
              mode === 'real'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Procesando…' : mode === 'real' ? 'Confirmar apuesta real' : 'Apostar en modo prueba'}
          </button>
        </div>
      </div>
    </div>
  )
}
