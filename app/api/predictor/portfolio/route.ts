import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const userId = session.user.id

  // Load all bets
  const allBets = await prisma.betOrder.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      prediction: { select: { confidence: true } },
    },
  })

  const settings = await prisma.predictorSettings.findUnique({ where: { userId } })
  const balance            = settings?.paperBalance ?? 1000
  const mode               = settings?.mode ?? 'paper'
  const aiCostPerPrediction = settings?.aiCostPerPrediction ?? 0.10

  // Split by status
  const openBets = allBets.filter(b => b.status === 'open')
  const wonBets  = allBets.filter(b => b.status === 'won')
  const lostBets = allBets.filter(b => b.status === 'lost')

  // Betting stats
  const totalWagered = allBets.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0)
  const totalWon     = wonBets.reduce((s, b) => s + b.potentialWin, 0)
  const totalLost    = lostBets.reduce((s, b) => s + b.amount, 0)
  const openExposure = openBets.reduce((s, b) => s + b.amount, 0)
  const netPnlBets   = totalWon - totalLost

  const winRate = (wonBets.length + lostBets.length) > 0
    ? wonBets.length / (wonBets.length + lostBets.length)
    : 0

  // AI cost stats
  const totalPredictions = await prisma.marketPrediction.count({ where: { userId } })
  const totalAiCost      = Math.round(totalPredictions * aiCostPerPrediction * 100) / 100
  const netPnlReal       = Math.round((netPnlBets - totalAiCost) * 100) / 100

  // ROI: (ganancia neta real) / (capital apostado + costo IA)
  const totalInvested = totalWagered + totalAiCost
  const roiBets = totalWagered > 0
    ? Math.round((netPnlBets / totalWagered) * 10000) / 100
    : 0
  const roiReal = totalInvested > 0
    ? Math.round((netPnlReal / totalInvested) * 10000) / 100
    : 0

  // Recent predictions
  const predictions = await prisma.marketPrediction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { betOrders: { select: { id: true, status: true, amount: true } } },
  })

  return NextResponse.json({
    stats: {
      balance,
      mode,
      totalBets:         allBets.filter(b => b.status !== 'cancelled').length,
      openBets:          openBets.length,
      wonBets:           wonBets.length,
      lostBets:          lostBets.length,
      totalWagered:      Math.round(totalWagered * 100) / 100,
      totalWon:          Math.round(totalWon * 100) / 100,
      totalLost:         Math.round(totalLost * 100) / 100,
      openExposure:      Math.round(openExposure * 100) / 100,
      netPnlBets:        Math.round(netPnlBets * 100) / 100,
      // AI cost breakdown
      totalPredictions,
      aiCostPerPrediction,
      totalAiCost,
      // True bottom-line figures
      netPnlReal,
      roiBets,
      roiReal,
      winRate:           Math.round(winRate * 1000) / 10,
    },
    recentBets:        allBets.slice(0, 10),
    recentPredictions: predictions,
  })
}
