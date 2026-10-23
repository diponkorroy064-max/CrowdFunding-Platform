import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Heart, 
  Gift 
} from 'lucide-react';
import PledgeActionCard from '@/components/campaigns/PledgeActionCard';
import ReportModalButton from '@/components/campaigns/ReportModalButton';

export const dynamic = 'force-dynamic';

async function getCampaign(id) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    const res = await fetch(`${apiBase}/campaigns/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Server fetch error in getCampaign:', err.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    return {
      title: 'Campaign Not Found | CrowdSpark',
      description: 'The requested crowdfunding campaign could not be located.',
    };
  }

  return {
    title: `${campaign.campaign_title} | CrowdSpark`,
    description: campaign.campaign_story?.slice(0, 160) || 'Support this campaign on CrowdSpark.',
    openGraph: {
      title: campaign.campaign_title,
      description: campaign.campaign_story?.slice(0, 160),
      images: [campaign.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'],
    },
  };
}

function calculateDaysLeft(deadline) {
  if (!deadline) return 0;
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export default async function CampaignDetailsPage({ params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Campaign Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The campaign you requested does not exist or has been removed.</p>
        <Link
          href="/campaigns"
          className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(campaign.deadline);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb (Server-Side Rendered) */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Campaigns
          </Link>

          {/* Interactive Report Campaign Button */}
          <ReportModalButton
            campaignId={campaign._id}
            campaignTitle={campaign.campaign_title}
          />
        </div>

        {/* Main Grid: Details + Pledge Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image, Story, Rewards (Server-Side Rendered) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Banner Image & Tags */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-md">
              <img
                src={campaign.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'}
                alt={campaign.campaign_title}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide bg-white/95 backdrop-blur-md text-emerald-800 shadow">
                  {campaign.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/85 backdrop-blur-md text-white shadow">
                  {daysLeft} Days Left
                </span>
              </div>
            </div>

            {/* Campaign Headline */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {campaign.campaign_title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Creator</span>
                    <span className="font-bold text-slate-800">{campaign.creator_name || 'Verified Creator'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Campaign Deadline</span>
                    <span className="font-bold text-slate-800">{campaign.deadline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Story */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                The Story & Purpose (Server-Side Rendered)
              </h2>
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {campaign.campaign_story}
              </div>
            </div>

            {/* Reward Info */}
            {campaign.reward_info && (
              <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-black text-emerald-900">Supporter Backer Perks</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {campaign.reward_info}
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Interactive Pledge Action Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <PledgeActionCard campaign={campaign} />
          </div>

        </div>

      </div>
    </div>
  );
}
