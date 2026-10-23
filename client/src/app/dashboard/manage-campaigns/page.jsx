"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Coins, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertTriangle 
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/campaigns');
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = (camp) => {
    Swal.fire({
      title: 'Delete Campaign?',
      text: `Are you sure you want to delete "${camp.campaign_title}"? Backer credits will be refunded.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#e11d48',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/admin/campaigns/${camp._id}`);
          Swal.fire('Deleted', 'Campaign has been removed.', 'success');
          fetchCampaigns();
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire('Error', 'Failed to delete campaign.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Fetching platform campaigns..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-600" />
          Manage All Platform Campaigns
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervise all active, pending, and suspended initiatives on the CrowdSpark platform.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6 font-bold">Campaign</th>
                <th className="py-4 px-6 font-bold">Creator</th>
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Raised / Goal</th>
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
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="max-w-xs truncate">
                        <span className="font-bold text-slate-900 block truncate">
                          {camp.campaign_title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Deadline: {camp.deadline}
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
                      {camp.amount_raised || 0} / {camp.funding_goal}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      camp.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : camp.status === 'suspended'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {camp.status || 'pending'}
                    </span>
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
                        onClick={() => handleDelete(camp)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete Campaign"
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
      </div>

    </div>
  );
}
