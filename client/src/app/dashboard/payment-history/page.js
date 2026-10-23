"use client";

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Coins, 
  CreditCard, 
  Calendar, 
  CheckCircle2,
  FolderHeart
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.email) return;
      try {
        const res = await apiClient.get(`/supporter/payments/${user.email}`);
        setPayments(res.data || []);
      } catch (err) {
        console.error('Failed to load payment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Fetching payment records..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-600" />
          Credit Purchase History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete ledger of platform credit top-ups made to your supporter account.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No payment history</h3>
            <p className="text-xs text-slate-400 mt-1">
              You haven't purchased additional credits yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Transaction ID</th>
                  <th className="py-4 px-6 font-bold">Credits Purchased</th>
                  <th className="py-4 px-6 font-bold">Amount Billed</th>
                  <th className="py-4 px-6 font-bold">Payment Method</th>
                  <th className="py-4 px-6 font-bold">Transaction Date</th>
                  <th className="py-4 px-6 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {p.transaction_id}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-emerald-700 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        +{p.credits_purchased} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ${Number(p.amount_paid).toFixed(2)} USD
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {p.payment_method || 'Stripe'}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {p.date || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
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
