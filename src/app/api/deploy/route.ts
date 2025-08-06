import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { saveSite } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('Deploying for userId:', userId)

    const { files, title } = await request.json()
    
    const result = await saveSite(files, title || 'Untitled Site', userId)

    console.log('Deploy result:', result)

    return NextResponse.json({ 
      success: true, 
      siteId: result.id,
      url: `/site/${result.id}`
    })
  } catch (error) {
    console.error('Deploy error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to deploy site' },
      { status: 500 }
    )
  }
} 