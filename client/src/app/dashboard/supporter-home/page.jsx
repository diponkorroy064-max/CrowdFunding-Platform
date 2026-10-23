"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Coins, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  CreditCard, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function SupporterHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupporterData = async () => {
      if (!user?.email) return;
      try {
        const [statsRes, approvedRes] = await Promise.all([
          apiClient.get(`/supporter/stats/${user.email}`),
          apiClient.get(`/supporter/contributions/approved/${user.email}`),
        ]);
        setStats(statsRes.data);
        setApprovedContributions(approvedRes.data || []);
      } catch (err) {
        console.error('Failed to load supporter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupporterData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading supporter metrics..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Supporter Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.displayName || 'Supporter'}!
          </h1>
          <p className="mt-1 text-sm text-emerald-100 max-w-xl">
            Track your pledge impact, view approved contributions, and manage your platform credits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/purchase-credit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black shadow-md transition-all"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Buy Credits
          </Link>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-white text-xs font-bold transition-all border border-emerald-400/40"
          >
            <span>Explore Causes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Available Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Balance</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <Coins className="w-6 h-6 text-emerald-500" />
              {user?.credits ?? 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">10 Credits = $1 USD</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Total Contributed Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pledged</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalContributedCredits ?? 0} <span className="text-sm font-semibold text-slate-400">Credits</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">To verified campaigns</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        {/* Total Pledges Made */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pledges</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalContributions ?? 0}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Lifetime pledges</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.pendingContributions ?? 0}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting creator action</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Approved Contributions Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Approved Contributions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Campaigns that accepted your pledge credits and added them to their goals.
            </p>
          </div>
          <Link
            href="/dashboard/my-contributions"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            View All Pledges &rarr;
          </Link>
        </div>

        {approvedContributions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No approved contributions yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Explore live campaigns and pledge your bonus credits to get started!
            </p>
            <Link
              href="/campaigns"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Explore Campaigns
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {approvedContributions.map((item) => (
              <div key={item._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Approved
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.campaign_title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>Creator: <strong className="text-slate-700">{item.creator_name}</strong></span>
                    <span>Date: {item.current_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 flex items-center gap-1 justify-end">
                      <Coins className="w-4 h-4 text-emerald-500" />
                      {item.Contribution_amount} Credits
                    </span>
                    <span className="text-[10px] text-slate-400">Contributed</span>
                  </div>

                  <Link
                    href={`/campaigns/${item.campaign_id}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="View Campaign"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
