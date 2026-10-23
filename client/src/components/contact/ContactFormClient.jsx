"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, User, Mail, HelpCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Please provide your name, email, and message.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent Successfully!',
        text: `Thank you ${formData.name}. Our support team will get back to you at ${formData.email} within 2-4 hours.`,
        confirmButtonColor: '#10b981'
      });
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-200/80">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Send Us a Direct Message
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Fill out the details below and our campaign specialist will reply to you swiftly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sarah Jenkins"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Inquiry Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Inquiry Type
            </label>
            <div className="relative">
              <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50 transition-all appearance-none cursor-pointer"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Campaign Launch">Campaign Launch & Approval</option>
                <option value="Credit Recharge">Credit Recharge & Stripe</option>
                <option value="Creator Payout">Creator Payout & Withdrawals</option>
                <option value="Trust & Safety">Trust, Safety & Fraud Report</option>
                <option value="Partnership">Partnership & Media</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subject
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Campaign verification query"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Please write your detailed message, question, or feedback here..."
            required
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50 transition-all resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
