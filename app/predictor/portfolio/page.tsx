'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import PortfolioStats from '@/components/predictor/PortfolioStats'
import PredictionCard from '@/components/predictor/PredictionCard'

interface BetOrder {
  id: string
  question: string
  outcome: string
  amount: number
  price: number
  potentialWin: number
  mode: string
  status: string
  createdAt: string
  resolvedAt?: string
  prediction?: { confidence: number }
}

interface PortfolioData {
  stats: {
    balance: number
    mode: string
    totalBets: number
    openBets: number
    wonBets: number
    lostBets: number
    totalWagered: number
    totalWon: number
    totalLost: number
    openExposure: number
    netPnlBets: number
    winRate: number
    roiBets: number
    totalPredictions: number
    aiCostPerPrediction: number
    totalAiCost: number
    netPnlReal: number
    roiReal: number
  }
  recentBets: BetOrder[]
  recentPredictions: Parameters<typeof PredictionCard>[0]['prediction'][]
}

const STATUS_BADGES: Record<string, string> = {
  open:      'bg-yellow-100 text-yellow-800',
  won:       'bg-green-100 text-green-800',
  lost:      'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500',
  void:      'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  open:      'Abierta',
  won:       '✅ Ganada',
  lost:      '❌ Perdida',
  cancelled: 'Cancelada',
  void:      'Anulada',
}

export default function PortfolioPage() {
  const [data, setData]       = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [tab, setTab]         = useState<'bets' | 'predictions'>('bets')
  const [notify, setNotify]   = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/predictor/portfolio')
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleSync() {
    setSyncing(true)
    try {
      const res  = await fetch('/api/predictor/sync', { method: 'POST' })
      const json = await res.json()
      setNotify(json.message ?? 'Sincronizado')
      loadData()
    } finally {
      setSyncing(false)
      setTimeout(() => setNotify(''), 4000)
    }
  }

  async function cancelBet(betId: string) {
    const res = await fetch(`/api/predictor/bet?id=${betId}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) { alert(json.error); return }
    setNotify(json.message ?? 'Apuesta cancelada')
    loadData()
    setTimeout(() => setNotify(''), 4000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Notification */}
      {notify && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white rounded-lg px-4 py-3 text-sm font-medium shadow-lg">
          {notify}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/predictor" className="text-sm text-blue-600 hover:underline mb-1 block">
            ← Volver al predictor
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">📊 Mi Portfolio</h1>
        </div>
        <Link href="/predictor/settings" className="btn-secondary text-sm py-2">
          ⚙️ Ajustes
        </Link>
      </div>

      {/* Stats */}
      {data && (
        <div className="mb-8">
          <PortfolioStats stats={data.stats} onSync={handleSync} syncing={syncing} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {(['bets', 'predictions'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'bets' ? '🎯 Apuestas' : '🤖 Predicciones'}
          </button>
        ))}
      </div>

      {/* Bets table */}
      {tab === 'bets' && (
        <div className="overflow-x-auto">
          {!data?.recentBets?.length ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🎯</p>
              <p>No tienes apuestas todavía.</p>
              <Link href="/predictor" className="btn-primary mt-4 inline-block text-sm">
                Explorar mercados
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4 font-medium">Mercado</th>
                  <th className="pb-2 pr-4 font-medium">Resultado</th>
                  <th className="pb-2 pr-4 font-medium text-right">Monto</th>
                  <th className="pb-2 pr-4 font-medium text-right">Payout</th>
                  <th className="pb-2 pr-4 font-medium">Modo</th>
                  <th className="pb-2 pr-4 font-medium">Estado</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentBets.map(bet => (
                  <tr key={bet.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 max-w-[220px]">
                      <p className="font-medium text-gray-900 truncate">{bet.question}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(bet.createdAt).toLocaleDateString('es-ES')}
                        {bet.prediction && (
                          <span className="ml-2 text-blue-500">
                            IA {(bet.prediction.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="py-3 pr-4 font-medium text-blue-700">{bet.outcome}</td>
                    <td className="py-3 pr-4 text-right font-mono">${bet.amount.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-green-600">
                      ${bet.potentialWin.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        bet.mode === 'real'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {bet.mode === 'real' ? '💰 Real' : '📄 Prueba'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGES[bet.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[bet.status] ?? bet.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {bet.status === 'open' && (
                        <button
                          onClick={() => cancelBet(bet.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Predictions list */}
      {tab === 'predictions' && (
        <div>
          {!data?.recentPredictions?.length ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🤖</p>
              <p>No hay predicciones todavía.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.recentPredictions.map(p => (
                <PredictionCard key={p.id} prediction={p} mode={data.stats.mode as 'paper' | 'real'} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
