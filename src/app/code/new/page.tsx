'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import CustomUserMenu from '@/components/CustomUserMenu';
import CustomEditor from '@/components/CustomEditor';

export default function NewProjectPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<Record<string, string>>(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      try {
        const templateData = JSON.parse(selectedTemplate);
        localStorage.removeItem('selectedTemplate');
        return templateData.files;
      } catch (error) {
        console.error('Error parsing template data:', error);
      }
    }
    return {
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
  });
  const [projectTitle, setProjectTitle] = useState(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      try {
        const templateData = JSON.parse(selectedTemplate);
        return templateData.title;
      } catch (error) {
        console.error('Error parsing template data:', error);
      }
    }
    return 'New Project';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
    } else {
      router.push('/auth/signin');
    }
  }, [isSignedIn, router]);

  const handleFilesChange = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white">
      <div className="h-full w-full">
        <CustomEditor
          files={files}
          onFilesChange={handleFilesChange}
          onDeploy={() => {}}
          projectTitle={projectTitle}
        />
      </div>
    </div>
  );
} 