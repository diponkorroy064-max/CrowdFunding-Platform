import React from 'react';
import { Sparkles } from 'lucide-react';
import LoginFormClient from '@/components/auth/LoginFormClient';

export const metadata = {
  title: 'Sign In | CrowdSpark',
  description: 'Sign in to your CrowdSpark account with Better Auth to fund projects or launch your campaigns.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Server-Side Rendered Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome to <span className="text-emerald-600">CrowdSpark</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to your account powered by <span className="font-semibold text-emerald-700">Better Auth</span> (Server-Side Rendered)
        </p>
      </div>

      {/* Interactive Login Island */}
      <LoginFormClient />
    </div>
  );
}
