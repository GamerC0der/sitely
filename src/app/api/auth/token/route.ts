import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'

const tempTokens = new Map<string, { userId: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = randomUUID()
    const expires = Date.now() + (15 * 60 * 1000)
    
    tempTokens.set(token, { userId, expires })
    
    return NextResponse.json({ 
      success: true, 
      token,
      expires: new Date(expires).toISOString()
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Token required' },
      { status: 400 }
    )
  }
  
  const tokenData = tempTokens.get(token)
  
  if (!tokenData) {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    )
  }
  
  if (Date.now() > tokenData.expires) {
    tempTokens.delete(token)
    return NextResponse.json(
      { success: false, error: 'Token expired' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({ 
    success: true, 
    userId: tokenData.userId,
    expires: new Date(tokenData.expires).toISOString()
  })
} 