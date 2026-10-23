"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Building,
  User,
  ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function WithdrawalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/withdrawals/pending');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load pending withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handlePaymentSuccess = async (id, creatorName, amountDollars, credits) => {
    Swal.fire({
      title: 'Confirm Payment Success?',
      text: `Mark withdrawal of $${amountDollars} (${credits} credits) for ${creatorName} as successfully disbursed?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm Payment Success',
      confirmButtonColor: '#059669',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.patch(`/admin/withdrawals/${id}/success`);
          Swal.fire({
            title: 'Payment Disbursed!',
            text: `Successfully processed withdrawal. Notification sent to ${creatorName}.`,
            icon: 'success',
            confirmButtonColor: '#059669',
          });
          fetchWithdrawalRequests();
        } catch (err) {
          console.error('Payment error:', err);
          Swal.fire('Error', 'Failed to approve withdrawal.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Fetching pending creator withdrawal requests..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          Pending Creator Withdrawal Requests
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review and execute disbursements for creator funding withdrawals (20 Credits = $1.00 USD).
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No pending payout requests</h3>
            <p className="text-xs text-slate-400 mt-1">
              All creator withdrawal applications have been fulfilled.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Creator</th>
                  <th className="py-4 px-6 font-bold">Credits Withdrawn</th>
                  <th className="py-4 px-6 font-bold">Disbursement ($)</th>
                  <th className="py-4 px-6 font-bold">Payment Method</th>
                  <th className="py-4 px-6 font-bold">Destination Account</th>
                  <th className="py-4 px-6 font-bold">Request Date</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{req.creator_name}</div>
                      <div className="text-[10px] text-slate-400">{req.creator_email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {req.withdrawal_credit} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-700 text-sm">
                      ${Number(req.withdrawal_amount).toFixed(2)} USD
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {req.payment_system}
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                      {req.account_number}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {req.withdraw_date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handlePaymentSuccess(req._id, req.creator_name, req.withdrawal_amount, req.withdrawal_credit)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1 ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Payment Success</span>
                      </button>
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
