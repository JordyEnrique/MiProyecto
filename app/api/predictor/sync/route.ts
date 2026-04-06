/**
 * Sync open bets with Polymarket to check for resolutions.
 * Call this periodically (e.g. via cron or on-demand from the UI).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { fetchMarketById } from '@/lib/polymarket'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const openBets = await prisma.betOrder.findMany({
    where: { userId: session.user.id, status: 'open' },
  })

  if (openBets.length === 0) {
    return NextResponse.json({ message: 'No hay apuestas abiertas para sincronizar', resolved: 0 })
  }

  let resolved = 0
  const results: { betId: string; question: string; outcome: string; status: string; pnl: number }[] = []

  for (const bet of openBets) {
    const market = await fetchMarketById(bet.marketId)
    if (!market) continue

    // Market is still active — skip
    if (market.active && !market.closed) continue

    // Market closed: find the winning outcome (price = 1.0 means resolved YES)
    let winningOutcome: string | null = null
    for (let i = 0; i < market.outcomes.length; i++) {
      const price = parseFloat(market.outcomePrices[i] ?? '0')
      if (price >= 0.99) {
        winningOutcome = market.outcomes[i]
        break
      }
    }

    if (!winningOutcome) continue  // Not resolved yet

    const won    = bet.outcome === winningOutcome
    const newStatus = won ? 'won' : 'lost'
    const pnl    = won ? bet.potentialWin - bet.amount : -bet.amount

    await prisma.betOrder.update({
      where: { id: bet.id },
      data: {
        status:     newStatus,
        resolvedAt: new Date(),
      },
    })

    // Credit paper balance if won
    if (won && bet.mode === 'paper') {
      await prisma.predictorSettings.update({
        where: { userId: session.user.id },
        data:  { paperBalance: { increment: bet.potentialWin } },
      })
    }

    // Update prediction status
    if (bet.predictionId) {
      await prisma.marketPrediction.update({
        where: { id: bet.predictionId },
        data: {
          status:          newStatus,
          resolvedOutcome: winningOutcome,
        },
      })
    }

    resolved++
    results.push({
      betId:    bet.id,
      question: bet.question,
      outcome:  bet.outcome,
      status:   newStatus,
      pnl,
    })
  }

  return NextResponse.json({
    message: `${resolved} apuesta(s) sincronizadas`,
    resolved,
    results,
  })
}
