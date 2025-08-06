import { NextRequest, NextResponse } from 'next/server'
import { getSite } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const site = await getSite(resolvedParams.id)

    if (!site) {
      return new NextResponse('Site not found', { status: 404 })
    }

      return NextResponse.json(site)
  } catch (error) {
    console.error('Error loading site:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
} 