import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, lastName, cedula, phone, email, password, country, city, profession } = body

    if (!name || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, apellido, email y contraseña son requeridos.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres.' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email.' },
        { status: 409 }
      )
    }

    if (cedula) {
      const existingCedula = await prisma.user.findUnique({ where: { cedula } })
      if (existingCedula) {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con esta cédula.' },
          { status: 409 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        cedula: cedula || null,
        phone: phone || null,
        email,
        password: hashedPassword,
        country: country || null,
        city: city || null,
        profession: profession || null,
      },
    })

    return NextResponse.json(
      { message: 'Usuario creado exitosamente.', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
