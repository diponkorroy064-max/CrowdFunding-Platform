import React from 'react';
import Link from 'next/link';
import { Zap, Users, Sparkles, ShieldCheck, Globe2, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Clean Tech & Energy', count: '142 Projects', icon: Zap, bg: 'bg-emerald-50 text-emerald-700' },
  { name: 'Community & Civic', count: '98 Projects', icon: Users, bg: 'bg-teal-50 text-teal-700' },
  { name: 'Creative Arts', count: '115 Projects', icon: Sparkles, bg: 'bg-purple-50 text-purple-700' },
  { name: 'Healthcare & Medical', count: '64 Projects', icon: ShieldCheck, bg: 'bg-rose-50 text-rose-700' },
  { name: 'Education & Learning', count: '87 Projects', icon: Globe2, bg: 'bg-amber-50 text-amber-700' },
];

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explore by Category
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Target your community pledges towards topics you are deeply passionate about.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/campaigns?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500/80 hover:shadow-lg transition-all group flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h4>
              <span className="text-[11px] text-slate-400 mt-1 font-medium">
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
