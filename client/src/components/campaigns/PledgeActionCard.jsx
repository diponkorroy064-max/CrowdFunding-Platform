"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coins, Clock, Heart, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

export default function PledgeActionCard({ campaign }) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [pledgeAmount, setPledgeAmount] = useState(campaign?.minimum_Contribution || 10);
  const [submittingPledge, setSubmittingPledge] = useState(false);

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const progress = Math.min(100, Math.round(((campaign.amount_raised || 0) / (campaign.funding_goal || 1)) * 100));
  const daysLeft = calculateDaysLeft(campaign.deadline);

  const handlePledge = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Please log in to pledge platform credits to this campaign.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#059669',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    if (user.role === 'creator' && user.email === campaign.creator_email) {
      Swal.fire('Notice', 'You cannot pledge credits to your own campaign!', 'warning');
      return;
    }

    const amount = Number(pledgeAmount);
    if (!amount || amount < (campaign.minimum_Contribution || 1)) {
      Swal.fire('Minimum Pledge Required', `The minimum pledge for this campaign is ${campaign.minimum_Contribution || 1} credits.`, 'warning');
      return;
    }

    if ((user.credits ?? 0) < amount) {
      Swal.fire({
        title: 'Insufficient Credits',
        text: `You have ${user.credits ?? 0} credits available, but this pledge requires ${amount} credits. Would you like to buy more credits?`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Buy Credits ($1 = 10 Credits)',
        confirmButtonColor: '#059669',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/dashboard/purchase-credit');
        }
      });
      return;
    }

    setSubmittingPledge(true);
    try {
      await apiClient.post('/contributions', {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        Contribution_amount: amount,
        Supporter_email: user.email,
        Supporter_name: user.displayName || user.name || 'Passionate Supporter',
        creator_name: campaign.creator_name,
        creator_email: campaign.creator_email,
      });

      await refreshUser();

      Swal.fire({
        title: 'Pledge Submitted!',
        text: `You have successfully pledged ${amount} credits to "${campaign.campaign_title}". The creator will review and approve your contribution.`,
        icon: 'success',
        confirmButtonColor: '#059669',
      });
    } catch (err) {
      console.error('Pledge error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to submit pledge. Please try again.', 'error');
    } finally {
      setSubmittingPledge(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-lg space-y-6">
      
      {/* Progress Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-3xl font-black text-slate-900 flex items-center gap-1.5">
              <Coins className="w-7 h-7 text-emerald-500" />
              {campaign.amount_raised || 0}
            </span>
            <span className="text-xs font-semibold text-slate-500">Credits Raised</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-700">{campaign.funding_goal}</span>
            <span className="text-xs font-semibold text-slate-400 block">Goal Credits</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
          <span>{progress}% funded</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            {daysLeft} days remaining
          </span>
        </div>
      </div>

      {/* Supporter Balance Status */}
      {user && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Your Balance:</span>
            <span className="font-extrabold text-emerald-800 text-sm flex items-center gap-1">
              <Coins className="w-4 h-4 text-emerald-600" />
              {user.credits ?? 0} Credits
            </span>
          </div>
          <Link
            href="/dashboard/purchase-credit"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
          >
            + Top Up
          </Link>
        </div>
      )}

      {/* Pledge Form */}
      <form onSubmit={handlePledge} className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Pledge Credits (Min: {campaign.minimum_Contribution || 1} Credits)
          </label>
          <div className="relative">
            <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min={campaign.minimum_Contribution || 1}
              value={pledgeAmount}
              onChange={(e) => setPledgeAmount(e.target.value)}
              placeholder={`Enter at least ${campaign.minimum_Contribution || 1}`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm bg-slate-50"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submittingPledge}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Heart className="w-4 h-4 fill-white" />
          {submittingPledge ? 'Processing Pledge...' : 'Pledge Credits Now'}
        </button>
      </form>

      <div className="text-[11px] text-slate-500 space-y-1.5 pt-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Credits are held safely until creator reviews the pledge.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Immediate auto-refund if creator rejects or deletes campaign.</span>
        </div>
      </div>

    </div>
  );
}
