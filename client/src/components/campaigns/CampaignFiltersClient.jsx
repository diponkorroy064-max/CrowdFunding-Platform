"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Clean Tech & Energy',
  'Healthcare & Medical',
  'Education & Learning',
  'Humanitarian & Relief',
  'Creative Arts',
  'Community & Civic'
];

export default function CampaignFiltersClient({ initialCategory = 'All', initialSearch = '', initialSort = 'raised-desc' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSortOption(searchParams.get('sort') || 'raised-desc');
  }, [searchParams]);

  // Update URL search parameters
  const updateQuery = (newSearch, newCategory, newSort) => {
    const params = new URLSearchParams();
    if (newSearch && newSearch.trim()) params.set('search', newSearch.trim());
    if (newCategory && newCategory !== 'All') params.set('category', newCategory);
    if (newSort && newSort !== 'raised-desc') params.set('sort', newSort);

    const query = params.toString();
    router.push(`/campaigns${query ? `?${query}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    updateQuery(val, selectedCategory, sortOption);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateQuery(search, cat, sortOption);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    updateQuery(search, selectedCategory, sort);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns by title..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50/50"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-4 relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50 text-slate-700"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-3 relative">
          <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
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
            onClick={() => handleCategoryChange(cat)}
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
  );
}
