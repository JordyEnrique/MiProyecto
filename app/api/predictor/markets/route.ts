import { NextRequest, NextResponse } from 'next/server'
import { fetchMarkets } from '@/lib/polymarket'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get('category') ?? 'all'
    const query    = searchParams.get('q') ?? undefined
    const limit    = Number(searchParams.get('limit') ?? '30')
    const offset   = Number(searchParams.get('offset') ?? '0')

    const markets = await fetchMarkets({ active: true, closed: false, limit, offset, query, category })

    return NextResponse.json({ markets, total: markets.length })
  } catch (error) {
    console.error('[predictor/markets]', error)
    return NextResponse.json(
      { error: 'Error al obtener mercados de Polymarket' },
      { status: 500 }
    )
  }
}
