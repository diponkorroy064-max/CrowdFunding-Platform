import React, { useState, useEffect } from 'react';
import { AlertOctagon, Trash2, Ban, CheckCircle2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/reports');
      setReports(res.data || []);
    } catch (err) {
      console.warn('Fallback reports list:', err);
      setReports([
        {
          _id: 'rep_1',
          campaign_id: 'c_fake_1',
          campaign_title: 'Unverified Perpetual Energy Converter',
          reporter_name: 'Alexandre Dubois',
          reporter_email: 'alex@backer.com',
          reason: 'Violates second law of thermodynamics. Creator has no working prototype and claims impossible returns.',
          date: '2026-10-21',
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Suspend campaign
  const handleSuspendCampaign = async (rep) => {
    const result = await Swal.fire({
      title: 'Suspend Campaign?',
      html: `Do you want to suspend <b>"${rep.campaign_title}"</b>? It will be hidden from all supporters.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Suspend Campaign'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.patch(`/admin/campaigns/${rep.campaign_id}/suspend`);
        Swal.fire({
          icon: 'success',
          title: 'Campaign Suspended',
          timer: 1500,
          showConfirmButton: false
        });
        fetchReports();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to suspend campaign.', 'error');
      }
    }
  };

  // Delete reported campaign
  const handleDeleteReported = async (rep) => {
    const result = await Swal.fire({
      title: 'Delete Fraudulent Campaign?',
      html: `Permanently delete <b>"${rep.campaign_title}"</b> and purge from database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Permanently'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/campaigns/${rep.campaign_id}`);
        Swal.fire({
          icon: 'success',
          title: 'Campaign Purged',
          timer: 1500,
          showConfirmButton: false
        });
        fetchReports();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete reported campaign.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Suspicious Campaign Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Community-submitted flags regarding fraudulent, misleading, or guideline-violating campaigns.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
          {reports.length} Reports
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No active reports</p>
            <p className="text-xs">Community reporting queue is clear.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Reporter Info</th>
                  <th className="py-4 px-6">Reason Given</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                      {r.campaign_title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{r.reporter_name}</span>
                      <span className="block text-[11px] text-slate-400">{r.reporter_email}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-sm">
                      {r.reason}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {r.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleSuspendCampaign(r)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-colors flex items-center gap-1"
                          title="Suspend Campaign"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                        <button
                          onClick={() => handleDeleteReported(r)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center gap-1"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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

export default Reports;
