'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CustomUserMenu from '@/components/CustomUserMenu';
import Editor from '@monaco-editor/react';
import { FileText, Code, FileCode, FileJson, FileType, FileCode2, FileCog, FileSpreadsheet, FileVideo, FileAudio, FileImage, FileArchive, FileCheck, FileX, FileSearch, FileHeart, FileKey, FileLock, FileMinus, FilePlus, FileQuestion, FileWarning, FileBarChart, FileDigit, FileDown, FileUp, FileInput, FileOutput, FilePieChart, FileSignature, FileStack, FileTerminal, FileVolume2, FileVolumeX, FileZap, FileBadge, FileBox, FileClock, FileEdit, FileEye, FileFilter, FileGrid, FileList, FileMap, FileMusic, FilePen, FileScan, FileSettings, FileShield, FileText2, FileTimer, FileVideo2, FileWebhook, FileX2, FileY, FileZ, File, Database } from 'lucide-react';

interface File {
  name: string;
  content: string;
  language: string;
}

interface CustomEditorProps {
  files: Record<string, string>;
  onFilesChange: (files: Record<string, string>) => void;
  onDeploy: () => void;
  projectTitle: string;
}

export default function CustomEditor({ files, onFilesChange, onDeploy, projectTitle }: CustomEditorProps) {
  const [activeFile, setActiveFile] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'preview' | 'code' | 'version'>('preview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fileList = Object.entries(files).map(([name, content]) => ({
    name,
    content: typeof content === 'string' ? content : String(content),
    language: getLanguageFromFileName(name)
  }));

  useEffect(() => {
    if (fileList.length > 0 && !activeFile) {
      setActiveFile(fileList[0].name);
    }
  }, [fileList, activeFile]);

  function getLanguageFromFileName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp';
      case 'c':
        return 'c';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'swift':
        return 'swift';
      case 'kt':
        return 'kotlin';
      case 'scala':
        return 'scala';
      case 'sql':
        return 'sql';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yaml';
      case 'toml':
        return 'toml';
      case 'ini':
        return 'ini';
      case 'sh':
      case 'bash':
        return 'shell';
      case 'ps1':
        return 'powershell';
      default:
        return 'plaintext';
    }
  }

  function getLanguageIcon(language: string) {
    switch (language) {
      case 'javascript':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'typescript':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'css':
        return <FileCode className="w-4 h-4 text-pink-500" />;
      case 'html':
        return <FileCode2 className="w-4 h-4 text-orange-500" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-green-500" />;
      case 'markdown':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'python':
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'java':
        return <FileCode className="w-4 h-4 text-red-500" />;
      case 'cpp':
      case 'c':
        return <FileCode className="w-4 h-4 text-blue-700" />;
      case 'php':
        return <FileCode className="w-4 h-4 text-purple-500" />;
      case 'ruby':
        return <FileCode className="w-4 h-4 text-red-600" />;
      case 'go':
        return <FileCode className="w-4 h-4 text-cyan-500" />;
      case 'rust':
        return <FileCode className="w-4 h-4 text-orange-600" />;
      case 'swift':
        return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'kotlin':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'scala':
        return <FileCode className="w-4 h-4 text-red-700" />;
      case 'sql':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'xml':
        return <FileCode className="w-4 h-4 text-orange-500" />;
      case 'yaml':
        return <FileCode className="w-4 h-4 text-green-600" />;
      case 'toml':
        return <FileCode className="w-4 h-4 text-blue-800" />;
      case 'ini':
        return <FileCog className="w-4 h-4 text-gray-600" />;
      case 'shell':
      case 'powershell':
        return <FileTerminal className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  }

  const handleFileContentChange = (fileName: string, content: string) => {
    const updatedFiles = { ...files, [fileName]: content };
    onFilesChange(updatedFiles);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const updatedFiles = { ...files, [newFileName]: '' };
      onFilesChange(updatedFiles);
      setActiveFile(newFileName);
      setNewFileName('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = { ...files };
    delete updatedFiles[fileName];
    onFilesChange(updatedFiles);
    
    if (activeFile === fileName) {
      const remainingFiles = Object.keys(updatedFiles);
      setActiveFile(remainingFiles[0] || '');
    }
  };

  const handleDeploy = async () => {
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          title: projectTitle
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setDeployedUrl(data.url);
        setIsDeployModalOpen(true);
      } else {
        alert('Failed to deploy site. Please try again.');
      }
    } catch (error) {
      console.error('Deploy error:', error);
      alert('Failed to deploy site. Please try again.');
    }
  };

  const getPreviewHTML = () => {
    const htmlFile = fileList.find(f => f.name.toLowerCase().includes('index.html') || f.name.toLowerCase().endsWith('.html'));
    if (!htmlFile) return '<div>No HTML file found</div>';

    let html = htmlFile.content;
    
    const cssFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.css'));
    cssFiles.forEach(cssFile => {
      const styleTag = `<style>${cssFile.content}</style>`;
      html = html.replace('</head>', `${styleTag}\n</head>`);
    });

    const jsFiles = fileList.filter(f => f.name.toLowerCase().endsWith('.js'));
    jsFiles.forEach(jsFile => {
      const scriptTag = `<script>${jsFile.content}</script>`;
      html = html.replace('</body>', `${scriptTag}\n</body>`);
    });

    return html;
  };

  const currentFile = fileList.find(f => f.name === activeFile);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/code')}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md bg-gray-600 hover:bg-gray-700 text-white"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{projectTitle}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDeploy}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Deploy
          </button>
          <CustomUserMenu afterSignOutUrl="/" />
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setPreviewMode('preview')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            previewMode === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setPreviewMode('code')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            previewMode === 'code'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setPreviewMode('version')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            previewMode === 'version'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Version Control
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {previewMode === 'preview' ? (
          <div className="h-full">
            <iframe
              ref={iframeRef}
              srcDoc={getPreviewHTML()}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>
        ) : previewMode === 'version' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Version Control</h2>
              <p className="text-gray-600 text-lg">Coming Soon</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New File
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {fileList.map((file) => (
                  <div
                    key={file.name}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeFile === file.name ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    }`}
                    onClick={() => setActiveFile(file.name)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getLanguageIcon(file.language)}
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    </div>
                    {fileList.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.name);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {currentFile ? (
                <>
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{currentFile.name}</span>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage={currentFile.language}
                      value={currentFile.content}
                      onChange={(value) => handleFileContentChange(currentFile.name, value || '')}
                      theme="vs"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollbar: {
                          vertical: 'visible',
                          horizontal: 'visible',
                          useShadows: false,
                          verticalScrollbarSize: 10,
                          horizontalScrollbarSize: 10,
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>No files to edit</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New File</h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewFileName('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  id="fileName"
                  type="text"
                  placeholder="e.g., style.css, script.js, index.html"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFile();
                    }
                    if (e.key === 'Escape') {
                      setIsCreateModalOpen(false);
                      setNewFileName('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateFile}
                  disabled={!newFileName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  Create File
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewFileName('');
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeployModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deployed!</h3>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">Your site has been successfully deployed!</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your site URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={deployedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + deployedUrl);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.open(window.location.origin + deployedUrl, '_blank')}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  View Site
                </button>
                <button
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

 