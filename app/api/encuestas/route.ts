import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const surveys = await prisma.survey.findMany({
      where: activeOnly ? { isActive: true } : {},
      include: {
        questions: true,
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ surveys })
  } catch (error) {
    console.error('Surveys fetch error:', error)
    return NextResponse.json({ error: 'Error al obtener encuestas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, questions } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Título y descripción son requeridos.' },
        { status: 400 }
      )
    }

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        isActive: true,
        questions: {
          create: (questions || []).map((q: { text: string; type: string; options?: string[] }) => ({
            text: q.text,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: { questions: true },
    })

    return NextResponse.json({ survey }, { status: 201 })
  } catch (error) {
    console.error('Survey creation error:', error)
    return NextResponse.json({ error: 'Error al crear encuesta.' }, { status: 500 })
  }
}
