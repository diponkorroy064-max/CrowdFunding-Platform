"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Ban
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function FraudReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/reports');
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load fraud reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSuspendCampaign = (campaignId, campaignTitle) => {
    Swal.fire({
      title: 'Suspend Campaign?',
      text: `Are you sure you want to suspend "${campaignTitle}"? It will be removed from explore searches immediately.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Suspend Campaign',
      confirmButtonColor: '#e11d48',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.patch(`/admin/campaigns/${campaignId}/suspend`);
          Swal.fire('Suspended', `"${campaignTitle}" has been suspended.`, 'success');
          fetchReports();
        } catch (err) {
          console.error('Suspend error:', err);
          Swal.fire('Error', 'Failed to suspend campaign.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Fetching submitted fraud reports..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          Fraud & Integrity Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review community reports regarding suspicious claims, rule infractions, or counterfeit projects.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Clean platform slate!</h3>
            <p className="text-xs text-slate-400 mt-1">
              There are currently no unresolved fraud reports.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Reported Campaign</th>
                  <th className="py-4 px-6 font-bold">Reason Provided</th>
                  <th className="py-4 px-6 font-bold">Reporter</th>
                  <th className="py-4 px-6 font-bold">Date</th>
                  <th className="py-4 px-6 font-bold text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block max-w-xs truncate">
                        {r.campaign_title}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <p className="text-slate-700 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100/80 text-[11px] leading-relaxed">
                        {r.reason}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{r.reporter_name}</div>
                      <div className="text-[10px] text-slate-400">{r.reporter_email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {r.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/campaigns/${r.campaign_id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Inspect Campaign"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleSuspendCampaign(r.campaign_id, r.campaign_title)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                          title="Suspend Campaign"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
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
