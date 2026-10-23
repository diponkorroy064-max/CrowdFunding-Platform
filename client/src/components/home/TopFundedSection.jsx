import React from 'react';
import Link from 'next/link';
import { TrendingUp, Coins, ArrowRight, User } from 'lucide-react';

export default function TopFundedSection({ campaigns = [] }) {
  const displayCampaigns = campaigns.length > 0 ? campaigns : [
    {
      _id: 'mock1',
      campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
      category: 'Clean Tech & Energy',
      campaign_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      amount_raised: 4500,
      funding_goal: 5000,
      creator_name: 'SolarAid Collective'
    },
    {
      _id: 'mock2',
      campaign_title: 'Aura Next-Gen Open Source Robotics Kit',
      category: 'Education & Learning',
      campaign_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      amount_raised: 3800,
      funding_goal: 4000,
      creator_name: 'Dr. Evelyn Vance'
    },
    {
      _id: 'mock3',
      campaign_title: 'Chronicles of Earth: Environmental Graphic Novel',
      category: 'Creative Arts',
      campaign_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      amount_raised: 2900,
      funding_goal: 3000,
      creator_name: 'Studio Lumina'
    },
    {
      _id: 'mock4',
      campaign_title: 'Smart AgTech: Low-Cost Drip Irrigation for Small Farmers',
      category: 'Clean Tech & Energy',
      campaign_image_url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
      amount_raised: 2400,
      funding_goal: 3500,
      creator_name: 'Tariq Rahman'
    },
    {
      _id: 'mock5',
      campaign_title: 'HeartBeat: Portable Pediatric Cardiac Monitor',
      category: 'Healthcare & Medical',
      campaign_image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      amount_raised: 2100,
      funding_goal: 2500,
      creator_name: 'BioMed Innovators'
    },
    {
      _id: 'mock6',
      campaign_title: 'Heritage Revive: Traditional Artisan Weaving Guild',
      category: 'Creative Arts',
      campaign_image_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      amount_raised: 1950,
      funding_goal: 2000,
      creator_name: 'Craft Heritage Alliance'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Highest Backed Projects (Server-Side Rendered)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Top Funded Campaigns
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover inspiring campaigns that have raised the maximum amount of community credits.
          </p>
        </div>

        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 group"
        >
          <span>View All Campaigns</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayCampaigns.map((camp) => {
          const progress = Math.min(100, Math.round(((camp.amount_raised || 0) / (camp.funding_goal || 1)) * 100));

          return (
            <div
              key={camp._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={camp.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                  alt={camp.campaign_title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-emerald-800 shadow-sm">
                    {camp.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{camp.creator_name || 'Verified Creator'}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {camp.campaign_title}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {camp.amount_raised || 0} Credits
                      </span>
                      <span className="text-slate-500">
                        Goal: {camp.funding_goal}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-semibold mt-1">
                      {progress}% Funded
                    </div>
                  </div>

                  <Link
                    href={`/campaigns/${camp._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View Campaign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
