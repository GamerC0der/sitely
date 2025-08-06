'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

interface CustomUserMenuProps {
  afterSignOutUrl?: string;
}

export default function CustomUserMenu({ afterSignOutUrl = '/' }: CustomUserMenuProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isLoaded || !user) return null;

  const handleSignOut = async () => {
    await signOut();
    window.location.href = afterSignOutUrl;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || 'User'}
          className="w-full h-full object-cover"
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={user.imageUrl}
                alt={user.fullName || 'User'}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{user.fullName || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-all duration-150 focus:outline-none focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 