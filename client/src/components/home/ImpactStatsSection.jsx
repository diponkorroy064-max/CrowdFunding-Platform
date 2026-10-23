import React from 'react';
import { ShieldCheck, HeartHandshake, Coins, Zap } from 'lucide-react';

export default function ImpactStatsSection() {
  const stats = [
    { label: 'Platform Credits Transacted', value: '450,000+', icon: Coins, color: 'text-emerald-500' },
    { label: 'Projects Successfully Funded', value: '1,280+', icon: Zap, color: 'text-amber-500' },
    { label: 'Active Community Supporters', value: '24,500+', icon: HeartHandshake, color: 'text-teal-500' },
    { label: 'Backer Refund Guarantee', value: '100%', icon: ShieldCheck, color: 'text-indigo-500' },
  ];

  return (
    <section className="bg-slate-900 py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Decentralized Credibility
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Built on Transparency & Direct Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every transaction is recorded on our MongoDB ledger, with strict creator review policies and automated refunds.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {item.value}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
