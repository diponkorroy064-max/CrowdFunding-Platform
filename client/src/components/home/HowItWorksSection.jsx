import React from 'react';
import { Compass, CheckCircle2, Rocket } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Discover & Pledge Credits',
      description: 'Sign up to receive 50 bonus credits. Explore community campaigns and pledge credits directly to causes that resonate with you.',
      icon: Compass,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      step: '02',
      title: 'Creator Evaluates Pledge',
      description: 'Campaign creators review incoming backer pledges. If accepted, credits are locked towards the funding goal. If rejected, you receive an immediate full refund.',
      icon: CheckCircle2,
      color: 'from-teal-500 to-cyan-600'
    },
    {
      step: '03',
      title: 'Goal Reached & Payouts Released',
      description: 'Once the campaign hits its milestones, creators withdraw funds at 20 Credits = $1.00 USD directly to their bank or payment accounts.',
      icon: Rocket,
      color: 'from-cyan-600 to-blue-600'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Simple & Safe Journey
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
          How CrowdSpark Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          From first pledge to final payout, our platform ensures every backer and creator is treated fairly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="text-5xl font-black text-slate-100 absolute top-4 right-6 select-none group-hover:text-emerald-50 transition-colors">
                {st.step}
              </div>

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${st.color} text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20`}>
                <Icon className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {st.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {st.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
