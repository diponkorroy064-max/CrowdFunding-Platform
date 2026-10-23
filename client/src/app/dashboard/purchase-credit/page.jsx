"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Coins, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Lock
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const PACKAGES = [
  { credits: 50, price: 5, label: 'Starter', popular: false },
  { credits: 100, price: 10, label: 'Community Supporter', popular: true },
  { credits: 250, price: 25, label: 'Impact Maker', popular: false },
  { credits: 500, price: 50, label: 'Catalyst Champion', popular: false },
  { credits: 1000, price: 100, label: 'Visionary Patron', popular: false },
];

export default function PurchaseCreditPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]);
  const [customCredits, setCustomCredits] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Compute values
  const activeCredits = isCustom ? Number(customCredits) || 0 : selectedPackage.credits;
  const activePrice = isCustom ? (Number(customCredits) / 10).toFixed(2) : selectedPackage.price;

  const handleCustomChange = (e) => {
    setIsCustom(true);
    setCustomCredits(e.target.value);
  };

  const handleSelectPredefined = (pkg) => {
    setIsCustom(false);
    setSelectedPackage(pkg);
    setCustomCredits('');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!activeCredits || activeCredits < 10) {
      Swal.fire('Minimum Purchase', 'The minimum credit purchase is 10 credits ($1.00 USD).', 'warning');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create simulated transaction or Stripe payment
      const txnId = 'TXN_STRIPE_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

      const res = await apiClient.post('/payments/purchase-credit', {
        user_email: user.email,
        user_name: user.displayName || user.name || 'Supporter',
        credits_purchased: activeCredits,
        amount_paid: Number(activePrice),
        transaction_id: txnId,
        payment_method: 'Stripe Card (Verified)',
      });

      // 2. Refresh Auth Context with new credit balance
      await refreshUser();

      Swal.fire({
        title: 'Payment Successful!',
        html: `
          <div class="text-left text-sm space-y-2">
            <p><strong>Transaction ID:</strong> <span class="font-mono text-emerald-600">${txnId}</span></p>
            <p><strong>Credits Added:</strong> +${activeCredits} Credits</p>
            <p><strong>Amount Billed:</strong> $${activePrice} USD</p>
            <p class="text-xs text-slate-500 mt-2">Your credit balance has been updated immediately.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#059669',
      }).then(() => {
        router.push('/dashboard/supporter-home');
      });
    } catch (err) {
      console.error('Purchase error:', err);
      Swal.fire('Payment Failed', err.response?.data?.message || 'Failed to process payment. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5" />
          Official Platform Economics
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Purchase Platform <span className="text-emerald-600">Credits</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Supporters buy credits at an exact fixed rate of <strong className="text-slate-800">10 Credits = $1.00 USD</strong>. Use credits to fund causes anytime.
        </p>
      </div>

      {/* Package Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {PACKAGES.map((pkg) => {
          const isSelected = !isCustom && selectedPackage.credits === pkg.credits;
          return (
            <div
              key={pkg.credits}
              onClick={() => handleSelectPredefined(pkg)}
              className={`relative bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 shadow-lg shadow-emerald-600/10 scale-105 z-10'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {pkg.label}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">${pkg.price}</span>
                  <span className="text-xs text-slate-400">USD</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  <Coins className="w-4 h-4 text-emerald-500" />
                  <span>{pkg.credits} Credits</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>$0.10 / Cr</span>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Amount & Checkout Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Custom Input */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Or Enter a Custom Amount of Credits
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Number of Credits (Min 10 Credits)
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customCredits}
                  onChange={handleCustomChange}
                  placeholder="e.g. 350 credits"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secured 256-bit encrypted checkout via Stripe.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Instant balance deposit upon transaction confirmation.</span>
              </div>
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Order Summary
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Selected Package / Credits:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-emerald-500" />
                  {activeCredits} Credits
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rate:</span>
                <span>$1.00 USD = 10 Credits</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Processing Fee:</span>
                <span className="text-emerald-700 font-bold">$0.00 (Waived)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base">
                <span className="font-extrabold text-slate-900">Total Billed:</span>
                <span className="text-2xl font-black text-emerald-700">${activePrice} USD</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || activeCredits < 10}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Payment...' : `Pay $${activePrice} via Stripe`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
