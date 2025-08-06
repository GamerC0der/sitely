'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  files: Record<string, string>;
  onFilesChange: (files: Record<string, string>) => void;
  projectId?: string;
  projectTitle: string;
  onDeploy: () => Promise<void>;
  analyticsData?: any;
}

export default function AIAssistant({ 
  files, 
  onFilesChange, 
  projectId, 
  projectTitle, 
  onDeploy,
  analyticsData 
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI coding assistant. I can help you with:
• Editing and improving your code
• Adding new features
• Viewing analytics data
• Deploying your project
• Debugging issues

What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are an AI coding assistant helping with a web project. 

Project: ${projectTitle}
Project ID: ${projectId}

Current files:
${Object.entries(files).map(([name, content]) => `- ${name}: ${content.substring(0, 200)}...`).join('\n')}

Analytics data: ${analyticsData ? JSON.stringify(analyticsData, null, 2) : 'Not available'}

To make changes to files, use the <edit> tag syntax:

<edit filename="filename.ext">
new content here
</edit>

To create new files:
<edit filename="newfile.ext">
content for new file
</edit>

To delete files:
<edit filename="file-to-delete.ext" action="delete">
</edit>

To deploy the project, include: <deploy>DEPLOY</deploy>

To show analytics, include: <analytics>SHOW_ANALYTICS</analytics>

Be helpful, concise, and focus on practical solutions. When making changes, use the <edit> tags.`;



      const response = await fetch('https://ai.hackclub.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: input }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I encountered an error.';

      const editRegex = /<edit\s+filename="([^"]+)"(?:\s+action="([^"]+)")?>\s*([\s\S]*?)<\/edit>/g;
      const deployRegex = /<deploy>DEPLOY<\/deploy>/g;
      const analyticsRegex = /<analytics>SHOW_ANALYTICS<\/analytics>/g;
      
      let match;
      let hasActions = false;
      
      while ((match = editRegex.exec(assistantMessage)) !== null) {
        hasActions = true;
        const [, filename, action, content] = match;
        
        if (action === 'delete') {
          const filesAfterDelete = { ...files };
          delete filesAfterDelete[filename];
          onFilesChange(filesAfterDelete);
        } else {
          const updatedFiles = { ...files, [filename]: content.trim() };
          onFilesChange(updatedFiles);
        }
      }
      
      if (deployRegex.test(assistantMessage)) {
        hasActions = true;
        setShowDeployModal(true);
      }
      
      if (analyticsRegex.test(assistantMessage)) {
        hasActions = true;
        const analyticsResult = analyticsData ? 
          `Analytics data: ${JSON.stringify(analyticsData, null, 2)}` : 
          'No analytics data available';
        
        const analyticsMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: analyticsResult,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, analyticsMessage]);
      }
      
      let cleanMessage = assistantMessage
        .replace(editRegex, '')
        .replace(deployRegex, '')
        .replace(analyticsRegex, '')
        .trim();
      
      if (hasActions && !cleanMessage) {
        cleanMessage = 'I\'ve made the requested changes to your project.';
      }
      
      if (cleanMessage) {
        const newMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }

    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
        title="AI Assistant"
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User size={14} />
                      ) : (
                        <Bot size={14} />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your code..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deployment</h3>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Deploy Project</p>
                  <p className="text-sm text-gray-600">{projectTitle}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 mb-2">Files to deploy:</p>
                <div className="space-y-1">
                  {Object.keys(files).map((filename) => (
                    <div key={filename} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {filename}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setDeployStatus('deploying');
                  try {
                    await onDeploy();
                    setDeployStatus('success');
                    setTimeout(() => {
                      setShowDeployModal(false);
                      setDeployStatus('idle');
                    }, 2000);
                  } catch (error) {
                    setDeployStatus('error');
                    setTimeout(() => {
                      setDeployStatus('idle');
                    }, 3000);
                  }
                }}
                disabled={deployStatus === 'deploying'}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {deployStatus === 'deploying' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deploying...
                  </>
                ) : deployStatus === 'success' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Deployed!
                  </>
                ) : deployStatus === 'error' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Error
                  </>
                ) : (
                  'Deploy Now'
                )}
              </button>
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 