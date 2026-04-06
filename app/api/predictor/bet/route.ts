import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { fetchMarketById, buildOddsMap, placeClobOrder, estimatePayout } from '@/lib/polymarket'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') ?? undefined
  const limit  = Number(searchParams.get('limit') ?? '50')

  const where: { userId: string; status?: string } = { userId: session.user.id }
  if (status) where.status = status

  const bets = await prisma.betOrder.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { prediction: { select: { confidence: true, reasoning: true } } },
  })

  return NextResponse.json({ bets })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const { marketId, outcome, amount, predictionId } = body

  if (!marketId || !outcome || !amount) {
    return NextResponse.json({ error: 'Faltan campos: marketId, outcome, amount' }, { status: 400 })
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'El monto debe ser mayor a 0' }, { status: 400 })
  }

  // Load settings
  const settings = await prisma.predictorSettings.findUnique({
    where: { userId: session.user.id },
  })
  const mode    = settings?.mode ?? 'paper'
  const balance = settings?.paperBalance ?? 0

  if (mode === 'paper' && balance < amount) {
    return NextResponse.json(
      { error: `Balance insuficiente. Disponible: ${balance.toFixed(2)} USDC` },
      { status: 400 }
    )
  }

  // Fetch current market data
  const market = await fetchMarketById(marketId)
  if (!market) {
    return NextResponse.json({ error: 'Mercado no encontrado' }, { status: 404 })
  }
  if (!market.active || market.closed) {
    return NextResponse.json({ error: 'El mercado está cerrado' }, { status: 400 })
  }
  if (!market.outcomes.includes(outcome)) {
    return NextResponse.json(
      { error: `Outcome inválido. Opciones: ${market.outcomes.join(', ')}` },
      { status: 400 }
    )
  }

  const odds  = buildOddsMap(market)
  const price = odds[outcome] ?? 0.5
  const potentialWin = estimatePayout(amount, price)

  let externalId: string | null = null

  // Real money: use CLOB API
  if (mode === 'real') {
    if (!settings?.polyApiKey || !settings?.polyApiSecret || !settings?.polyPassphrase || !settings?.polyAddress) {
      return NextResponse.json(
        { error: 'Configura tus credenciales de Polymarket en Ajustes antes de apostar con dinero real' },
        { status: 400 }
      )
    }

    try {
      const orderResult = await placeClobOrder(
        {
          apiKey:     settings.polyApiKey,
          apiSecret:  settings.polyApiSecret,
          passphrase: settings.polyPassphrase,
          address:    settings.polyAddress,
        },
        {
          tokenId: market.conditionId, // Polymarket uses conditionId as token ID
          price,
          size: amount,
          side: 'BUY',
        }
      )
      externalId = orderResult.orderId
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      return NextResponse.json({ error: `Error al colocar orden real: ${msg}` }, { status: 500 })
    }
  }

  // Persist bet
  const bet = await prisma.betOrder.create({
    data: {
      userId:       session.user.id,
      predictionId: predictionId ?? null,
      marketId:     market.id,
      marketSlug:   market.slug,
      question:     market.question,
      outcome,
      amount,
      price,
      potentialWin,
      mode,
      status:       'open',
      externalId,
    },
  })

  // Deduct from paper balance
  if (mode === 'paper') {
    await prisma.predictorSettings.update({
      where: { userId: session.user.id },
      data:  { paperBalance: { decrement: amount } },
    })
  }

  return NextResponse.json({
    bet,
    message: mode === 'paper'
      ? `📄 Apuesta de prueba colocada: ${amount} USDC en "${outcome}" (cotización: ${(price * 100).toFixed(1)}%)`
      : `💰 Apuesta real colocada en Polymarket: ${amount} USDC en "${outcome}"`,
  })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const betId = searchParams.get('id')
  if (!betId) return NextResponse.json({ error: 'Falta el id de la apuesta' }, { status: 400 })

  const bet = await prisma.betOrder.findFirst({
    where: { id: betId, userId: session.user.id },
  })
  if (!bet) return NextResponse.json({ error: 'Apuesta no encontrada' }, { status: 404 })
  if (bet.status !== 'open') {
    return NextResponse.json({ error: 'Solo se pueden cancelar apuestas abiertas' }, { status: 400 })
  }

  await prisma.betOrder.update({
    where: { id: betId },
    data:  { status: 'cancelled' },
  })

  // Refund paper balance
  if (bet.mode === 'paper') {
    await prisma.predictorSettings.update({
      where: { userId: session.user.id },
      data:  { paperBalance: { increment: bet.amount } },
    })
  }

  return NextResponse.json({ message: 'Apuesta cancelada y monto devuelto al balance' })
}
