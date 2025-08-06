import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const resolvedParams = await params;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const site = await prisma.site.findFirst({
      where: { 
        id: resolvedParams.id,
        userId 
      },
      include: { files: true }
    })

    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = {
      id: site.id,
      title: site.title || 'Untitled Site',
      files: Object.fromEntries(site.files.map((f: any) => [
        f.name, 
        typeof f.content === 'string' ? f.content : String(f.content)
      ]))
    }

    return NextResponse.json({ 
      success: true, 
      project 
    })
  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const resolvedParams = await params;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const site = await prisma.site.findFirst({
      where: { 
        id: resolvedParams.id,
        userId 
      }
    })

    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    await prisma.site.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 