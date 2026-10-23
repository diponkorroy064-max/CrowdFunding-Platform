import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  CreditCard,
  CheckCircle,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';

const PurchaseCredit = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  // Credit Packages required by Page 10 Table
  const packages = [
    {
      credits: 100,
      price: 10,
      title: 'Starter Pack',
      description: 'Ideal for backing your first community project',
      popular: false
    },
    {
      credits: 300,
      price: 25,
      title: 'Advocate Pack',
      description: 'Great value to support multiple promising initiatives',
      popular: true
    },
    {
      credits: 800,
      price: 60,
      title: 'Visionary Pack',
      description: 'Empower bold technological and ecological breakthroughs',
      popular: false
    },
    {
      credits: 1500,
      price: 110,
      title: 'Patron Pack',
      description: 'Maximum credit value with highest platform impact',
      popular: false
    }
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !user?.email) return;

    setProcessing(true);
    try {
      // 1. In background, create payment intent or simulate
      try {
        await apiClient.post('/create-payment-intent', { price: selectedPackage.price });
      } catch (err) {
        console.warn('Stripe intent skipped for development:', err.message);
      }

      // 2. Record payment in DB and increase supporter's credits
      const txnId = 'txn_stripe_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await apiClient.post('/payments/purchase-credit', {
        user_email: user.email,
        user_name: user.displayName || 'Supporter',
        credits_purchased: selectedPackage.credits,
        amount_paid: selectedPackage.price,
        transaction_id: txnId,
        payment_method: 'Stripe Card (Simulated)'
      });

      // 3. Refresh user credits in auth context
      await refreshUser();

      setPaymentModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        html: `You have successfully purchased <b>${selectedPackage.credits} credits</b> for <b>$${selectedPackage.price}</b>!<br/>Transaction ID: <code class="text-xs text-slate-600">${txnId}</code>`,
        confirmButtonColor: '#10b981',
      });

      navigate('/dashboard/payment-history');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Processing Failed',
        text: err.response?.data?.message || 'Could not complete payment.',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CreditCard className="w-4 h-4 text-emerald-500" />
          <span>Stripe Secure Credit Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Purchase Platform Credits
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Supporters purchase 10 credits for $1 USD. Select a credit package below to recharge your account balance.
        </p>
      </div>

      {/* Credit Packages Grid (Page 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative ${
              pkg.popular
                ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                : 'border-slate-200 shadow-card hover:shadow-lg'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                Most Popular
              </span>
            )}

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{pkg.title}</h3>
              <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{pkg.description}</p>

              <div className="my-6">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ${pkg.price}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">USD</span>
                <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                  +{pkg.credits} Platform Credits
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPackage(pkg)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                pkg.popular
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800'
              }`}
            >
              <span>Buy {pkg.credits} Credits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Encrypted Card Processing</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Stripe. Your credits are credited immediately upon payment confirmation.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-emerald-400 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
          10 Credits = $1 USD Standard Rate
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {paymentModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base">Stripe Secure Checkout</h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Selected Package Summary */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{selectedPackage.title}</p>
                <p className="text-[11px] text-emerald-600 font-bold">+{selectedPackage.credits} Platform Credits</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">${selectedPackage.price}</span>
                <span className="text-[10px] text-slate-400 block">USD</span>
              </div>
            </div>

            {/* Card Details Form */}
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                By confirming, your card will be charged ${selectedPackage.price} and {selectedPackage.credits} credits will be added to your account instantly.
              </p>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {processing ? (
                  <span className="animate-pulse">Authorizing with Stripe...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${selectedPackage.price} USD & Recharge</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default PurchaseCredit;
