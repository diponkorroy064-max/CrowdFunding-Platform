import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CtaBannerSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-800 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 24,000+ Change Makers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to bring your visionary cause to life?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Register today to receive 50 bonus supporter credits or 20 creator credits. Transparent verification and automated refunds guaranteed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/register"
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/campaigns"
            className="px-6 py-3.5 rounded-2xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs border border-white/20 transition-all text-center"
          >
            <span>Explore All Projects</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
