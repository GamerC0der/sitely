import { NextRequest, NextResponse } from 'next/server'
import { getSite } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const site = await getSite(resolvedParams.id)

    if (!site) {
      return new NextResponse('Site not found', { status: 404 })
    }

    const filePath = '/' + resolvedParams.path.join('/')
    const file = site.files[filePath]

    if (!file) {
      return new NextResponse('File not found', { status: 404 })
    }

    const content = typeof file === 'string' ? file : String(file)
    
    const ext = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'text/plain'
    
    switch (ext) {
      case 'css':
        contentType = 'text/css'
        break
      case 'js':
        contentType = 'application/javascript'
        break
      case 'html':
        contentType = 'text/html'
        break
      case 'json':
        contentType = 'application/json'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving asset:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
} 