"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

export default function ReportModalButton({ campaignId, campaignTitle }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire('Notice', 'Please log in to report a campaign.', 'info');
      router.push('/login');
      return;
    }

    if (!reason.trim()) {
      Swal.fire('Required', 'Please explain the reason for reporting this campaign.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/reports', {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        reporter_name: user.displayName || user.name || 'Platform User',
        reporter_email: user.email,
        reason: reason.trim(),
      });

      setIsOpen(false);
      setReason('');
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
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-200"
      >
        <ShieldAlert className="w-4 h-4" />
        Report Campaign
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-lg">
              <ShieldAlert className="w-6 h-6" />
              Report Campaign
            </div>

            <p className="text-xs text-slate-600">
              Help our platform maintain safety and trust. Please explain why you believe "{campaignTitle}" violates guidelines or involves fraud.
            </p>

            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Report
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Misleading claims, suspected plagiarism, counterfeit rewards, abusive content..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Fraud Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
