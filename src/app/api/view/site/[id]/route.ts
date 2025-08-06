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

    const htmlFile = Object.entries(site.files).find(([name]) => 
      name.toLowerCase() === 'index.html' || 
      name.toLowerCase() === 'index.htm' ||
      name.toLowerCase().endsWith('.html')
    )

    if (!htmlFile) {
      return new NextResponse('No HTML file found', { status: 404 })
    }

    const htmlContent = typeof htmlFile[1] === 'string' ? htmlFile[1] : String(htmlFile[1]);

    const cssFiles = Object.entries(site.files).filter(([name]) => 
      name.toLowerCase().endsWith('.css')
    );
    
    const jsFiles = Object.entries(site.files).filter(([name]) => 
      name.toLowerCase().endsWith('.js')
    );

    const cssContent = cssFiles.map(([name, content]) => 
      typeof content === 'string' ? content : String(content)
    ).join('\n');

    const jsContent = jsFiles.map(([name, content]) => 
      typeof content === 'string' ? content : String(content)
    ).join('\n');
    const completeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${site.title}</title>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent.replace(/<html[^>]*>|<\/html>|<head[^>]*>|<\/head>|<body[^>]*>|<\/body>/gi, '')}
        <script>${jsContent}</script>
      </body>
      </html>
    `;

    return new NextResponse(completeHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error loading site:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
} 