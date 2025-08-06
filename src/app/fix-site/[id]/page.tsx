'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FixSitePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FixSitePage({ params }: FixSitePageProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const correctFiles = {
    '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
</head>
<body>
  <div id="app">
    <h1>Welcome to My Project</h1>
    <p>Start building your project here.</p>
  </div>
</body>
</html>`
  };

  const handleFixSite = async () => {
    setIsUpdating(true);
    setMessage('Updating site...');

    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/update-site/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: correctFiles
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Site updated successfully! Redirecting...');
        setTimeout(() => {
          router.push(`/site/${resolvedParams.id}`);
        }, 2000);
      } else {
        setMessage('Failed to update site: ' + data.error);
      }
    } catch (error) {
      console.error('Fix site error:', error);
      setMessage('Failed to update site. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Fix Site Content</h1>
        <p className="text-gray-600 mb-6">
          This will update the site with the correct content from your original project data.
        </p>
        
        <button
          onClick={handleFixSite}
          disabled={isUpdating}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {isUpdating ? 'Updating...' : 'Fix Site'}
        </button>
        
        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
} 