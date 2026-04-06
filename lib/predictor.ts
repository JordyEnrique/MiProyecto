/**
 * AI Prediction Engine
 *
 * Uses Claude claude-opus-4-6 with adaptive thinking to analyze Polymarket
 * prediction markets and generate high-confidence betting recommendations.
 *
 * Falls back to demo mode (mock predictions) when ANTHROPIC_API_KEY is not set.
 */

import Anthropic from '@anthropic-ai/sdk'
import { PolyMarket, buildOddsMap } from './polymarket'

const API_KEY = process.env.ANTHROPIC_API_KEY

/** Returns true when no real API key is configured */
export function isDemoMode(): boolean {
  return !API_KEY || API_KEY.startsWith('sk-ant-api03-PEGA') || API_KEY.trim() === ''
}

const client = isDemoMode()
  ? null
  : new Anthropic({ apiKey: API_KEY })

export interface PredictionResult {
  prediction: string       // the predicted winning outcome
  confidence: number       // 0.0 – 1.0
  reasoning: string        // full analysis
  suggestedBetSize: number // % of balance to wager (Kelly-inspired)
  oddsAtPrediction: Record<string, number>
  edge: number             // estimated edge over market (our prob - market prob)
}

// ---------------------------------------------------------------------------
// Demo / mock prediction (no API key required)
// ---------------------------------------------------------------------------

const DEMO_REASONINGS = [
  (q: string, outcome: string, pct: number) =>
    `[MODO DEMO — predicción simulada]\n\nMercado analizado: "${q}"\n\nBasándonos en las probabilidades actuales del mercado, el outcome "${outcome}" cotiza al ${pct.toFixed(1)}%. Un análisis preliminar sugiere que el mercado podría estar subestimando ligeramente esta opción.\n\nFactores considerados:\n• Tendencia histórica de mercados similares\n• Volumen y liquidez actuales\n• Sesgo típico de los participantes en este tipo de eventos\n\nEsta es una predicción de DEMOSTRACIÓN. Activa tu clave de Anthropic en Ajustes para obtener análisis reales con Claude Opus 4.6 y pensamiento adaptativo.`,
  (q: string, outcome: string, pct: number) =>
    `[MODO DEMO — predicción simulada]\n\nPregunta: "${q}"\n\nEl mercado asigna ${pct.toFixed(1)}% de probabilidad a "${outcome}". Nuestro modelo de demo detecta un posible edge positivo del ~3-5% basado en patrones estadísticos básicos.\n\nNota: Este análisis es completamente simulado para que puedas explorar la interfaz antes de activar la IA real. Con Claude Opus 4.6 el análisis incluye razonamiento profundo sobre contexto actual, noticias y tendencias del mercado.`,
]

function mockPrediction(
  market: PolyMarket,
  balance: number,
  maxBetPct: number,
): PredictionResult {
  const odds = buildOddsMap(market)

  // Pick the outcome closest to 50% (most interesting to bet on)
  const entries = Object.entries(odds)
  const sorted  = entries.sort((a, b) => Math.abs(a[1] - 0.5) - Math.abs(b[1] - 0.5))
  const [prediction, marketPrice] = sorted[0]

  // Simulate a small edge: our "estimated" probability is market + 4%
  const edge        = 0.04
  const confidence  = Math.min(0.82, marketPrice + edge)
  // Quarter-Kelly: f = (edge / (1 - marketPrice)) * 0.25
  const kellPct     = marketPrice < 1
    ? Math.min(maxBetPct, ((edge / (1 - marketPrice)) * 0.25 * 100))
    : 0
  const suggestedBetSize = (balance * kellPct) / 100

  const reasoningFn = DEMO_REASONINGS[Math.floor(Math.random() * DEMO_REASONINGS.length)]
  const reasoning   = reasoningFn(market.question, prediction, marketPrice * 100)

  return { prediction, confidence, reasoning, suggestedBetSize, oddsAtPrediction: odds, edge }
}

// ---------------------------------------------------------------------------
// Real prediction with Claude
// ---------------------------------------------------------------------------

/**
 * Generate an AI prediction for a Polymarket market.
 *
 * @param market     Full market object from Polymarket
 * @param balance    Current user balance (paper or real)
 * @param maxBetPct  Max allowed bet as % of balance
 */
