import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Coins, 
  Calendar, 
  User, 
  ArrowRight, 
  FolderHeart 
} from 'lucide-react';
import CampaignFiltersClient from '@/components/campaigns/CampaignFiltersClient';
import CampaignPagination from '@/components/campaigns/CampaignPagination';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Explore Campaigns | CrowdSpark',
  description: 'Explore live, community-backed projects across clean energy, education, healthcare, and humanitarian initiatives. Server-side rendered with real-time updates.',
};

async function getCampaigns(searchParams) {
  try {
    const sp = await searchParams;
    const category = sp?.category || '';
    const search = sp?.search || '';
    const sort = sp?.sort || 'raised-desc';
    const page = Math.max(1, parseInt(sp?.page) || 1);
    const limit = Math.max(1, parseInt(sp?.limit) || 6);

    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    const res = await fetch(`${apiBase}/campaigns/explore?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('Failed to fetch campaigns on server:', res.statusText);
      return { campaigns: [], total: 0, totalPages: 1, page: 1, limit };
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return {
        campaigns: data,
        total: data.length,
        totalPages: Math.ceil(data.length / limit) || 1,
        page: 1,
        limit
      };
    }
    return {
      campaigns: data.campaigns || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || page,
      limit: data.limit || limit
    };
  } catch (err) {
    console.warn('Server fetch error in getCampaigns:', err.message);
    return { campaigns: [], total: 0, totalPages: 1, page: 1, limit: 6 };
  }
}

function calculateDaysLeft(deadline) {
  if (!deadline) return 0;
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export default async function ExploreCampaignsPage({ searchParams }) {
  const sp = await searchParams;
  const category = sp?.category || 'All';
  const search = sp?.search || '';
  const sort = sp?.sort || 'raised-desc';

  const {
    campaigns,
    total,
    totalPages,
    page: currentPage,
    limit: pageSize
  } = await getCampaigns(searchParams);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header (Server-Side Rendered) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Discover Meaningful Causes (Server-Side Rendered)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Explore Active <span className="text-emerald-600">Campaigns</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Pledge your platform credits to high-impact campaigns across clean energy, healthcare, creative arts, and community empowerment.
          </p>
        </div>

        {/* Filter and Search Bar (Client Island) */}
        <CampaignFiltersClient
          initialCategory={category}
          initialSearch={search}
          initialSort={sort}
        />

        {/* Campaign List Grid (Server-Side Rendered to HTML) */}
        {campaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <FolderHeart className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No campaigns found</h3>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your search terms or category filter to discover ongoing projects.
            </p>
            <Link
              href="/campaigns"
              className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => {
              const progress = Math.min(100, Math.round(((camp.amount_raised || 0) / (camp.funding_goal || 1)) * 100));
              const daysLeft = calculateDaysLeft(camp.deadline);

              return (
                <div
                  key={camp._id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Campaign Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={camp.campaign_image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                      alt={camp.campaign_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-emerald-800 shadow-sm">
                        {camp.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {daysLeft}d left
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{camp.creator_name || 'Verified Creator'}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {camp.campaign_title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                        {camp.campaign_story}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
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
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-right text-[10px] text-slate-400 font-semibold mt-1">
                          {progress}% Funded
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/campaigns/${camp._id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <span>View Campaign & Pledge</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {campaigns.length > 0 && (
          <CampaignPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize || 6}
            category={category}
            search={search}
            sort={sort}
          />
        )}

      </div>
    </div>
  );
}
