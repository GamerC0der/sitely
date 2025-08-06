'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Sitely</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <a href="#" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 relative group">
            Blog
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-8 transition-all duration-200"></div>
          </a>
          <a href="#" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 relative group">
            Docs
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-8 transition-all duration-200"></div>
          </a>
          <a href="#" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 relative group">
            About
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-8 transition-all duration-200"></div>
          </a>
          <a href="#" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 relative group">
            Auth
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-8 transition-all duration-200"></div>
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/auth/signup?mode=signin" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup?mode=signup">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Sign up for free
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 