export async function predictMarket(
  market: PolyMarket,
  balance: number,
  maxBetPct: number = 5
): Promise<PredictionResult> {
  // Fall back to mock if no API key is configured
  if (isDemoMode() || !client) {
    return mockPrediction(market, balance, maxBetPct)
  }

  const odds = buildOddsMap(market)
  const oddsStr = Object.entries(odds)
    .map(([k, v]) => `  • ${k}: ${(v * 100).toFixed(1)}%`)
    .join('\n')

  const endDate = market.endDate
    ? new Date(market.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'indefinida'

  const systemPrompt = `Eres un analista experto en mercados de predicción, criptomonedas y apuestas deportivas.
Tu objetivo es analizar mercados de Polymarket y generar predicciones rentables con base en:
- Análisis fundamental y técnico
- Probabilidades implícitas del mercado vs. probabilidades reales estimadas
- Contexto histórico y tendencias actuales
- Criterio de Kelly para gestión de bankroll

Responde SIEMPRE en el siguiente formato JSON estricto (sin markdown, sin texto extra):
{
  "prediction": "<outcome exacto de la lista>",
  "confidence": <número entre 0.0 y 1.0>,
  "edge": <probabilidad estimada real - probabilidad del mercado, puede ser negativo>,
  "bet_pct": <porcentaje del balance a apostar entre 0 y ${maxBetPct}>,
  "reasoning": "<análisis detallado de 3-5 párrafos>"
}`

  const userPrompt = `Analiza este mercado de predicción y dame tu recomendación:

MERCADO: ${market.question}
DESCRIPCIÓN: ${market.description || '(sin descripción adicional)'}
CATEGORÍA: ${market.category || 'General'}
FECHA DE RESOLUCIÓN: ${endDate}

PROBABILIDADES ACTUALES DEL MERCADO:
${oddsStr}

VOLUMEN TOTAL: $${Number(market.volume || 0).toLocaleString()} USDC
LIQUIDEZ: $${Number(market.liquidity || 0).toLocaleString()} USDC

OPCIONES DISPONIBLES: ${market.outcomes.join(', ')}

Por favor:
1. Estima la probabilidad real de cada outcome basándote en tu conocimiento
2. Compara con las probabilidades del mercado para encontrar edge
3. Aplica criterio de Kelly fraccional (25% Kelly) para el tamaño de la apuesta
4. Selecciona el outcome con mayor ventaja esperada positiva
5. Si no hay edge positivo claro, recomienda NO apostar (bet_pct = 0)`

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const response = await stream.finalMessage()

  // Extract the text block (skip thinking blocks)
  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  let parsed: {
    prediction: string
    confidence: number
    edge: number
    bet_pct: number
    reasoning: string
  }

  try {
    // Strip potential markdown code fences
    const raw = textBlock.text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    parsed = JSON.parse(raw)
  } catch {
    // Fallback: extract JSON from the response
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error(`Could not parse Claude response as JSON: ${textBlock.text.slice(0, 200)}`)
    }
    parsed = JSON.parse(jsonMatch[0])
  }

  // Validate prediction is one of the market outcomes
  if (!market.outcomes.includes(parsed.prediction)) {
    // Try case-insensitive match
    const match = market.outcomes.find(o => o.toLowerCase() === parsed.prediction.toLowerCase())
    if (match) {
      parsed.prediction = match
    } else {
      // Default to highest-odds outcome
      const entries = Object.entries(odds)
      parsed.prediction = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    }
  }

  // Clamp values
  parsed.confidence = Math.max(0, Math.min(1, parsed.confidence ?? 0.5))
  parsed.bet_pct = Math.max(0, Math.min(maxBetPct, parsed.bet_pct ?? 0))

  const suggestedBetSize = (balance * parsed.bet_pct) / 100

  return {
    prediction: parsed.prediction,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
    suggestedBetSize,
    oddsAtPrediction: odds,
    edge: parsed.edge ?? 0,
  }
}

/**
 * Quick sanity-check: should we auto-bet on this prediction?
 */
export function shouldAutoBet(
  result: PredictionResult,
  minConfidence: number
): boolean {
  return (
    result.confidence >= minConfidence &&
    result.edge > 0 &&
    result.suggestedBetSize > 0
  )
}

/**
 * Format a prediction result as a human-readable summary.
 */
export function formatPredictionSummary(result: PredictionResult, currency = 'USDC'): string {
  const edgeSign = result.edge >= 0 ? '+' : ''
  return [
    `Predicción: **${result.prediction}**`,
    `Confianza: ${(result.confidence * 100).toFixed(1)}%`,
    `Edge estimado: ${edgeSign}${(result.edge * 100).toFixed(1)}%`,
    `Apuesta sugerida: ${result.suggestedBetSize.toFixed(2)} ${currency}`,
  ].join(' | ')
}
