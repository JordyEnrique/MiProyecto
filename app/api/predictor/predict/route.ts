import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { fetchMarketById, fetchMarketBySlug, buildOddsMap } from '@/lib/polymarket'
import { predictMarket, shouldAutoBet } from '@/lib/predictor'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const { marketId, marketSlug } = body

  if (!marketId && !marketSlug) {
    return NextResponse.json({ error: 'Se requiere marketId o marketSlug' }, { status: 400 })
  }

  // Load user settings
  const settings = await prisma.predictorSettings.findUnique({
    where: { userId: session.user.id },
  })
  const balance     = settings?.paperBalance ?? 1000
  const maxBetPct   = settings?.maxBetPct ?? 5
  const minConf     = settings?.minConfidence ?? 0.65
  const mode        = settings?.mode ?? 'paper'

  // Fetch market from Polymarket
  const market = marketId
    ? await fetchMarketById(marketId)
    : await fetchMarketBySlug(marketSlug!)

  if (!market) {
    return NextResponse.json({ error: 'Mercado no encontrado' }, { status: 404 })
  }

  if (!market.active || market.closed) {
    return NextResponse.json({ error: 'El mercado está cerrado' }, { status: 400 })
  }

  // Generate AI prediction
  const result = await predictMarket(market, balance, maxBetPct)

  // Persist prediction
  const prediction = await prisma.marketPrediction.create({
    data: {
      userId:           session.user.id,
      marketId:         market.id,
      marketSlug:       market.slug,
      question:         market.question,
      category:         market.category ?? 'other',
      outcomes:         JSON.stringify(market.outcomes),
      currentOdds:      JSON.stringify(result.oddsAtPrediction),
      prediction:       result.prediction,
      confidence:       result.confidence,
      reasoning:        result.reasoning,
      suggestedBetSize: result.suggestedBetSize,
      status:           'pending',
    },
  })

  // Auto-bet if enabled and prediction meets threshold
  let autoBetOrder = null
  if (settings?.autoBet && shouldAutoBet(result, minConf)) {
    const odds  = buildOddsMap(market)
    const price = odds[result.prediction] ?? 0.5
    const amount = result.suggestedBetSize

    autoBetOrder = await prisma.betOrder.create({
      data: {
        userId:       session.user.id,
        predictionId: prediction.id,
        marketId:     market.id,
        marketSlug:   market.slug,
        question:     market.question,
        outcome:      result.prediction,
        amount,
        price,
        potentialWin: amount / price,
        mode,
        status:       'open',
      },
    })

    // Deduct from paper balance
    if (mode === 'paper') {
      await prisma.predictorSettings.update({
        where: { userId: session.user.id },
        data:  { paperBalance: { decrement: amount } },
      })
    }
  }

  return NextResponse.json({
    prediction,
    result,
    autoBetOrder,
    message: autoBetOrder
      ? `✅ Apuesta automática colocada: ${result.suggestedBetSize.toFixed(2)} USDC en "${result.prediction}"`
      : null,
  })
}
