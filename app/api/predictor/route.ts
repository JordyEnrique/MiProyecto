import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MarketOutcome {
  name: string
  price: number          // 0–1 (probabilidad actual)
  priceHistory: number[] // últimos N puntos de precio
}

export interface PredictionSignal {
  direction: 'BUY' | 'SELL' | 'HOLD'
  confidence: number     // 0–100
  rsi: number
  momentum: number
  trend: 'UP' | 'DOWN' | 'SIDEWAYS'
  sma7: number
  sma14: number
}

export interface MarketData {
  id: string
  question: string
  category: string
  volume: number
  liquidity: number
  endDate: string
  outcomes: MarketOutcome[]
  signal: PredictionSignal
}

// ─── Análisis técnico ─────────────────────────────────────────────────────────

function calcSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] ?? 0
  const slice = prices.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / period
}

function calcRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50

  let gains = 0
  let losses = 0

  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff > 0) gains += diff
    else losses += Math.abs(diff)
  }

  const avgGain = gains / period
  const avgLoss = losses / period

  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function calcMomentum(prices: number[], period = 5): number {
  if (prices.length < period + 1) return 0
  const current = prices[prices.length - 1]
  const past = prices[prices.length - 1 - period]
  return ((current - past) / past) * 100
}

function generateSignal(prices: number[]): PredictionSignal {
  const rsi = calcRSI(prices)
  const momentum = calcMomentum(prices)
  const sma7 = calcSMA(prices, 7)
  const sma14 = calcSMA(prices, 14)
  const current = prices[prices.length - 1] ?? 0.5

  // Trend via SMA crossover
  const trend: 'UP' | 'DOWN' | 'SIDEWAYS' =
    sma7 > sma14 + 0.01 ? 'UP' :
    sma7 < sma14 - 0.01 ? 'DOWN' : 'SIDEWAYS'

  // Score compuesto
  let score = 0

  // RSI: sobrevendido (<30) → compra; sobrecomprado (>70) → venta
  if (rsi < 30) score += 30
  else if (rsi > 70) score -= 30
  else if (rsi < 45) score += 10
  else if (rsi > 55) score -= 10

  // Momentum positivo
  if (momentum > 5) score += 25
  else if (momentum > 2) score += 12
  else if (momentum < -5) score -= 25
  else if (momentum < -2) score -= 12

  // Tendencia SMA
  if (trend === 'UP') score += 20
  else if (trend === 'DOWN') score -= 20

  // Precio vs SMA7
  if (current > sma7) score += 15
  else if (current < sma7) score -= 15

  // Dirección y confianza
  let direction: 'BUY' | 'SELL' | 'HOLD'
  let confidence: number

  if (score >= 25) {
    direction = 'BUY'
    confidence = Math.min(95, 50 + score)
  } else if (score <= -25) {
    direction = 'SELL'
    confidence = Math.min(95, 50 + Math.abs(score))
  } else {
    direction = 'HOLD'
    confidence = Math.max(30, 50 - Math.abs(score))
  }

  return { direction, confidence: Math.round(confidence), rsi: Math.round(rsi), momentum: parseFloat(momentum.toFixed(2)), trend, sma7: parseFloat(sma7.toFixed(4)), sma14: parseFloat(sma14.toFixed(4)) }
}

// ─── Generador de historial sintético realista ─────────────────────────────────

function syntheticHistory(startPrice: number, points = 30): number[] {
  const prices: number[] = [startPrice]
  for (let i = 1; i < points; i++) {
    const prev = prices[i - 1]
    const drift = (Math.random() - 0.48) * 0.04  // ligera tendencia positiva
    const noise = (Math.random() - 0.5) * 0.02
    const next = Math.min(0.99, Math.max(0.01, prev + drift + noise))
    prices.push(parseFloat(next.toFixed(4)))
  }
  return prices
}

// ─── Fetch Polymarket (Gamma API) ─────────────────────────────────────────────

async function fetchPolymarketMarkets(): Promise<MarketData[]> {
  const url = 'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=20&order=volume&ascending=false'

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 120 },
  })

  if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`)

  const raw: any[] = await res.json()

  return raw.slice(0, 12).map((m: any) => {
    // Convertir outcomes de Polymarket
    const outcomes: MarketOutcome[] = (m.outcomes ?? ['Sí', 'No']).map((name: string, i: number) => {
      const rawPrices: string[] = m.outcomePrices ?? []
      const price = parseFloat(rawPrices[i] ?? '0.5')
      const history = syntheticHistory(price)
      return { name, price: parseFloat(price.toFixed(4)), priceHistory: history }
    })

    // Signal basada en el primer outcome (YES)
    const yesHistory = outcomes[0]?.priceHistory ?? [0.5]
    const signal = generateSignal(yesHistory)

    return {
      id: m.id ?? String(i),
      question: m.question ?? 'Mercado sin título',
      category: m.category ?? 'General',
      volume: m.volume ?? 0,
      liquidity: m.liquidity ?? 0,
      endDate: m.endDate ?? m.endDateIso ?? '',
      outcomes,
      signal,
    }
  })
}

// ─── Mercados de respaldo (si la API falla) ────────────────────────────────────

function fallbackMarkets(): MarketData[] {
  const markets = [
    { q: '¿Ganará el equipo local el próximo partido?', cat: 'Deportes', price: 0.62 },
    { q: '¿Bitcoin superará los $100k antes de junio 2025?', cat: 'Crypto', price: 0.41 },
    { q: '¿Habrá recesión en EE.UU. en 2025?', cat: 'Economía', price: 0.29 },
    { q: '¿Ganará el partido opositor las elecciones?', cat: 'Política', price: 0.55 },
    { q: '¿Ethereum superará los $5k este año?', cat: 'Crypto', price: 0.38 },
    { q: '¿La inflación bajará al 3% antes de diciembre?', cat: 'Economía', price: 0.47 },
  ]

  return markets.map((m, idx) => {
    const history = syntheticHistory(m.price)
    const signal = generateSignal(history)
    return {
      id: `fallback-${idx}`,
      question: m.q,
      category: m.cat,
      volume: Math.round(Math.random() * 500000 + 10000),
      liquidity: Math.round(Math.random() * 100000 + 5000),
      endDate: new Date(Date.now() + (30 + idx * 15) * 86400000).toISOString(),
      outcomes: [
        { name: 'Sí', price: parseFloat(m.price.toFixed(4)), priceHistory: history },
        { name: 'No', price: parseFloat((1 - m.price).toFixed(4)), priceHistory: syntheticHistory(1 - m.price) },
      ],
      signal,
    }
  })
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? 'all'

  try {
    let markets = await fetchPolymarketMarkets()

    if (category !== 'all') {
      markets = markets.filter(m =>
        m.category.toLowerCase().includes(category.toLowerCase())
      )
    }

    return NextResponse.json({ markets, source: 'polymarket', ts: Date.now() })
  } catch (err) {
    console.error('Polymarket fetch failed, using fallback:', err)
    const markets = fallbackMarkets()
    return NextResponse.json({ markets, source: 'fallback', ts: Date.now() })
  }
}
