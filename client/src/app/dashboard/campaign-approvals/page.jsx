"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Coins, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Clock,
  User
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CampaignApprovalsPage() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCampaigns = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/campaigns/pending');
      setPendingCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load pending campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleUpdateStatus = async (id, title, status) => {
    try {
      await apiClient.patch(`/admin/campaigns/${id}/status`, { status });
      Swal.fire({
        title: `Campaign ${status === 'approved' ? 'Approved' : 'Rejected'}!`,
        text: `"${title}" status updated to ${status}. Notification sent to creator.`,
        icon: 'success',
        confirmButtonColor: '#059669',
      });
      fetchPendingCampaigns();
    } catch (err) {
      console.error('Status update error:', err);
      Swal.fire('Error', 'Failed to update campaign status.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching pending campaigns for evaluation..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-emerald-600" />
          Pending Campaign Approvals
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review newly submitted crowdfunding initiatives. Approved projects become publicly discoverable by backers.
        </p>
      </div>

      {/* Campaigns Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {pendingCampaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No campaigns pending approval</h3>
            <p className="text-xs text-slate-400 mt-1">
              All submitted initiatives have been reviewed by the moderation team.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Campaign Info</th>
                  <th className="py-4 px-6 font-bold">Creator</th>
                  <th className="py-4 px-6 font-bold">Category</th>
                  <th className="py-4 px-6 font-bold">Goal</th>
                  <th className="py-4 px-6 font-bold">Deadline</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pendingCampaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80'}
                          alt={camp.campaign_title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-slate-900 block truncate">
                            {camp.campaign_title}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {camp.campaign_story}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{camp.creator_name}</div>
                      <div className="text-[10px] text-slate-400">{camp.creator_email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {camp.category}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {camp.funding_goal} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {camp.deadline}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(camp._id, camp.campaign_title, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(camp._id, camp.campaign_title, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
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
