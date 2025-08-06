import { getSite } from '@/lib/storage'
import { notFound } from 'next/navigation'

interface SitePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewSitePage({ params }: SitePageProps) {
  const resolvedParams = await params;
  
  try {
    const site = await getSite(resolvedParams.id)

    if (!site) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h1>
            <p className="text-gray-600 mb-2">No site found with ID: {resolvedParams.id}</p>
            <p className="text-gray-500 text-sm">The site may not exist or may have been deleted.</p>
          </div>
        </div>
      )
    }

    const htmlFile = Object.entries(site.files).find(([name]) => 
      name.toLowerCase() === 'index.html' || 
      name.toLowerCase() === 'index.htm' ||
      name.toLowerCase().endsWith('.html')
    )

    if (!htmlFile) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No HTML File Found</h1>
            <p className="text-gray-600 mb-2">Site "{site.title}" exists but contains no HTML files.</p>
            <p className="text-gray-500 text-sm">Available files: {Object.keys(site.files).join(', ')}</p>
          </div>
        </div>
      )
    }

    const htmlContent = typeof htmlFile[1] === 'string' ? htmlFile[1] : String(htmlFile[1]);
    const siteId = site.id;

    const processedHTML = htmlContent.replace(
      /(href|src)=["']([^"']*\.(css|js|png|jpg|jpeg|svg|gif))["']/gi,
      (match, attr, url) => {
        if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) {
          return match
        }
        
        const cleanUrl = url.startsWith('/') ? url : '/' + url
        return `${attr}="/api/site/${siteId}/assets${cleanUrl}"`
      }
    )

    return (
      <div className="w-full h-screen">
        <iframe
          srcDoc={processedHTML}
          className="w-full h-full border-0"
          title={site.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading site:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Site</h1>
          <p className="text-gray-600 mb-2">Failed to load site with ID: {resolvedParams.id}</p>
          <p className="text-gray-500 text-sm">Please check the console for more details.</p>
        </div>
      </div>
    )
  }
} 