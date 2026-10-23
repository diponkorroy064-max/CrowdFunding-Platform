"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  DollarSign, 
  FileCheck, 
  Layers, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Rocket
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading platform administration data..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Executive Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Overview & Operations
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Monitor platform-wide economics, approve creator initiatives, regulate accounts, and process creator payouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/campaign-approvals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all"
          >
            <FileCheck className="w-4 h-4" />
            Review Campaigns
          </Link>
          <Link
            href="/dashboard/withdrawal-requests"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
          >
            <DollarSign className="w-4 h-4 text-emerald-300" />
            Payout Requests
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Supporters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Supporters</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalSupporters ?? 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Active Backers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        {/* Total Creators */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Creators</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalCreators ?? 0}
            </h3>
            <span className="text-[11px] text-teal-600 font-semibold">Verified Project Leads</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
        </div>

        {/* Total Available Credits in Circulation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Credits</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <Coins className="w-6 h-6 text-emerald-500" />
              {stats?.totalAvailableCredits ?? 0}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">In member wallets</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Total Payments Processed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Payments Processed</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">
              ${Number(stats?.totalPaymentsProcessed ?? 0).toFixed(2)}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Via Stripe gateway</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Admin Modules Quick Launch */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Platform Management Modules
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly navigate to manage users, evaluate pending campaigns, process payouts, and inspect community reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            href="/dashboard/campaign-approvals"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Campaign Approvals
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Approve or reject newly submitted creator campaigns.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/manage-users"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Manage Users
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Promote roles (Admin, Creator, Supporter) and remove abusive accounts.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/manage-campaigns"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Manage Campaigns
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Supervise all platform initiatives and delete fraudulent entries.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/withdrawal-requests"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Withdrawal Requests
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Execute creator credit payouts (20 credits = $1) with Payment Success.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Fraud & Scam Reports
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Inspect reported campaigns and suspend violating projects.
              </p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}
