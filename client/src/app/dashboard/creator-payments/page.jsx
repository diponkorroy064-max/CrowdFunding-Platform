"use client";

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Coins, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  Building
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CreatorPaymentsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        const res = await apiClient.get(`/creator/withdrawals/${user.email}`);
        setHistory(res.data || []);
      } catch (err) {
        console.error('Failed to load creator payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Fetching payout records..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-600" />
          Creator Payout History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed ledger of all withdrawal disbursements sent to your banking destination.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No payout records found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Once you reach the 200 credit threshold, submit a withdrawal request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Payout Date</th>
                  <th className="py-4 px-6 font-bold">Credits Withdrawn</th>
                  <th className="py-4 px-6 font-bold">USD Disbursed</th>
                  <th className="py-4 px-6 font-bold">Payout Channel</th>
                  <th className="py-4 px-6 font-bold">Destination Account</th>
                  <th className="py-4 px-6 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 text-slate-500">{item.withdraw_date}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {item.withdrawal_credit} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-700">
                      ${Number(item.withdrawal_amount).toFixed(2)} USD
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.payment_system}</td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">{item.account_number}</td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      )}
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
