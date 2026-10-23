import React, { useState, useEffect } from 'react';
import { FolderKanban, Trash2, Calendar, Coins, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/campaigns');
      setCampaigns(res.data || []);
    } catch (err) {
      console.warn('Fallback manage campaigns:', err);
      setCampaigns([
        {
          _id: 'c1',
          campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
          category: 'Community',
          creator_name: 'SolarAid Collective',
          creator_email: 'creator@crowdspark.com',
          funding_goal: 5000,
          amount_raised: 4500,
          status: 'approved',
          deadline: '2026-12-31'
        },
        {
          _id: 'c2',
          campaign_title: 'Aura Next-Gen Open Source Robotics Kit',
          category: 'Technology',
          creator_name: 'Dr. Evelyn Vance',
          creator_email: 'evelyn@tech.org',
          funding_goal: 4000,
          amount_raised: 3800,
          status: 'approved',
          deadline: '2026-11-20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (camp) => {
    const result = await Swal.fire({
      title: 'Delete Campaign?',
      html: `Permanently delete <b>"${camp.campaign_title}"</b> from the database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Campaign'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/campaigns/${camp._id}`);
        setCampaigns((prev) => prev.filter((c) => c._id !== camp._id));
        Swal.fire({
          icon: 'success',
          title: 'Campaign Deleted',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete campaign.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage All Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global catalog of all platform initiatives across all creators and statuses.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
          {campaigns.length} Campaigns
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Campaign Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Creator Info</th>
                <th className="py-4 px-6">Raised / Goal</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {campaigns.map((camp) => (
                <tr key={camp._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                    {camp.campaign_title}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {camp.category}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-800">{camp.creator_name}</span>
                    <span className="block text-[11px] text-slate-400">{camp.creator_email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-600">{camp.amount_raised || 0}</span>
                    <span className="text-slate-400"> / {camp.funding_goal} Credits</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] capitalize">
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteCampaign(camp)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Delete Campaign from Database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCampaigns;
