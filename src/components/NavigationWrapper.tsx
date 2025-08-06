'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function NavigationWrapper() {
  const pathname = usePathname();
  const showNavigation = !pathname.includes('/code') && !pathname.includes('/site');

  if (!showNavigation) {
    return null;
  }

  return <Navigation />;
} 