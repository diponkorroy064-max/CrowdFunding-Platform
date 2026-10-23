"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Coins, 
  Calendar, 
  User, 
  ShieldAlert, 
  Heart, 
  Gift, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Send,
  Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [submittingPledge, setSubmittingPledge] = useState(false);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await apiClient.get(`/campaigns/${id}`);
        setCampaign(res.data);
        if (res.data?.minimum_Contribution) {
          setPledgeAmount(res.data.minimum_Contribution);
        }
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        Swal.fire('Error', 'Campaign not found or invalid link.', 'error');
        router.push('/campaigns');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id, router]);

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

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

  const handleReport = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire('Notice', 'Please log in to report a campaign.', 'info');
      router.push('/login');
      return;
    }

    if (!reportReason.trim()) {
      Swal.fire('Required', 'Please explain the reason for reporting this campaign.', 'warning');
      return;
    }

    setSubmittingReport(true);
    try {
      await apiClient.post('/reports', {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reporter_name: user.displayName || user.name || 'Platform User',
        reporter_email: user.email,
        reason: reportReason.trim(),
      });

      setIsReportModalOpen(false);
      setReportReason('');
      Swal.fire({
        title: 'Report Submitted',
        text: 'Thank you for protecting our community. The admin team will investigate this campaign immediately.',
        icon: 'success',
        confirmButtonColor: '#059669',
      });
    } catch (err) {
      console.error('Report error:', err);
      Swal.fire('Error', 'Failed to submit fraud report. Please try again.', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading campaign details..." />;
  }

  if (!campaign) {
    return null;
  }

  const progress = Math.min(100, Math.round(((campaign.amount_raised || 0) / (campaign.funding_goal || 1)) * 100));
  const daysLeft = calculateDaysLeft(campaign.deadline);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Campaigns
          </Link>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-200"
          >
            <ShieldAlert className="w-4 h-4" />
            Report Campaign
          </button>
        </div>

        {/* Main Grid: Details + Pledge Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image, Story, Rewards (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Banner Image & Tags */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-md">
              <img
                src={campaign.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'}
                alt={campaign.campaign_title}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide bg-white/95 backdrop-blur-md text-emerald-800 shadow">
                  {campaign.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/85 backdrop-blur-md text-white shadow">
                  {daysLeft} Days Left
                </span>
              </div>
            </div>

            {/* Campaign Headline */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {campaign.campaign_title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Creator</span>
                    <span className="font-bold text-slate-800">{campaign.creator_name || 'Verified Creator'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Campaign Deadline</span>
                    <span className="font-bold text-slate-800">{campaign.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Story */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                The Story & Purpose
              </h2>
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {campaign.campaign_story}
              </div>
            </div>

            {/* Reward Info */}
            {campaign.reward_info && (
              <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-black text-emerald-900">Supporter Backer Perks</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {campaign.reward_info}
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Funding Status & Pledge Action Box (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
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

          </div>

        </div>

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-lg">
                <ShieldAlert className="w-6 h-6" />
                Report Campaign
              </div>

              <p className="text-xs text-slate-600">
                Help our platform maintain safety and trust. Please explain why you believe "{campaign.campaign_title}" violates guidelines or involves fraud.
              </p>

              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Report
                  </label>
                  <textarea
                    rows={4}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Misleading claims, suspected plagiarism, counterfeit rewards, abusive content..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-slate-800"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Fraud Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
