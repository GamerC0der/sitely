'use client';

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SitePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SitePage({ params }: SitePageProps) {
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSite() {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/site/${resolvedParams.id}`)
        
        if (!response.ok) {
          notFound()
        }
        
        const siteData = await response.json()
        setSite(siteData)
        document.title = siteData.title || 'My Project'
      } catch (error) {
        console.error('Error loading site:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    
    loadSite()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600">No site found with this ID.</p>
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
          <p className="text-gray-600">This site doesn't contain an HTML file.</p>
        </div>
      </div>
    )
  }

  const htmlContent = typeof htmlFile[1] === 'string' ? htmlFile[1] : String(htmlFile[1])
  const siteId = site.id

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
} 