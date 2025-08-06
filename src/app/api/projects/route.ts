import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('Fetching projects for userId:', userId)

    const sites = await prisma.site.findMany({
      where: { userId },
      include: { files: true },
      orderBy: { updatedAt: 'desc' }
    })

    console.log('Found sites:', sites.length)

    const projects = sites.map(site => ({
      id: site.id,
      title: site.title || 'Untitled Site',
      url: `/view/site/${site.id}`,
      createdAt: site.createdAt.toISOString(),
      updatedAt: site.updatedAt.toISOString(),
      files: Object.fromEntries(site.files.map((f: any) => [
        f.name, 
        typeof f.content === 'string' ? f.content : String(f.content)
      ]))
    }))

    return NextResponse.json({ 
      success: true, 
      projects 
    })
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
} 