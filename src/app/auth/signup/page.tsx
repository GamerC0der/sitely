'use client';

import { SignUp } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <SignUp 
        signInUrl="/auth/signin"
        redirectUrl="/code"
      />
    </div>
  );
} 