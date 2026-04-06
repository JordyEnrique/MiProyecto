'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MarketCard from '@/components/predictor/MarketCard'
import PredictionCard from '@/components/predictor/PredictionCard'
import PortfolioStats from '@/components/predictor/PortfolioStats'
import BetModal from '@/components/predictor/BetModal'
import type { PolyMarket } from '@/lib/polymarket'

const CATEGORIES = [
  { id: 'all',      label: '🌐 Todos' },
  { id: 'crypto',   label: '🪙 Crypto' },
  { id: 'sports',   label: '⚽ Deportes' },
  { id: 'politics', label: '🏛️ Política' },
]

export default function PredictorPage() {
  const [category, setCategory]       = useState('all')
  const [query, setQuery]             = useState('')
  const [markets, setMarkets]         = useState<PolyMarket[]>([])
  const [loadingMarkets, setLoadingMarkets] = useState(false)
  const [predictingId, setPredictingId]     = useState<string | null>(null)

  const [portfolio, setPortfolio]     = useState<null | { stats: unknown; recentPredictions: unknown[] }>(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [syncing, setSyncing]         = useState(false)

  const [settings, setSettings]       = useState<{ mode: string; paperBalance: number } | null>(null)

  const [betModal, setBetModal]       = useState<{
    market: PolyMarket; outcome?: string
  } | null>(null)

  const [demoMode, setDemoMode]           = useState(false)
  const [notifications, setNotifications] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([])

  // Load settings and demo mode status
  useEffect(() => {
    fetch('/api/predictor/settings')
      .then(r => r.json())
      .then(data => setSettings(data))
      .catch(() => null)
    fetch('/api/predictor/status')
      .then(r => r.json())
      .then(data => setDemoMode(data.demoMode ?? false))
      .catch(() => null)
  }, [])

  // Load markets
  const loadMarkets = useCallback(async () => {
    setLoadingMarkets(true)
    try {
      const params = new URLSearchParams({ category, limit: '20' })
      if (query) params.set('q', query)
      const res = await fetch(`/api/predictor/markets?${params}`)
      const data = await res.json()
      setMarkets(data.markets ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMarkets(false)
    }
  }, [category, query])

  useEffect(() => {
    loadMarkets()
  }, [loadMarkets])

  // Load portfolio
  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true)
    try {
      const res = await fetch('/api/predictor/portfolio')
      const data = await res.json()
      setPortfolio(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPortfolio(false)
    }
  }, [])

  useEffect(() => {
    loadPortfolio()
  }, [loadPortfolio])

  function notify(msg: string, type: 'success' | 'error' = 'success') {
    const id = Date.now()
    setNotifications(n => [...n, { id, msg, type }])
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 5000)
  }

  // Generate AI prediction
  async function handlePredict(market: PolyMarket) {
    setPredictingId(market.id)
    try {
      const res  = await fetch('/api/predictor/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketId: market.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al predecir')

      const demoTag = demoMode ? ' [DEMO]' : ''
      notify(data.message ?? `✅ Predicción generada${demoTag}: ${data.result?.prediction} (${((data.result?.confidence ?? 0) * 100).toFixed(0)}% confianza)`)
      loadPortfolio()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Error al generar predicción', 'error')
    } finally {
      setPredictingId(null)
    }
  }

  // Place bet
  async function handleBet(outcome: string, amount: number) {
    if (!betModal) return
    const res = await fetch('/api/predictor/bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketId: betModal.market.id, outcome, amount }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Error al apostar')

    notify(data.message ?? '✅ Apuesta colocada')
    setBetModal(null)
    loadPortfolio()
    if (settings) {
      setSettings(s => s ? { ...s, paperBalance: s.paperBalance - amount } : s)
    }
  }

  // Sync bets
  async function handleSync() {
    setSyncing(true)
    try {
      const res  = await fetch('/api/predictor/sync', { method: 'POST' })
      const data = await res.json()
      notify(data.message ?? 'Sincronización completada')
      loadPortfolio()
    } catch {
      notify('Error al sincronizar', 'error')
    } finally {
      setSyncing(false)
    }
  }

  const stats  = (portfolio as { stats?: unknown })?.stats
  const preds  = (portfolio as { recentPredictions?: unknown[] })?.recentPredictions ?? []

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg text-white ${
              n.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {n.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Predictor IA</h1>
          <p className="text-gray-500 mt-1">
            Predicciones automáticas para mercados de Polymarket · Crypto · Deportes
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/predictor/portfolio" className="btn-secondary text-sm py-2">
            📊 Portfolio
          </Link>
          <Link href="/predictor/settings" className="btn-secondary text-sm py-2">
            ⚙️ Ajustes
          </Link>
          {settings && (
            <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border ${
              settings.mode === 'real'
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-blue-50 border-blue-300 text-blue-700'
            }`}>
              {settings.mode === 'real' ? '💰 Dinero Real' : '📄 Modo Prueba'}
            </span>
          )}
        </div>
      </div>

      {/* Demo mode banner */}
      {demoMode && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-amber-800">🧪 Modo Demo activo</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Las predicciones son <strong>simuladas</strong> — puedes explorar toda la herramienta sin gastar créditos.
              Cuando quieras predicciones reales con Claude IA, agrega tu <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> en el archivo <code className="bg-amber-100 px-1 rounded">.env</code>.
            </p>
          </div>
          <Link
            href="/predictor/settings"
            className="shrink-0 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ⚙️ Configurar IA
          </Link>
        </div>
      )}

      {/* Portfolio summary */}
      {stats && !loadingPortfolio && (
        <div className="mb-8">
          <PortfolioStats
            stats={stats as Parameters<typeof PortfolioStats>[0]['stats']}
            onSync={handleSync}
            syncing={syncing}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Markets panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mercados activos</h2>
            <button
              onClick={loadMarkets}
              disabled={loadingMarkets}
              className="btn-secondary text-sm py-1.5 px-3"
            >
              {loadingMarkets ? '⏳' : '🔄 Actualizar'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  category === cat.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar mercado…"
              className="input-field pl-9"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {/* Market list */}
          {loadingMarkets ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
            </div>
          ) : markets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No se encontraron mercados para este filtro.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {markets.map(market => (
                <MarketCard
                  key={market.id}
                  market={market}
                  onPredict={handlePredict}
                  onBet={(m, outcome) => setBetModal({ market: m, outcome })}
                  loading={predictingId === market.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Predictions sidebar */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Predicciones recientes</h2>
          {preds.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🤖</p>
              <p className="text-sm">Haz clic en <strong>&ldquo;Predecir con IA&rdquo;</strong> en cualquier mercado para ver predicciones aquí.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">
              {(preds as Parameters<typeof PredictionCard>[0]['prediction'][]).map((p) => (
                <PredictionCard
                  key={p.id}
                  prediction={p}
                  mode={(settings?.mode as 'paper' | 'real') ?? 'paper'}
                  onBet={(predId, outcome, amount) =>
                    fetch('/api/predictor/bet', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        marketId: p.marketId ?? '',
                        outcome,
                        amount,
                        predictionId: predId,
                      }),
                    })
                      .then(r => r.json())
                      .then(d => {
                        if (d.error) throw new Error(d.error)
                        notify(d.message ?? '✅ Apuesta colocada')
                        loadPortfolio()
                      })
                      .catch(e => notify(e.message, 'error'))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bet modal */}
      {betModal && settings && (
        <BetModal
          market={betModal.market}
          initialOutcome={betModal.outcome}
          balance={settings.paperBalance}
          mode={(settings.mode as 'paper' | 'real')}
          onConfirm={handleBet}
          onClose={() => setBetModal(null)}
        />
      )}
    </main>
  )
}
