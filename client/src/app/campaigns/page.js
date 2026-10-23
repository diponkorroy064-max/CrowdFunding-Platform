"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Coins, 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles,
  SlidersHorizontal,
  FolderHeart
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

const CATEGORIES = [
  'All',
  'Clean Tech & Energy',
  'Healthcare & Medical',
  'Education & Learning',
  'Humanitarian & Relief',
  'Creative Arts',
  'Community & Civic'
];

export default function ExploreCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('raised-desc');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/campaigns/explore', {
        params: {
          category: selectedCategory,
          search: search.trim() || undefined,
          sort: sortOption,
        },
      });
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCampaigns();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, sortOption]);

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 0;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Discover Meaningful Causes
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Explore Active <span className="text-emerald-600">Campaigns</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Pledge your platform credits to high-impact campaigns across clean energy, healthcare, creative arts, and community empowerment.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-4 relative">
              <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50 text-slate-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-3 relative">
              <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50 text-slate-700"
              >
                <option value="raised-desc">Most Raised First</option>
                <option value="raised-asc">Least Raised First</option>
                <option value="deadline">Ending Soonest</option>
              </select>
            </div>
          </div>

          {/* Category Quick Tags */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-4/5"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <FolderHeart className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No campaigns found</h3>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your search terms or category filter to discover ongoing projects.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
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
                        <User className="w-3.5 h-3.5" />
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
                            <Coins className="w-3.5 h-3.5" />
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

      </div>
    </div>
  );
}
