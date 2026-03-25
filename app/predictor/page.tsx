'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MarketData } from '@/app/api/predictor/route'
import MarketCard from '@/components/predictor/MarketCard'

// ─── Tipos de filtro ──────────────────────────────────────────────────────────

type SignalFilter = 'all' | 'BUY' | 'SELL' | 'HOLD'
type SortMode = 'volume' | 'confidence' | 'rsi'

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PredictorPage() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'polymarket' | 'fallback'>('polymarket')
  const [error, setError] = useState('')
  const [signalFilter, setSignalFilter] = useState<SignalFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('volume')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMarkets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/predictor')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setMarkets(data.markets ?? [])
      setSource(data.source)
      setLastUpdate(new Date())
    } catch (e: any) {
      setError(e.message ?? 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarkets()
    // Auto-refresh cada 2 minutos
    const interval = setInterval(fetchMarkets, 120_000)
    return () => clearInterval(interval)
  }, [fetchMarkets])

  // ─── Filtrado y ordenamiento ─────────────────────────────────────────────

  const filtered = markets
    .filter(m => signalFilter === 'all' || m.signal.direction === signalFilter)
    .sort((a, b) => {
      if (sortMode === 'volume') return (b.volume ?? 0) - (a.volume ?? 0)
      if (sortMode === 'confidence') return b.signal.confidence - a.signal.confidence
      if (sortMode === 'rsi') return Math.abs(b.signal.rsi - 50) - Math.abs(a.signal.rsi - 50)
      return 0
    })

  // ─── Estadísticas globales ───────────────────────────────────────────────

  const buyCount  = markets.filter(m => m.signal.direction === 'BUY').length
  const sellCount = markets.filter(m => m.signal.direction === 'SELL').length
  const holdCount = markets.filter(m => m.signal.direction === 'HOLD').length
  const avgConf   = markets.length
    ? Math.round(markets.reduce((s, m) => s + m.signal.confidence, 0) / markets.length)
    : 0
  const marketSentiment = buyCount > sellCount ? 'ALCISTA' : buyCount < sellCount ? 'BAJISTA' : 'NEUTRAL'
  const sentimentColor  = buyCount > sellCount ? 'text-green-400' : buyCount < sellCount ? 'text-red-400' : 'text-yellow-400'

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar superior */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-black font-black text-sm">
              P
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide">PREDICTOR DE APUESTAS</h1>
              <p className="text-xs text-gray-400">Análisis técnico · Polymarket · Tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {source === 'polymarket' && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Polymarket Live
              </span>
            )}
            {source === 'fallback' && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-full">
                Demo
              </span>
            )}
            <button
              onClick={fetchMarkets}
              disabled={loading}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? '...' : '↻ Actualizar'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ─── Panel de estadísticas globales ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Sentimiento"
            value={marketSentiment}
            valueClass={sentimentColor}
            sub={`${markets.length} mercados`}
          />
          <StatCard
            label="Señales COMPRAR"
            value={String(buyCount)}
            valueClass="text-green-400"
            sub={`${markets.length ? Math.round(buyCount / markets.length * 100) : 0}% del total`}
          />
          <StatCard
            label="Señales VENDER"
            value={String(sellCount)}
            valueClass="text-red-400"
            sub={`${markets.length ? Math.round(sellCount / markets.length * 100) : 0}% del total`}
          />
          <StatCard
            label="Confianza media"
            value={`${avgConf}%`}
            valueClass="text-blue-400"
            sub="todos los mercados"
          />
        </div>

        {/* ─── Filtros y ordenamiento ─── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {/* Filtro señal */}
          <div className="flex gap-1 bg-gray-800/60 rounded-xl p-1">
            {(['all', 'BUY', 'SELL', 'HOLD'] as SignalFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setSignalFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  signalFilter === f
                    ? 'bg-gray-700 text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'BUY' ? 'Comprar' : f === 'SELL' ? 'Vender' : 'Esperar'}
              </button>
            ))}
          </div>

          {/* Ordenamiento */}
          <div className="flex gap-1 bg-gray-800/60 rounded-xl p-1">
            {([['volume', 'Por volumen'], ['confidence', 'Por confianza'], ['rsi', 'Por RSI']] as [SortMode, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortMode(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sortMode === key
                    ? 'bg-gray-700 text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {lastUpdate && (
            <span className="ml-auto text-xs text-gray-500 self-center">
              Actualizado {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* ─── Error ─── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-5 text-sm">
            Error al cargar mercados: {error}
          </div>
        )}

        {/* ─── Loading skeleton ─── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700/60 rounded-2xl p-4 animate-pulse">
                <div className="h-3 bg-gray-700 rounded w-20 mb-3" />
                <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-16 bg-gray-800 rounded-xl mb-3" />
                <div className="h-2 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* ─── Grid de mercados ─── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm">No hay mercados con el filtro seleccionado.</p>
          </div>
        )}

        {/* ─── Disclaimer ─── */}
        <div className="mt-10 p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-400">Aviso legal:</strong> Esta herramienta es solo educativa e informativa. Las señales se generan mediante algoritmos de análisis técnico (RSI, SMA, momentum) y <strong>no constituyen asesoramiento financiero</strong>. Las apuestas y mercados de predicción conllevan riesgo de pérdida de capital. Opera con responsabilidad.
        </div>
      </div>
    </div>
  )
}

// ─── Subcomponente StatCard ────────────────────────────────────────────────────

function StatCard({ label, value, valueClass, sub }: { label: string; value: string; valueClass: string; sub: string }) {
  return (
    <div className="bg-gray-900 border border-gray-700/60 rounded-xl p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl font-black ${valueClass}`}>{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
    </div>
  )
}
