"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const PAYMENT_SYSTEMS = [
  'Bank Wire Transfer (ACH / SWIFT)',
  'PayPal Account',
  'Stripe Express Connect',
  'Wise International Transfer'
];

export default function CreatorWithdrawalsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [creditsToWithdraw, setCreditsToWithdraw] = useState('200');
  const [paymentSystem, setPaymentSystem] = useState(PAYMENT_SYSTEMS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawalData = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const [statsRes, withdrawalsRes] = await Promise.all([
        apiClient.get(`/creator/stats/${user.email}`),
        apiClient.get(`/creator/withdrawals/${user.email}`),
      ]);
      setStats(statsRes.data);
      setWithdrawals(withdrawalsRes.data || []);
    } catch (err) {
      console.error('Failed to load withdrawal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalData();
  }, [user]);

  const creditNum = Number(creditsToWithdraw) || 0;
  const dollarAmount = (creditNum / 20).toFixed(2);
  const availableCredits = stats?.availableCredits ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (creditNum < 200) {
      Swal.fire('Minimum Threshold', 'The minimum withdrawal threshold is 200 credits ($10.00 USD).', 'warning');
      return;
    }

    if (creditNum > availableCredits) {
      Swal.fire({
        title: 'Insufficient Balance',
        text: `You only have ${availableCredits} credits available to withdraw from raised campaigns.`,
        icon: 'error',
      });
      return;
    }

    if (!accountNumber.trim()) {
      Swal.fire('Required', 'Please enter your destination account or email.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/withdrawals', {
        creator_email: user.email,
        creator_name: user.displayName || user.name || 'Creator',
        withdrawal_credit: creditNum,
        payment_system: paymentSystem,
        account_number: accountNumber.trim(),
      });

      Swal.fire({
        title: 'Withdrawal Requested!',
        html: `
          <div class="text-left text-xs space-y-1.5">
            <p>Your request to withdraw <strong>${creditNum} credits ($${dollarAmount} USD)</strong> via <strong>${paymentSystem}</strong> has been submitted.</p>
            <p class="text-slate-500 mt-2">The platform administrator will review and release your payout.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#059669',
      });

      setAccountNumber('');
      fetchWithdrawalData();
    } catch (err) {
      console.error('Withdrawal error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to submit withdrawal request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading payout options..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          Creator Payout Withdrawals
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Withdraw raised campaign credits directly to your bank account or electronic wallet at <strong className="text-slate-800">20 Credits = $1.00 USD</strong>.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Credits Raised</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
            <Coins className="w-6 h-6 text-emerald-500" />
            {stats?.totalAmountRaised ?? 0}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Across all approved campaigns</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available to Withdraw</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-1.5">
            <Coins className="w-6 h-6 text-emerald-500" />
            {availableCredits} Credits
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            ≈ ${(availableCredits / 20).toFixed(2)} USD
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Already Paid Out</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats?.totalWithdrawnCredits ?? 0} <span className="text-sm font-semibold text-slate-400">Credits</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            ${((stats?.totalWithdrawnCredits ?? 0) / 20).toFixed(2)} USD transferred
          </span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Withdrawal Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Submit Withdrawal Request
            </h3>

            {/* Credits Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Withdrawal Credits (Minimum 200 Credits = $10.00 USD)
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="200"
                  step="20"
                  max={availableCredits}
                  value={creditsToWithdraw}
                  onChange={(e) => setCreditsToWithdraw(e.target.value)}
                  placeholder="200"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {/* Payment System */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Payment Channel
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-slate-50/50"
              >
                {PAYMENT_SYSTEMS.map((sys) => (
                  <option key={sys} value={sys}>
                    {sys}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Info */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Account Number / PayPal Email / IBAN
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. US44 3704 0044 0532 0130 00 or email@paypal.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-slate-50/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || creditNum < 200 || creditNum > availableCredits}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <DollarSign className="w-4 h-4" />
              <span>{submitting ? 'Submitting Request...' : `Request Payout of $${dollarAmount} USD`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Economics Summary Box */}
          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Payout Calculation
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Requested Credits:</span>
                <span className="font-bold text-slate-900">{creditNum} Credits</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Exchange Rate:</span>
                <span className="font-semibold text-slate-800">20 Credits = $1.00 USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Minimum Threshold:</span>
                <span className="text-amber-700 font-semibold">200 Credits ($10 USD)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-black text-slate-900">Total Payout:</span>
                <span className="text-2xl font-black text-emerald-700">${dollarAmount} USD</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Admin reviews requests to guarantee fund security.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Credits are deducted from available raised balances upon approval.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Withdrawal Requests Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Withdrawal Request History
          </h3>
          <span className="text-xs text-slate-400">{withdrawals.length} Total Requests</span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No withdrawal requests submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-6 font-bold">Date</th>
                  <th className="py-3 px-6 font-bold">Credits</th>
                  <th className="py-3 px-6 font-bold">USD Amount</th>
                  <th className="py-3 px-6 font-bold">Payment Method</th>
                  <th className="py-3 px-6 font-bold">Account</th>
                  <th className="py-3 px-6 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-6 text-slate-500">{w.withdraw_date}</td>
                    <td className="py-3 px-6 font-bold text-slate-900">{w.withdrawal_credit} Cr</td>
                    <td className="py-3 px-6 font-black text-emerald-700">${Number(w.withdrawal_amount).toFixed(2)}</td>
                    <td className="py-3 px-6 text-slate-600">{w.payment_system}</td>
                    <td className="py-3 px-6 font-mono text-[11px] text-slate-500">{w.account_number}</td>
                    <td className="py-3 px-6 text-right">
                      {w.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Paid Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Processing
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
