export const INITIAL_BALANCE = 1000

export interface VirtualPosition {
  id: string; marketId: string; question: string; outcome: string
  shares: number; entryPrice: number; cost: number; currentPrice: number
  unrealizedPnl: number; unrealizedPnlPct: number; signal: 'BUY' | 'SELL' | 'HOLD'; openedAt: string
}

export interface CompletedTrade {
  id: string; marketId: string; question: string; outcome: string
  shares: number; entryPrice: number; exitPrice: number; cost: number
  proceeds: number; pnl: number; pnlPct: number; signal: 'BUY' | 'SELL' | 'HOLD'
  openedAt: string; closedAt: string
}

export interface SimulatorState {
  balance: number; totalDeposited: number
  positions: VirtualPosition[]; trades: CompletedTrade[]
  createdAt: string; updatedAt: string
}

const STORAGE_KEY = 'betting_simulator_v1'

function defaultState(): SimulatorState {
  return { balance: INITIAL_BALANCE, totalDeposited: INITIAL_BALANCE, positions: [], trades: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
}

export function loadState(): SimulatorState {
  if (typeof window === 'undefined') return defaultState()
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : defaultState() } catch { return defaultState() }
}

export function saveState(state: SimulatorState): void {
  if (typeof window === 'undefined') return
  state.updatedAt = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): SimulatorState {
  const fresh = defaultState()
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  return fresh
}

export interface BuyParams { marketId: string; question: string; outcome: string; currentPrice: number; amount: number; signal: 'BUY' | 'SELL' | 'HOLD' }

export function buyPosition(state: SimulatorState, params: BuyParams): { state: SimulatorState; error?: string } {
  if (params.amount <= 0) return { state, error: 'El monto debe ser mayor a 0' }
  if (params.amount > state.balance) return { state, error: 'Saldo insuficiente' }
  if (params.currentPrice <= 0 || params.currentPrice >= 1) return { state, error: 'Precio inválido' }
  const shares = params.amount / params.currentPrice
  const existing = state.positions.find(p => p.marketId === params.marketId && p.outcome === params.outcome)
  let newPositions: VirtualPosition[]
  if (existing) {
    const totalShares = existing.shares + shares
    const totalCost = existing.cost + params.amount
    const avgPrice = totalCost / totalShares
    newPositions = state.positions.map(p => p.id === existing.id ? { ...p, shares: totalShares, cost: totalCost, entryPrice: avgPrice, currentPrice: params.currentPrice, unrealizedPnl: totalShares * (params.currentPrice - avgPrice), unrealizedPnlPct: ((params.currentPrice - avgPrice) / avgPrice) * 100 } : p)
  } else {
    newPositions = [...state.positions, { id: `pos-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, marketId: params.marketId, question: params.question, outcome: params.outcome, shares, entryPrice: params.currentPrice, cost: params.amount, currentPrice: params.currentPrice, unrealizedPnl: 0, unrealizedPnlPct: 0, signal: params.signal, openedAt: new Date().toISOString() }]
  }
  const newState = { ...state, balance: parseFloat((state.balance - params.amount).toFixed(4)), positions: newPositions, updatedAt: new Date().toISOString() }
  saveState(newState)
  return { state: newState }
}

export function closePosition(state: SimulatorState, positionId: string, currentPrice: number): { state: SimulatorState; error?: string } {
  const position = state.positions.find(p => p.id === positionId)
  if (!position) return { state, error: 'Posición no encontrada' }
  const proceeds = position.shares * currentPrice
  const pnl = proceeds - position.cost
  const pnlPct = ((currentPrice - position.entryPrice) / position.entryPrice) * 100
  const trade: CompletedTrade = { id: `trade-${Date.now()}`, marketId: position.marketId, question: position.question, outcome: position.outcome, shares: position.shares, entryPrice: position.entryPrice, exitPrice: currentPrice, cost: position.cost, proceeds: parseFloat(proceeds.toFixed(4)), pnl: parseFloat(pnl.toFixed(4)), pnlPct: parseFloat(pnlPct.toFixed(2)), signal: position.signal, openedAt: position.openedAt, closedAt: new Date().toISOString() }
  const newState = { ...state, balance: parseFloat((state.balance + proceeds).toFixed(4)), positions: state.positions.filter(p => p.id !== positionId), trades: [trade, ...state.trades], updatedAt: new Date().toISOString() }
  saveState(newState)
  return { state: newState }
}

export function calcMetrics(state: SimulatorState) {
  const unrealizedPnl = state.positions.reduce((s, p) => s + p.unrealizedPnl, 0)
  const realizedPnl = state.trades.reduce((s, t) => s + t.pnl, 0)
  const portfolioValue = state.balance + state.positions.reduce((s, p) => s + p.cost + p.unrealizedPnl, 0)
  const roi = ((portfolioValue - state.totalDeposited) / state.totalDeposited) * 100
  const winTrades = state.trades.filter(t => t.pnl > 0)
  const lossTrades = state.trades.filter(t => t.pnl <= 0)
  return {
    unrealizedPnl: parseFloat(unrealizedPnl.toFixed(2)),
    realizedPnl: parseFloat(realizedPnl.toFixed(2)),
    totalPnl: parseFloat((unrealizedPnl + realizedPnl).toFixed(2)),
    portfolioValue: parseFloat(portfolioValue.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
    winRate: state.trades.length > 0 ? parseFloat(((winTrades.length / state.trades.length) * 100).toFixed(1)) : 0,
    avgWin: winTrades.length > 0 ? parseFloat((winTrades.reduce((s, t) => s + t.pnl, 0) / winTrades.length).toFixed(2)) : 0,
    avgLoss: lossTrades.length > 0 ? parseFloat((lossTrades.reduce((s, t) => s + t.pnl, 0) / lossTrades.length).toFixed(2)) : 0,
    totalTrades: state.trades.length,
    openPositions: state.positions.length,
  }
}
