import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, FolderKanban, Coins, Calendar, User, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const CampaignApprovals = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/campaigns/pending');
      setPendingCampaigns(res.data || []);
    } catch (err) {
      console.warn('Fallback pending campaigns:', err);
      setPendingCampaigns([
        {
          _id: 'pending_c1',
          campaign_title: 'Smart AgTech: Low-Cost Drip Irrigation for Small Farmers',
          category: 'Technology',
          funding_goal: 3500,
          deadline: '2026-11-20',
          creator_name: 'Tariq Rahman',
          creator_email: 'creator@crowdspark.com',
          campaign_story: 'Equipping smallholder farms with solar sensors and drip tubes.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleUpdateStatus = async (camp, newStatus) => {
    const isApprove = newStatus === 'approved';
    const result = await Swal.fire({
      title: isApprove ? 'Approve Campaign?' : 'Reject Campaign?',
      html: `Are you sure you want to <b>${newStatus}</b> "<b>${camp.campaign_title}</b>"?<br/>The creator (${camp.creator_email}) will be notified immediately.`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#10b981' : '#e11d48',
      confirmButtonText: isApprove ? 'Yes, Approve' : 'Yes, Reject'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        await apiClient.patch(`/admin/campaigns/${camp._id}/status`, { status: newStatus });
        Swal.fire({
          icon: 'success',
          title: `Campaign ${newStatus.toUpperCase()}`,
          text: `Status updated and notification sent to creator.`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchPending();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to update campaign status.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Campaign Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review newly submitted creator initiatives. Approved campaigns become visible in Explore Campaigns.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          {pendingCampaigns.length} Awaiting Vetting
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {pendingCampaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No campaigns pending approval</p>
            <p className="text-xs">All creator submissions have been vetted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Creator</th>
                  <th className="py-4 px-6">Goal</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pendingCampaigns.map((camp) => (
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
                    <td className="py-4 px-6 font-bold text-emerald-600">
                      {camp.funding_goal} Credits
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {camp.deadline}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(camp, 'approved')}
                          disabled={actionLoading}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(camp, 'rejected')}
                          disabled={actionLoading}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                        >
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
};

export default CampaignApprovals;
