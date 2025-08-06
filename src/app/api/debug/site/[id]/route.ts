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
      return NextResponse.json({ 
        exists: false, 
        message: 'Site not found' 
      })
    }

    return NextResponse.json({ 
      exists: true,
      id: site.id,
      title: site.title,
      files: Object.keys(site.files),
      fileCount: Object.keys(site.files).length,
      htmlFiles: Object.keys(site.files).filter(name => name.toLowerCase().includes('.html')),
      sampleContent: Object.entries(site.files).slice(0, 2).map(([name, content]) => ({
        name,
        contentLength: typeof content === 'string' ? content.length : String(content).length,
        contentPreview: typeof content === 'string' ? content.substring(0, 100) : String(content).substring(0, 100)
      }))
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Failed to check site',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 