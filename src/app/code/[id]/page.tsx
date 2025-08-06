'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import CustomEditor from '@/components/CustomEditor';

interface Project {
  id: string;
  title: string;
  files: Record<string, string>;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      const resolvedParams = await params;
      try {
        const response = await fetch(`/api/projects/${resolvedParams.id}`);
        const data = await response.json();
        if (data.success) {
          setProject(data.project);
          
          const processedFiles = Object.fromEntries(
            Object.entries(data.project.files).map(([name, content]) => [
              name,
              typeof content === 'string' ? content : String(content)
            ])
          );
          
          setFiles(processedFiles);
        } else {
          router.push('/code');
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        router.push('/code');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      setIsAuthenticated(true);
      loadProject();
    } else {
      router.push('/auth/signin');
    }
  }, [isSignedIn, router, params]);

  const handleFilesChange = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
    
    if (project) {
      fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: newFiles
        }),
      }).catch(error => {
        console.error('Failed to save project:', error);
      });
    }
  };

  const handleDeploy = async () => {
    if (!project) return;
    
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          title: project.title,
          projectId: project.id
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('Project deployed successfully');
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Failed to deploy project:', error);
      throw error;
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/code')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white">
      <div className="h-full w-full">
        <CustomEditor
          files={files}
          onFilesChange={handleFilesChange}
          onDeploy={handleDeploy}
          projectTitle={project.title}
          projectId={project.id}
        />
      </div>
    </div>
  );
} 