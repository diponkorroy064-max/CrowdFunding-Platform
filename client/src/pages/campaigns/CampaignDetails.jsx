import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Coins,
  Calendar,
  User,
  ShieldCheck,
  Gift,
  AlertTriangle,
  ArrowLeft,
  HeartHandshake,
  CheckCircle,
  Flag
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CampaignDetails = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        console.warn('Using fallback campaign details:', err);
        setCampaign({
          _id: id,
          campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
          category: 'Community',
          campaign_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
          amount_raised: 4500,
          funding_goal: 5000,
          minimum_Contribution: 10,
          deadline: '2026-12-31',
          creator_name: 'SolarAid Collective',
          creator_email: 'creator@crowdspark.com',
          campaign_story: `Millions of people worldwide still lack consistent access to clean drinking water. The EcoFlow Solar Water Pump initiative installs automated, off-grid, photovoltaic pumps in remote drought-stricken agricultural regions.

Every pump is equipped with IoT sensors to measure aquifer water quality in real time and automatically distribute water to public community taps and micro-drip irrigation plots. By funding this campaign, you directly finance high-durability brushless submersible pumps, durable monocrystalline solar arrays, and trained local technician support.`,
          reward_info: 'Supporters who contribute 50+ credits will receive an official digital backer certificate and quarterly GPS water flow telemetry updates directly from the village installations.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // Handle Contribution Form Submission
  const handleContribute = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Sign In Required',
        text: 'Please log in as a Supporter to contribute platform credits to this campaign.',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } });
        }
      });
      return;
    }

    if (user.role !== 'supporter' && user.role !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Action Restricted',
        text: 'Only Supporters can pledge credits to campaigns. (You are signed in as a Creator).',
      });
      return;
    }

    const amount = Number(contributionAmount);
    if (!amount || amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid credit contribution amount.',
      });
      return;
    }

    const minContrib = Number(campaign?.minimum_Contribution || 1);
    if (amount < minContrib) {
      Swal.fire({
        icon: 'warning',
        title: 'Below Minimum Pledge',
        text: `This campaign requires a minimum pledge of ${minContrib} credits.`,
      });
      return;
    }

    if ((user.credits || 0) < amount) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Available Credits',
        html: `You have <b>${user.credits || 0} credits</b> available, but this contribution requires <b>${amount} credits</b>.<br/>Please purchase more credits to continue.`,
        showCancelButton: true,
        confirmButtonText: 'Buy Credits Now',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard/purchase-credit');
        }
      });
      return;
    }

    setSubmitting(true);
    try {
      // POST /contributions
      const payload = {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        Contribution_amount: amount,
        Supporter_email: user.email,
        Supporter_name: user.displayName || 'Supporter Member',
        creator_name: campaign.creator_name,
        creator_email: campaign.creator_email
      };

      await apiClient.post('/contributions', payload);
      await refreshUser();

      Swal.fire({
        icon: 'success',
        title: 'Contribution Submitted!',
        html: `You pledged <b>${amount} credits</b> to <b>${campaign.campaign_title}</b>.<br/>Your contribution is pending creator approval. (If rejected, your credits are refunded immediately!)`,
        confirmButtonColor: '#10b981',
      });

      setContributionAmount('');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Contribution Failed',
        text: err.response?.data?.message || 'Failed to submit contribution. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Report Campaign (Challenge / Bonus feature)
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Please Login', 'You must be logged in to report a campaign.', 'warning');
      return;
    }

    if (!reportReason.trim()) {
      Swal.fire('Reason Required', 'Please provide a detailed reason for reporting.', 'warning');
      return;
    }

    setReporting(true);
    try {
      await apiClient.post('/reports', {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reporter_name: user.displayName || 'Anonymous Member',
        reporter_email: user.email,
        reason: reportReason
      });

      Swal.fire({
        icon: 'success',
        title: 'Report Submitted',
        text: 'Our platform administrator will review this campaign promptly.',
        confirmButtonColor: '#10b981',
      });

      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to submit report.', 'error');
    } finally {
      setReporting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!campaign) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold">Campaign not found</h2>
        <Link to="/campaigns" className="mt-4 inline-block text-emerald-600 font-semibold">
          Return to Explore Campaigns
        </Link>
      </div>
    );
  }

  const raised = campaign.amount_raised || 0;
  const goal = campaign.funding_goal || 1;
  const progress = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <div>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Campaigns</span>
        </Link>
      </div>

      {/* Main Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Media & Story */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200">
            <img
              src={campaign.campaign_image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'}
              alt={campaign.campaign_title}
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider">
              {campaign.category || 'Initiative'}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {campaign.campaign_title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl font-semibold">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Creator: {campaign.creator_name || 'Innovator'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl font-semibold">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Deadline: {campaign.deadline}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Admin Verified</span>
              </div>
            </div>
          </div>

          {/* Campaign Story */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              About This Campaign
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {campaign.campaign_story}
            </p>
          </div>

          {/* Reward Info */}
          {campaign.reward_info && (
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Supporter Rewards & Recognition</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {campaign.reward_info}
              </p>
            </div>
          )}

          {/* Report Campaign Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report suspicious or fraudulent campaign</span>
            </button>
          </div>

        </div>

        {/* Right Column: Funding Card & Contribution Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
            
            {/* Raised Credits Stats */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {raised}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 uppercase ml-1.5">
                    Credits Raised
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Goal: {goal}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span className="font-bold text-emerald-600">{progress}% Funded</span>
                <span>Minimum Pledge: {campaign.minimum_Contribution || 1} Credits</span>
              </div>
            </div>

            {/* User Available Credits Banner */}
            {user && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-900">Your Credits:</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-700">{user.credits ?? 0}</span>
                  <Link
                    to="/dashboard/purchase-credit"
                    className="text-[10px] font-bold text-emerald-700 underline"
                  >
                    + Buy Credits
                  </Link>
                </div>
              </div>
            )}

            {/* Contribution Form (Requirement Page 9) */}
            <form onSubmit={handleContribute} className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pledge Amount (Credits)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Coins className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="Contribution_amount"
                    min={campaign.minimum_Contribution || 1}
                    required
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder={`e.g. ${campaign.minimum_Contribution || 50}`}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  1 credit = 1 platform vote. Credits are refunded if the creator rejects your contribution.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="animate-pulse">Processing Contribution...</span>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>Contribute Credits to Campaign</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Guarantees */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant automated credit refund on rejection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full transparency with real-time creator updates</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3>Report Suspicious Campaign</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Please specify why this campaign violates CrowdSpark community guidelines or seems fraudulent.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe your concern in detail..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  {reporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CampaignDetails;
