/**
 * Polymarket API Client
 *
 * Uses the public Gamma API for market data (no auth required).
 * Uses the CLOB API for real-money order placement (requires credentials).
 *
 * Docs: https://docs.polymarket.com
 */

const GAMMA_BASE = 'https://gamma-api.polymarket.com'
const CLOB_BASE = 'https://clob.polymarket.com'

export interface PolyMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  startDate: string
  endDate: string
  description: string
  outcomes: string[]           // e.g. ["Yes", "No"]
  outcomePrices: string[]      // e.g. ["0.65", "0.35"] — implied probability
  volume: string               // total USDC traded
  liquidity: string            // current liquidity
  active: boolean
  closed: boolean
  category: string
  tags?: string[]
  image?: string
  icon?: string
}

export interface PolyMarketFilters {
  active?: boolean
  closed?: boolean
  limit?: number
  offset?: number
  /** Free-text search on the question */
  query?: string
  /** 'crypto' | 'sports' | 'politics' | 'all' */
  category?: string
}

/** Map our category labels to Polymarket tag strings */
const CATEGORY_TAGS: Record<string, string[]> = {
  crypto: ['Crypto', 'cryptocurrency', 'Bitcoin', 'Ethereum', 'DeFi'],
  sports:  ['Sports', 'Football', 'Soccer', 'NBA', 'NFL', 'Tennis', 'MMA'],
  politics: ['Politics', 'Election', 'Government'],
}

/**
 * Fetch active markets from the Polymarket Gamma API.
 */
export async function fetchMarkets(filters: PolyMarketFilters = {}): Promise<PolyMarket[]> {
  const { active = true, closed = false, limit = 50, offset = 0, query, category } = filters

  const params = new URLSearchParams({
    active: String(active),
    closed: String(closed),
    limit: String(limit),
    offset: String(offset),
    order: 'volume',
    ascending: 'false',
  })

  const url = `${GAMMA_BASE}/markets?${params.toString()}`

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 60 }, // Cache for 60s in Next.js
  })

  if (!res.ok) {
    throw new Error(`Polymarket Gamma API error: ${res.status} ${res.statusText}`)
  }

  let markets: PolyMarket[] = await res.json()

  // Parse outcomes from JSON string if needed
  markets = markets.map(m => ({
    ...m,
    outcomes: typeof m.outcomes === 'string' ? JSON.parse(m.outcomes) : m.outcomes,
    outcomePrices: typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices,
  }))

  // Client-side text filter
  if (query) {
    const q = query.toLowerCase()
    markets = markets.filter(m => m.question.toLowerCase().includes(q))
  }

  // Client-side category filter
  if (category && category !== 'all') {
    const tags = CATEGORY_TAGS[category] ?? []
    markets = markets.filter(m => {
      const haystack = (m.question + ' ' + m.category + ' ' + (m.tags?.join(' ') ?? '')).toLowerCase()
      return tags.some(t => haystack.includes(t.toLowerCase()))
    })
  }

  return markets
}

/**
 * Fetch a single market by slug.
 */
export async function fetchMarketBySlug(slug: string): Promise<PolyMarket | null> {
  const res = await fetch(`${GAMMA_BASE}/markets?slug=${encodeURIComponent(slug)}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 30 },
  })
  if (!res.ok) return null
  const data = await res.json()
  const market = Array.isArray(data) ? data[0] : data
  if (!market) return null
  return {
    ...market,
    outcomes: typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : market.outcomes,
    outcomePrices: typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices,
  }
}

/**
 * Fetch a single market by ID.
 */
export async function fetchMarketById(id: string): Promise<PolyMarket | null> {
  const res = await fetch(`${GAMMA_BASE}/markets/${encodeURIComponent(id)}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 30 },
  })
  if (!res.ok) return null
  const market = await res.json()
  return {
    ...market,
    outcomes: typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : market.outcomes,
    outcomePrices: typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : market.outcomePrices,
  }
}

// ---------------------------------------------------------------------------
// CLOB API — Real Money Trading
// ---------------------------------------------------------------------------

export interface ClobCredentials {
  apiKey: string
  apiSecret: string
  passphrase: string
  address: string
}

interface ClobOrderParams {
  tokenId: string      // Polymarket token ID for the outcome
  price: number        // limit price (0–1)
  size: number         // USDC amount
  side: 'BUY' | 'SELL'
}

/**
 * Place a real order on Polymarket via the CLOB API.
 * Requires valid L2 credentials from the user's Polymarket account.
 *
 * NOTE: For production use, order signing (L1 auth with wallet private key)
 * is required. This implementation uses L2 API-key authentication which
 * allows read access and order submission with a pre-approved API key.
 */
export async function placeClobOrder(
  credentials: ClobCredentials,
  params: ClobOrderParams
): Promise<{ orderId: string; status: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const method = 'POST'
  const path = '/order'
  const body = JSON.stringify({
    orderType: 'FOK',   // Fill-or-Kill for market-like execution
    tokenId: params.tokenId,
    price: params.price.toFixed(4),
    size: params.size.toFixed(2),
    side: params.side,
    feeRateBps: '0',
    nonce: timestamp,
  })

  // L2 HMAC signature
  const msgToSign = timestamp + method + path + body
  const encoder = new TextEncoder()
  const keyData = encoder.encode(credentials.apiSecret)
  const msgData = encoder.encode(msgToSign)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const signature = Buffer.from(sigBuffer).toString('base64')

  const res = await fetch(`${CLOB_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'POLY_ADDRESS': credentials.address,
      'POLY_API_KEY': credentials.apiKey,
      'POLY_PASSPHRASE': credentials.passphrase,
      'POLY_SIGNATURE': signature,
      'POLY_TIMESTAMP': timestamp,
    },
    body,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`CLOB API error ${res.status}: ${err}`)
  }

  return res.json()
}

/**
 * Get current CLOB order book for a market token.
 */
export async function getOrderBook(tokenId: string) {
  const res = await fetch(`${CLOB_BASE}/book?token_id=${encodeURIComponent(tokenId)}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 10 },
  })
  if (!res.ok) return null
  return res.json()
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert outcomePrices array to a readable odds object.
 * e.g. outcomes=["Yes","No"], prices=["0.65","0.35"] → { Yes: 0.65, No: 0.35 }
 */
export function buildOddsMap(market: PolyMarket): Record<string, number> {
  const map: Record<string, number> = {}
  market.outcomes.forEach((outcome, i) => {
    map[outcome] = parseFloat(market.outcomePrices[i] ?? '0')
  })
  return map
}

/**
 * Estimate potential winnings for a bet.
 * price is the implied probability (0–1). Polymarket pays $1 per share.
 * shares = amount / price  → payout = shares * 1 = amount / price
 */
export function estimatePayout(amount: number, price: number): number {
  if (price <= 0) return 0
  return amount / price
}
