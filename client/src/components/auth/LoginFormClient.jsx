"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';

export default function LoginFormClient() {
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

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">

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
  );
}
