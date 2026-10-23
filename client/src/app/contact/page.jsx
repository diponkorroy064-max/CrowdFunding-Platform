import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import ContactFormClient from '@/components/contact/ContactFormClient';

export const metadata = {
  title: "Contact Us | CrowdSpark Crowdfunding Support & Inquiries",
  description: "Get in touch with the CrowdSpark team. 24/7 support for campaign creators, supporters, platform credits, and institutional partnerships.",
};

export default function ContactPage() {
  const contactChannels = [
    {
      icon: Mail,
      title: "Direct Email Support",
      detail: "support@crowdspark.org",
      subtext: "Typical response in under 2 hours",
      actionText: "Send Email",
      actionHref: "mailto:support@crowdspark.org",
      badge: "24/7 Active"
    },
    {
      icon: Phone,
      title: "Phone & Hotline",
      detail: "+1 (800) 555-SPARK",
      subtext: "Mon - Fri, 9:00 AM - 8:00 PM EST",
      actionText: "Call Now",
      actionHref: "tel:+18005557727",
      badge: "Toll Free"
    },
    {
      icon: MapPin,
      title: "Global Headquarters",
      detail: "Silicon Innovation Center",
      subtext: "Level 8, Tech Square, Dhaka & Wilmington DE",
      actionText: "Get Directions",
      actionHref: "https://maps.google.com",
      badge: "Visitor Friendly"
    }
  ];

  const faqs = [
    {
      q: "How does the 10-to-20 credit ratio work?",
      a: "Supporters acquire platform credits at 10 Credits = $1.00 USD. When creators reach milestones and request a payout, platform funds are disbursed at 20 Credits = $1.00 USD, creating a self-sustaining ecosystem without upfront listing debt."
    },
    {
      q: "How does the automated backer refund work?",
      a: "If a campaign is cancelled or rejected by creators/moderators, 100% of your pledged credits are automatically and instantly credited back to your platform wallet balance."
    },
    {
      q: "What is the minimum creator payout threshold?",
      a: "Creators can request an earnings withdrawal as soon as they accumulate 200 platform credits ($10.00 USD). Disbursements are supported via Stripe, bKash, Rocket, and Nagad."
    },
    {
      q: "How long does campaign approval take?",
      a: "Our administrative review team verifies campaign documentation, goals, and cover assets within 12 to 24 hours of submission."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We're Here For You 24/7</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Let's Start a Conversation with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">CrowdSpark</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about launching a campaign, recharging platform credits, or creator payouts? Reach out directly and our specialists will assist you right away.
          </p>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-24 relative z-20 space-y-12">
        
        {/* Contact Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactChannels.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 hover:border-emerald-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-black text-slate-800 mt-1">
                    {item.detail}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.subtext}
                  </p>
                </div>

                <a
                  href={item.actionHref}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Form & Support Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Form Component */}
          <div className="lg:col-span-7">
            <ContactFormClient />
          </div>

          {/* Side Info & FAQ Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Assistance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">
                Platform Security & Guarantee
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All platform donations, credit transactions, and identity tokens are protected with end-to-end Better Auth authentication and verified Stripe webhook reconciliation.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>Response SLA: Within 4 Hours Guaranteed</span>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2 text-slate-900">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      {faq.q}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
