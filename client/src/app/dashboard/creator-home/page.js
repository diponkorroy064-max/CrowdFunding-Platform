"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Coins, 
  Clock, 
  Layers, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  PlusCircle, 
  Sparkles,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CreatorHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreatorData = async () => {
    if (!user?.email) return;
    try {
      const [statsRes, pendingRes] = await Promise.all([
        apiClient.get(`/creator/stats/${user.email}`),
        apiClient.get(`/creator/contributions/${user.email}`),
      ]);
      setStats(statsRes.data);
      setPendingReviews(pendingRes.data || []);
    } catch (err) {
      console.error('Failed to load creator data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, [user]);

  const handleApprove = async (id, title, amount) => {
    try {
      await apiClient.patch(`/creator/contributions/${id}/approve`);
      Swal.fire({
        title: 'Contribution Approved!',
        text: `Successfully approved pledge of ${amount} credits to "${title}". Raised amount updated!`,
        icon: 'success',
        confirmButtonColor: '#059669',
      });
      fetchCreatorData();
    } catch (err) {
      console.error('Approve error:', err);
      Swal.fire('Error', 'Failed to approve contribution.', 'error');
    }
  };

  const handleReject = async (id, title, amount, supporterEmail) => {
    Swal.fire({
      title: 'Reject & Refund Contribution?',
      text: `Rejecting this pledge will immediately refund ${amount} credits back to ${supporterEmail}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject & Refund',
      confirmButtonColor: '#e11d48',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.patch(`/creator/contributions/${id}/reject`);
          Swal.fire('Refunded', `Pledge of ${amount} credits was refunded to supporter.`, 'success');
          fetchCreatorData();
        } catch (err) {
          console.error('Reject error:', err);
          Swal.fire('Error', 'Failed to reject contribution.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading creator operations..." />;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-teal-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Creator Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.displayName || 'Creator'}!
          </h1>
          <p className="mt-1 text-sm text-teal-100 max-w-xl">
            Manage your campaigns, review backer pledges, and withdraw raised funding into real-world currency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/add-campaign"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Launch Campaign
          </Link>
          <Link
            href="/dashboard/withdrawals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
          >
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <span>Withdraw Payout</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Raised Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Credits Raised</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <Coins className="w-6 h-6 text-emerald-500" />
              {stats?.totalAmountRaised ?? 0}
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold">20 Credits = $1 USD Payout</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Available to Withdraw */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available to Withdraw</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.availableCredits ?? 0} <span className="text-sm font-semibold text-slate-400">Credits</span>
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">
              ≈ ${((stats?.availableCredits ?? 0) / 20).toFixed(2)} USD
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Campaigns</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.activeCampaigns ?? 0} / {stats?.totalCampaigns ?? 0}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Ongoing deadlines</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Pledges to Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contributions to Review</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {pendingReviews.length}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium">Requires your decision</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Contributions To Review Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Contributions To Review
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review backer pledges. Approving adds credits to your campaign goal. Rejecting automatically refunds the supporter.
            </p>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            {pendingReviews.length} Pending
          </span>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no pending backer contributions waiting for your review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Campaign</th>
                  <th className="py-4 px-6 font-bold">Supporter</th>
                  <th className="py-4 px-6 font-bold">Pledge Amount</th>
                  <th className="py-4 px-6 font-bold">Date</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pendingReviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                      {item.campaign_title}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{item.Supporter_name}</div>
                      <div className="text-[10px] text-slate-400">{item.Supporter_email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-emerald-700 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {item.Contribution_amount} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {item.current_date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(item._id, item.campaign_title, item.Contribution_amount)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id, item.campaign_title, item.Contribution_amount, item.Supporter_email)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject & Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
