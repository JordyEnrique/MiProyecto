import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const settings = await prisma.predictorSettings.findUnique({
    where: { userId: session.user.id },
  })

  // Return defaults if not configured yet
  return NextResponse.json(
    settings ?? {
      mode: 'paper',
      paperBalance: 1000.0,
      maxBetPct: 5.0,
      autoBet: false,
      minConfidence: 0.65,
      polyApiKey: null,
      polyApiSecret: null,
      polyPassphrase: null,
      polyAddress: null,
    }
  )
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const {
    mode,
    paperBalance,
    maxBetPct,
    autoBet,
    minConfidence,
    polyApiKey,
    polyApiSecret,
    polyPassphrase,
    polyAddress,
  } = body

  // Validate mode
  if (mode && !['paper', 'real'].includes(mode)) {
    return NextResponse.json({ error: 'Modo inválido' }, { status: 400 })
  }

  const settings = await prisma.predictorSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      mode: mode ?? 'paper',
      paperBalance: paperBalance ?? 1000.0,
      maxBetPct: maxBetPct ?? 5.0,
      autoBet: autoBet ?? false,
      minConfidence: minConfidence ?? 0.65,
      polyApiKey: polyApiKey ?? null,
      polyApiSecret: polyApiSecret ?? null,
      polyPassphrase: polyPassphrase ?? null,
      polyAddress: polyAddress ?? null,
    },
    update: {
      ...(mode !== undefined && { mode }),
      ...(paperBalance !== undefined && { paperBalance }),
      ...(maxBetPct !== undefined && { maxBetPct }),
      ...(autoBet !== undefined && { autoBet }),
      ...(minConfidence !== undefined && { minConfidence }),
      ...(polyApiKey !== undefined && { polyApiKey }),
      ...(polyApiSecret !== undefined && { polyApiSecret }),
      ...(polyPassphrase !== undefined && { polyPassphrase }),
      ...(polyAddress !== undefined && { polyAddress }),
    },
  })

  return NextResponse.json(settings)
}
