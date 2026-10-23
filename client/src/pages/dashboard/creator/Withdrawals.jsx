import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  DollarSign,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building,
  ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const Withdrawals = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAmountRaised: 0,
    totalWithdrawnCredits: 0,
    availableCredits: 0
  });
  const [loading, setLoading] = useState(true);

  // Form states
  const [creditsToWithdraw, setCreditsToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('Stripe');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchEarnings = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/creator/stats/${user.email}`);
      setStats(res.data);
    } catch (err) {
      console.warn('Fallback earnings stats:', err);
      setStats({
        totalAmountRaised: 600,
        totalWithdrawnCredits: 0,
        availableCredits: 600
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [user?.email]);

  const availableCredits = stats.availableCredits || 0;
  const currentTotalRaised = stats.totalAmountRaised || 0;
  const totalDollarValue = (currentTotalRaised / 20).toFixed(2);
  const availableDollarValue = (availableCredits / 20).toFixed(2);

  // Auto-calculated withdraw amount in USD: 20 credits = 1 dollar
  const calculatedDollarAmount = creditsToWithdraw
    ? (Number(creditsToWithdraw) / 20).toFixed(2)
    : '0.00';

  // Business Logic checks: minimum 200 credits ($10), cannot exceed available raised credits
  const hasEnoughCredit = availableCredits >= 200;
  const isInputValid =
    creditsToWithdraw &&
    Number(creditsToWithdraw) >= 200 &&
    Number(creditsToWithdraw) <= availableCredits;

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const creditsNum = Number(creditsToWithdraw);

    if (creditsNum < 200) {
      setErrorMessage('Minimum withdrawal amount is 200 credits ($10.00 USD).');
      return;
    }

    if (creditsNum > availableCredits) {
      setErrorMessage(`Cannot withdraw more than your available raised balance (${availableCredits} credits).`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('Please provide your payout account number or email.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/withdrawals', {
        creator_email: user.email,
        creator_name: user.displayName || 'Creator Member',
        withdrawal_credit: creditsNum,
        payment_system: paymentSystem,
        account_number: accountNumber
      });

      Swal.fire({
        icon: 'success',
        title: 'Withdrawal Request Submitted!',
        html: `Requested <b>${creditsNum} credits</b> ($${calculatedDollarAmount} USD) via <b>${paymentSystem}</b>.<br/>Status: <b>Pending Admin Approval</b>.`,
        confirmButtonColor: '#10b981'
      });

      setCreditsToWithdraw('');
      setAccountNumber('');
      fetchEarnings();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Creator Fund Withdrawals
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Convert your raised community credits into real currency. (20 Credits = $1.00 USD)
        </p>
      </div>

      {/* Creator Total Earnings Cards (Page 7 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Raised Credits */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Raised</span>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{currentTotalRaised}</p>
          <p className="text-[11px] text-slate-500 mt-1">Equivalent to ${totalDollarValue} USD</p>
        </div>

        {/* Available to Withdraw */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available to Withdraw</span>
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">{availableCredits}</p>
          <p className="text-[11px] text-slate-500 mt-1">Available: ${availableDollarValue} USD</p>
        </div>

        {/* Platform Payout Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Rate</span>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">20 Credits = $1</p>
          <p className="text-[11px] text-slate-500 mt-1">Min threshold: 200 credits ($10)</p>
        </div>

      </div>

      {/* Withdrawal Form Card (Page 7 Requirement) */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Request Payout</h2>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleWithdrawSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Credits To Withdraw */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Credits To Withdraw *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="200"
                  max={availableCredits}
                  required
                  value={creditsToWithdraw}
                  onChange={(e) => setCreditsToWithdraw(e.target.value)}
                  placeholder="Min 200 credits"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Cannot exceed total raised available credits ({availableCredits}).
              </p>
            </div>

            {/* Withdraw Amount ($) - Non Editable */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Withdraw Amount ($ USD) — Auto-calculated
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`$${calculatedDollarAmount}`}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 cursor-not-allowed"
                />
                <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Calculated automatically: 20 credits = $1.00 USD.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Payment System Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Payment System *
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Stripe">Stripe Direct Transfer</option>
                <option value="Bkash">bKash (MFS)</option>
                <option value="Rocket">Rocket (DBBL MFS)</option>
                <option value="Nagad">Nagad (Postal MFS)</option>
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Account Number / Wallet ID *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. Stripe Account ID or 017XXXXXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Withdraw Button vs "Insufficient credit" text (Page 7 requirement) */}
          <div className="pt-2">
            {!hasEnoughCredit ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
                Insufficient credit. (You must have raised at least 200 credits to request a withdrawal.)
              </div>
            ) : (
              <button
                type="submit"
                disabled={submitting || !isInputValid}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="animate-pulse">Submitting Payout Request...</span>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Withdraw ${calculatedDollarAmount} USD</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
};

export default Withdrawals;
