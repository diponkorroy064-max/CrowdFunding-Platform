import React from 'react';
import { Sparkles } from 'lucide-react';
import RegisterFormClient from '@/components/auth/RegisterFormClient';

export const metadata = {
  title: 'Create Account | CrowdSpark',
  description: 'Join CrowdSpark to pledge platform credits or launch impactful crowdfunding campaigns. Receive bonus credits upon registration.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Server-Side Rendered Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className="inline-flex w-16 h-16 rounded-3xl bg-white p-2 border border-slate-200/80 items-center justify-center shadow-lg shadow-emerald-500/10 mb-4">
          <img
            src="/logo.png"
            alt="CrowdSpark Logo"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Create your <span className="text-emerald-600">CrowdSpark</span> Account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Join our decentralized crowdfunding community with <span className="font-semibold text-emerald-700">Better Auth</span>
        </p>
      </div>

      {/* Interactive Registration Island */}
      <RegisterFormClient />
    </div>
  );
}
