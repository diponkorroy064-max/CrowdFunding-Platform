"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Coins, 
  Calendar, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyCampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editReward, setEditReward] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchMyCampaigns = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/creator/campaigns/${user.email}`);
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load creator campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, [user]);

  const openEditModal = (camp) => {
    setEditingCampaign(camp);
    setEditTitle(camp.campaign_title || '');
    setEditStory(camp.campaign_story || '');
    setEditReward(camp.reward_info || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle || !editStory) {
      Swal.fire('Required', 'Title and Story cannot be empty.', 'warning');
      return;
    }

    setUpdating(true);
    try {
      await apiClient.patch(`/campaigns/${editingCampaign._id}`, {
        campaign_title: editTitle,
        campaign_story: editStory,
        reward_info: editReward,
      });

      Swal.fire('Updated!', 'Campaign updated successfully.', 'success');
      setEditingCampaign(null);
      fetchMyCampaigns();
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Failed to update campaign.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (camp) => {
    Swal.fire({
      title: 'Delete Campaign?',
      html: `
        <div class="text-left text-xs space-y-2 text-slate-600">
          <p>Are you sure you want to delete <strong>"${camp.campaign_title}"</strong>?</p>
          <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
            ⚠️ <strong>Auto-Refund Notice:</strong> Deleting this campaign will automatically refund all approved supporter backer credits (${camp.amount_raised || 0} credits) back to their supporter accounts!
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete & Refund Backers',
      confirmButtonColor: '#e11d48',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/campaigns/${camp._id}`);
          Swal.fire('Deleted!', 'Campaign deleted and all supporter credits were refunded successfully.', 'success');
          fetchMyCampaigns();
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire('Error', 'Failed to delete campaign.', 'error');
        }
      }
    });
  };

  const renderStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your campaigns..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            My Launched Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ordered descending by deadline date. Edit details or manage your active community initiatives.
          </p>
        </div>

        <Link
          href="/dashboard/add-campaign"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Campaign
        </Link>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No campaigns launched yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start your first crowdfunding initiative today and begin collecting backer credits.
            </p>
            <Link
              href="/dashboard/add-campaign"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Launch First Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Campaign</th>
                  <th className="py-4 px-6 font-bold">Category</th>
                  <th className="py-4 px-6 font-bold">Raised / Goal</th>
                  <th className="py-4 px-6 font-bold">Deadline</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80'}
                          alt={camp.campaign_title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {camp.campaign_title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Min pledge: {camp.minimum_Contribution || 1} Credits
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {camp.category}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-black text-slate-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {camp.amount_raised || 0} / {camp.funding_goal}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round(((camp.amount_raised || 0) / (camp.funding_goal || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {camp.deadline}
                    </td>
                    <td className="py-4 px-6">
                      {renderStatus(camp.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/campaigns/${camp._id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(camp)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(camp)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Campaign (Refunds Backers)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                Update Campaign Details
              </h3>
              <button
                onClick={() => setEditingCampaign(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Backer Reward Info
                </label>
                <input
                  type="text"
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Campaign Story
                </label>
                <textarea
                  rows={5}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {updating ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
