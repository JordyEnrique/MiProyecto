import { NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/predictor'

export async function GET() {
  return NextResponse.json({ demoMode: isDemoMode() })
}
