import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Edit3,
  Trash2,
  Calendar,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  PlusCircle,
  Eye
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const MyCampaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
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
      console.warn('Fallback my campaigns:', err);
      setCampaigns([
        {
          _id: 'my_camp_1',
          campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
          category: 'Community',
          funding_goal: 5000,
          amount_raised: 4500,
          deadline: '2026-12-31',
          status: 'approved',
          campaign_story: 'Solar water pumps for arid villages.',
          reward_info: 'Backer certificate and telemetry updates.'
        },
        {
          _id: 'my_camp_2',
          campaign_title: 'Smart AgTech: Low-Cost Drip Irrigation',
          category: 'Technology',
          funding_goal: 3500,
          amount_raised: 0,
          deadline: '2026-11-30',
          status: 'pending',
          campaign_story: 'Drip irrigation for local farms.',
          reward_info: 'Custom harvest reports.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, [user?.email]);

  // Open Update Modal
  const handleOpenUpdate = (camp) => {
    setEditingCampaign(camp);
    setEditTitle(camp.campaign_title || '');
    setEditStory(camp.campaign_story || '');
    setEditReward(camp.reward_info || '');
    setUpdateModalOpen(true);
  };

  // Submit Update
  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editingCampaign?._id) return;

    setUpdating(true);
    try {
      await apiClient.patch(`/campaigns/${editingCampaign._id}`, {
        campaign_title: editTitle,
        campaign_story: editStory,
        reward_info: editReward
      });

      Swal.fire({
        icon: 'success',
        title: 'Campaign Updated!',
        timer: 1500,
        showConfirmButton: false
      });

      setUpdateModalOpen(false);
      fetchMyCampaigns();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update campaign.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Campaign (Refunds all approved supporters their credits!)
  const handleDelete = async (camp) => {
    const result = await Swal.fire({
      title: 'Delete Campaign?',
      html: `Are you sure you want to delete <b>"${camp.campaign_title}"</b>?<br/><br/><span class="text-xs text-rose-600 font-bold">CRITICAL: Deleting this campaign will automatically refund all approved supporters their contributed credits!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete & Refund Backers'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/campaigns/${camp._id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted & Refunded',
          text: 'Campaign removed and all backer credits successfully refunded.',
          confirmButtonColor: '#10b981'
        });
        fetchMyCampaigns();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete campaign.', 'error');
      }
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Admin Approval
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Campaigns
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Campaigns you have created, sorted in descending order by deadline.
          </p>
        </div>

        <Link
          to="/dashboard/add-campaign"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No campaigns launched yet.</p>
            <Link
              to="/dashboard/add-campaign"
              className="inline-block text-xs font-bold text-blue-600 hover:underline"
            >
              Create your first campaign!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Raised / Goal</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                      <span className="font-bold text-emerald-600">{camp.amount_raised || 0}</span>
                      <span className="text-slate-400"> / {camp.funding_goal} Credits</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">
                      {camp.deadline}
                    </td>
                    <td className="py-4 px-6">
                      {renderStatus(camp.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Update Button */}
                        <button
                          onClick={() => handleOpenUpdate(camp)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                          title="Update Campaign"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button (with Supporter Refund logic) */}
                        <button
                          onClick={() => handleDelete(camp)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Campaign & Refund Backers"
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

      {/* Update Campaign Modal (Page 7 Requirement) */}
      {updateModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Update Campaign</h3>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campaign Story
                </label>
                <textarea
                  required
                  rows={4}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reward Info
                </label>
                <input
                  type="text"
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyCampaigns;
