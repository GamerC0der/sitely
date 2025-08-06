'use client';

import { SignIn, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SigninPage() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      generateTokenAndRedirect();
    }
  }, [isSignedIn]);

  const generateTokenAndRedirect = async () => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        window.location.href = `/code?token=${data.token}`;
      } else {
        window.location.href = '/code';
      }
    } catch (error) {
      console.error('Error generating token:', error);
      window.location.href = '/code';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <SignIn 
        signUpUrl="/auth/signup"
      />
    </div>
  );
} 