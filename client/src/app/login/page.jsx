"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire('Missing Information', 'Please provide both email and password.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await loginUser(email, password);
      Swal.fire({
        title: 'Welcome Back!',
        text: `Signed in successfully as ${loggedUser.displayName || loggedUser.name || email}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      // Role-based routing
      if (loggedUser.role === 'admin') {
        router.push('/dashboard/admin-home');
      } else if (loggedUser.role === 'creator') {
        router.push('/dashboard/creator-home');
      } else {
        router.push('/dashboard/supporter-home');
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire('Login Failed', err.message || 'Invalid credentials. Please verify your email & password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome to <span className="text-emerald-600">CrowdSpark</span>
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to your account powered by <span className="font-semibold text-emerald-700">Better Auth</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        {/* Evaluator 1-Click Fill Demo Credentials */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Evaluator 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@crowdspark.org', 'AdminPass123!')}
              className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('creator@solaraid.org', 'CreatorPass123!')}
              className="px-2.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-teal-200" />
              <span>Creator</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('supporter@innovate.org', 'SupporterPass123!')}
              className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-200" />
              <span>Supporter</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In with Better Auth'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600 pt-4 border-t border-slate-100">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 underline">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
