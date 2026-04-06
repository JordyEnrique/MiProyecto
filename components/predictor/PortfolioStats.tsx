'use client'

interface Stats {
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
  // AI cost fields
  totalPredictions: number
  aiCostPerPrediction: number
  totalAiCost: number
  netPnlReal: number
  roiReal: number
}

interface PortfolioStatsProps {
  stats: Stats
  onSync?: () => void
  syncing?: boolean
}

function StatBox({
  label, value, sub, color,
}: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color ?? 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function PortfolioStats({ stats, onSync, syncing }: PortfolioStatsProps) {
  const pnlRealColor = stats.netPnlReal >= 0 ? 'text-green-600' : 'text-red-500'
  const roiRealColor = stats.roiReal   >= 0 ? 'text-green-600' : 'text-red-500'
  const roiBetsColor = stats.roiBets   >= 0 ? 'text-green-600' : 'text-red-500'
  const modeLabel    = stats.mode === 'real' ? '💰 Dinero Real' : '📄 Modo Prueba'
  const modeBg       = stats.mode === 'real' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'

  return (
    <div className="space-y-4">
      {/* Mode banner */}
      <div className={`rounded-xl border p-4 flex items-center justify-between ${modeBg}`}>
        <div>
          <span className="text-sm font-semibold text-gray-700">{modeLabel}</span>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">
            ${stats.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USDC
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Balance disponible</p>
        </div>
        {onSync && (
          <button
            onClick={onSync}
            disabled={syncing}
            className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
          >
            {syncing ? '⏳ Sincronizando…' : '🔄 Sincronizar'}
          </button>
        )}
      </div>

      {/* Main PnL — real bottom line */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox
          label="PnL Real (con IA)"
          value={`${stats.netPnlReal >= 0 ? '+' : ''}$${stats.netPnlReal.toFixed(2)}`}
          sub="apuestas − costo IA"
          color={pnlRealColor}
        />
        <StatBox
          label="ROI Real"
          value={`${stats.roiReal >= 0 ? '+' : ''}${stats.roiReal.toFixed(1)}%`}
          sub="sobre total invertido"
          color={roiRealColor}
        />
        <StatBox
          label="Tasa de aciertos"
          value={`${stats.winRate.toFixed(1)}%`}
          sub={`${stats.wonBets}W / ${stats.lostBets}L`}
          color={stats.winRate >= 55 ? 'text-green-600' : 'text-gray-700'}
        />
        <StatBox
          label="Exposición abierta"
          value={`$${stats.openExposure.toFixed(2)}`}
          sub={`${stats.openBets} apuesta(s) abierta(s)`}
        />
      </div>

      {/* AI cost breakdown */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-purple-700 mb-2">💸 Desglose costo IA (Claude)</p>
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="Predicciones generadas"
            value={String(stats.totalPredictions)}
            sub={`× $${stats.aiCostPerPrediction.toFixed(2)} c/u`}
          />
          <StatBox
            label="Gasto total en IA"
            value={`$${stats.totalAiCost.toFixed(2)}`}
            sub="costo acumulado"
            color="text-purple-700"
          />
          <StatBox
            label="ROI solo apuestas"
            value={`${stats.roiBets >= 0 ? '+' : ''}${stats.roiBets.toFixed(1)}%`}
            sub="sin descontar IA"
            color={roiBetsColor}
          />
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Total apostado" value={`$${stats.totalWagered.toFixed(2)}`} sub={`${stats.totalBets} apuestas`} />
        <StatBox label="Total ganado"   value={`$${stats.totalWon.toFixed(2)}`}     color="text-green-600" />
        <StatBox label="Total perdido"  value={`$${stats.totalLost.toFixed(2)}`}    color="text-red-500" />
      </div>
    </div>
  )
}
