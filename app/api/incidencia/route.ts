import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const activeOnly = searchParams.get('active') === 'true'

    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(country ? { country } : {}),
      },
      include: {
        _count: {
          select: { signatures: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Campaigns fetch error:', error)
    return NextResponse.json({ error: 'Error al obtener campañas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, country, ministry, letterTemplate } = body

    if (!title || !description || !country || !ministry || !letterTemplate) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        country,
        ministry,
        letterTemplate,
        isActive: true,
      },
    })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json({ error: 'Error al crear campaña.' }, { status: 500 })
  }
}
