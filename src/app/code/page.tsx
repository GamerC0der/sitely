'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import CustomUserMenu from '@/components/CustomUserMenu';
import { Search, Plus, Edit, Trash2, ExternalLink, Code, Globe } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  files: Record<string, any>;
}

export default function CodePage() {
  const searchParams = useSearchParams();
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with a clean slate',
      icon: '📄',
      files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
</head>
<body>
    <div id="app">
        <h1>Hello World!</h1>
        <p>Start building your project here.</p>
    </div>
</body>
</html>`
      }
    },
    {
      id: 'portfolio',
      name: 'Portfolio Template',
      description: 'Professional portfolio with modern design',
      icon: '🎨',
      files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <h1>John Doe</h1>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>Welcome to my portfolio</h2>
            <p>I'm a passionate developer creating amazing web experiences</p>
        </section>
        
        <section id="about">
            <h2>About Me</h2>
            <p>I love building beautiful and functional websites.</p>
        </section>
        
        <section id="projects">
            <h2>My Projects</h2>
            <div class="project-grid">
                <div class="project-card">
                    <h3>Project 1</h3>
                    <p>Description of project 1</p>
                </div>
                <div class="project-card">
                    <h3>Project 2</h3>
                    <p>Description of project 2</p>
                </div>
            </div>
        </section>
        
        <section id="contact">
            <h2>Contact Me</h2>
            <p>Get in touch: hello@example.com</p>
        </section>
    </main>
    
    <script src="script.js"></script>
</body>
</html>`,
        '/style.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

nav a:hover {
    color: #3498db;
}

main {
    margin-top: 80px;
}

section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

#hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 6rem 2rem;
}

#hero h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

#hero p {
    font-size: 1.2rem;
    opacity: 0.9;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.project-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

#contact {
    background: #f8f9fa;
    text-align: center;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    nav ul {
        gap: 1rem;
    }
    
    #hero h2 {
        font-size: 2rem;
    }
    
    section {
        padding: 2rem 1rem;
    }
}`,
        '/script.js': `document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});`
      }
    },
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Modern landing page with call-to-action',
      icon: '🚀',
      files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazing Product</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Brand</div>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <div class="hero-content">
                <h1>Transform Your Business</h1>
                <p>The ultimate solution for modern companies looking to scale and succeed in today's competitive market.</p>
                <div class="cta-buttons">
                    <button class="btn-primary">Get Started</button>
                    <button class="btn-secondary">Learn More</button>
                </div>
            </div>
            <div class="hero-image">
                <div class="placeholder-image">📱</div>
            </div>
        </section>
        
        <section id="features">
            <h2>Why Choose Us</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Experience blazing fast performance that keeps your users engaged.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>Enterprise-grade security to protect your data and your users.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Scalable</h3>
                    <p>Grow with confidence knowing our platform scales with your business.</p>
                </div>
            </div>
        </section>
        
        <section id="pricing">
            <h2>Simple Pricing</h2>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Starter</h3>
                    <div class="price">$9<span>/month</span></div>
                    <ul>
                        <li>Basic features</li>
                        <li>5 projects</li>
                        <li>Email support</li>
                    </ul>
                    <button class="btn-primary">Choose Plan</button>
                </div>
                <div class="pricing-card featured">
                    <h3>Pro</h3>
                    <div class="price">$29<span>/month</span></div>
                    <ul>
                        <li>All features</li>
                        <li>Unlimited projects</li>
                        <li>Priority support</li>
                    </ul>
                    <button class="btn-primary">Choose Plan</button>
                </div>
            </div>
        </section>
        
        <section id="contact">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today.</p>
            <button class="btn-primary">Start Free Trial</button>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Brand. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
        '/style.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

nav a:hover {
    color: #2563eb;
}

main {
    margin-top: 80px;
}

section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

#hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 6rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin-top: 0;
}

.hero-content h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
}

.btn-primary, .btn-secondary {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #2563eb;
}

.hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
}

.placeholder-image {
    font-size: 8rem;
    opacity: 0.8;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2563eb;
}

.pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.pricing-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.pricing-card.featured {
    border: 2px solid #2563eb;
    transform: scale(1.05);
}

.pricing-card:hover {
    transform: translateY(-5px);
}

.pricing-card.featured:hover {
    transform: scale(1.05) translateY(-5px);
}

.pricing-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2563eb;
}

.price {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 2rem;
}

.price span {
    font-size: 1rem;
    color: #666;
}

.pricing-card ul {
    list-style: none;
    margin-bottom: 2rem;
}

.pricing-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

#contact {
    background: #f8fafc;
    text-align: center;
}

#contact p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

footer {
    background: #1f2937;
    color: white;
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    #hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }
    
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .cta-buttons {
        justify-content: center;
    }
    
    .features-grid,
    .pricing-grid {
        grid-template-columns: 1fr;
    }
}`,
        '/script.js': `document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Thank you for your interest! This is a demo landing page.');
        });
    });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});`
      }
    }
  ];

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      validateToken(token);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
      loadProjects();
    }
  }, [isSignedIn]);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/token?token=${token}`);
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        document.cookie = `auth-token=${token}; path=/; max-age=900; secure; samesite=strict`;
        loadProjects();
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p.id !== projectId));
      }
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
              <CustomUserMenu afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first project to get started.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/code/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/code/${project.id}`)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span className="truncate">{project.url}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => window.open(project.url, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/code/${project.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Code className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    const templateData = {
                      files: template.files,
                      title: template.name
                    };
                    localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
                    router.push('/code/new');
                  }}
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {Object.keys(template.files).length} file{Object.keys(template.files).length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

 