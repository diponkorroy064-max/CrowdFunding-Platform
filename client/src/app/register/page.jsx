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
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Create your <span className="text-emerald-600">CrowdSpark</span> Account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Join our decentralized crowdfunding community with <span className="font-semibold text-emerald-700">Better Auth</span> (Server-Side Rendered)
        </p>
      </div>

      {/* Interactive Registration Island */}
      <RegisterFormClient />
    </div>
  );
}
