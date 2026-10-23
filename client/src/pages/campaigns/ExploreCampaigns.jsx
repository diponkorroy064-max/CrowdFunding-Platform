import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Search, Filter, Coins, Calendar, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ExploreCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Technology', 'Community', 'Creative', 'Healthcare', 'Education'];

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (category !== 'All') queryParams.push(`category=${category}`);
      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (sortBy === 'raised-desc') queryParams.push(`sort=raised-desc`);
      if (sortBy === 'deadline') queryParams.push(`sort=deadline`);

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const res = await apiClient.get(`/campaigns/explore${queryString}`);
      setCampaigns(res.data || []);
    } catch (err) {
      console.warn('Error fetching campaigns, showing curated sample:', err);
      // Fallback sample campaigns
      setCampaigns([
        {
          _id: 'mock1',
          campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
          category: 'Community',
          campaign_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
          amount_raised: 4500,
          funding_goal: 5000,
          minimum_Contribution: 10,
          deadline: '2026-12-31',
          creator_name: 'SolarAid Collective',
          campaign_story: 'Bringing zero-emission solar water pumps to remote arid farming communities.'
        },
        {
          _id: 'mock2',
          campaign_title: 'Aura Next-Gen Open Source Robotics Kit',
          category: 'Technology',
          campaign_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
          amount_raised: 3800,
          funding_goal: 4000,
          minimum_Contribution: 25,
          deadline: '2026-11-20',
          creator_name: 'Dr. Evelyn Vance',
          campaign_story: 'Accessible modular robotics platform for STEM high school students worldwide.'
        },
        {
          _id: 'mock3',
          campaign_title: 'Chronicles of Earth: Environmental Graphic Novel',
          category: 'Creative',
          campaign_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          amount_raised: 2900,
          funding_goal: 3000,
          minimum_Contribution: 15,
          deadline: '2026-12-15',
          creator_name: 'Studio Lumina',
          campaign_story: 'A 200-page hand-illustrated graphic novel visualizing climate futures.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [category, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Compass className="w-4 h-4 text-emerald-500" />
          <span>Verified Active Initiatives</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore Innovative Campaigns
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse approved campaigns whose deadlines are active. Support creators with platform credits!
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filter by Category */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="raised-desc">Most Raised Credits</option>
            <option value="deadline">Approaching Deadline</option>
          </select>
        </div>

      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No active campaigns found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            const raised = camp.amount_raised || 0;
            const goal = camp.funding_goal || 1;
            const progress = Math.min(100, Math.round((raised / goal) * 100));

            return (
              <div
                key={camp._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
              >
                {/* Cover Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={camp.campaign_image_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'}
                    alt={camp.campaign_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider">
                    {camp.category || 'General'}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{raised} Credits</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {camp.campaign_title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{camp.creator_name || 'Creator'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {camp.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Funding Goal & Progress */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600">{progress}% Funded</span>
                      <span className="text-slate-500">Goal: {goal} Credits</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* View Details Button */}
                    <div className="pt-3">
                      <Link
                        to={`/campaigns/${camp._id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ExploreCampaigns;
