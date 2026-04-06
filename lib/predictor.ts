/**
 * AI Prediction Engine
 *
 * Uses Claude claude-opus-4-6 with adaptive thinking to analyze Polymarket
 * prediction markets and generate high-confidence betting recommendations.
 */

import Anthropic from '@anthropic-ai/sdk'
import { PolyMarket, buildOddsMap } from './polymarket'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface PredictionResult {
  prediction: string       // the predicted winning outcome
  confidence: number       // 0.0 – 1.0
  reasoning: string        // full analysis
  suggestedBetSize: number // % of balance to wager (Kelly-inspired)
  oddsAtPrediction: Record<string, number>
  edge: number             // estimated edge over market (our prob - market prob)
}

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
