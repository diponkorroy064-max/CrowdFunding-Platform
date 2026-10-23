import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Image,
  Upload,
  Calendar,
  Coins,
  FileText,
  Tag,
  Gift,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';

const AddNewCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignStory, setCampaignStory] = useState('');
  const [category, setCategory] = useState('Technology');
  const [fundingGoal, setFundingGoal] = useState('');
  const [minimumContribution, setMinimumContribution] = useState('');
  const [deadline, setDeadline] = useState('');
  const [rewardInfo, setRewardInfo] = useState('');
  const [campaignImageUrl, setCampaignImageUrl] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['Technology', 'Community', 'Creative', 'Healthcare', 'Education'];

  // Multer Image Upload Handler (Converts jpg, png, webp, etc. into server URL)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG, etc.).');
      return;
    }

    setUploadingImage(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.url) {
        setCampaignImageUrl(res.data.url);
      }
    } catch (err) {
      console.error(err);
      // Fallback preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCampaignImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage('Image loaded locally (fallback preview).');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!campaignTitle.trim() || !campaignStory.trim()) {
      setErrorMessage('Please provide both title and story.');
      return;
    }

    if (!fundingGoal || Number(fundingGoal) <= 0) {
      setErrorMessage('Please enter a valid funding goal in credits.');
      return;
    }

    if (!deadline) {
      setErrorMessage('Please select a deadline date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        campaign_title: campaignTitle,
        campaign_story: campaignStory,
        category,
        funding_goal: Number(fundingGoal),
        minimum_Contribution: Number(minimumContribution || 1),
        deadline,
        reward_info: rewardInfo,
        campaign_image_url: campaignImageUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
        creator_name: user?.displayName || 'Creator Member',
        creator_email: user?.email
      };

      await apiClient.post('/campaigns', payload);

      Swal.fire({
        icon: 'success',
        title: 'Campaign Submitted!',
        html: `Your campaign <b>"${campaignTitle}"</b> was submitted with status <b>pending</b>.<br/>It will become visible to Supporters once approved by the Admin.`,
        confirmButtonColor: '#10b981',
      });

      navigate('/dashboard/my-campaigns');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Launch a New Campaign
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Share your project details with the community. New campaigns are reviewed by Admin before public listing.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campaign Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              placeholder="e.g. Help us build a solar-powered water pump"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Campaign Deadline *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Funding Goal & Minimum Contribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Funding Goal (Total Credits Needed) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  required
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                20 credits = $1 payout value for creators.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Minimum Contribution (Credits) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  value={minimumContribution}
                  onChange={(e) => setMinimumContribution(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Smallest amount a supporter can pledge.
              </p>
            </div>
          </div>

          {/* Cover Image URL + imgBB Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cover Image URL / imgBB Upload *
              </label>
              <label className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to imgBB (Challenge)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="relative">
              <input
                type="url"
                required
                value={campaignImageUrl}
                onChange={(e) => setCampaignImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or upload via imgBB"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            {uploadingImage && (
              <p className="text-xs text-blue-600 animate-pulse mt-1">Uploading image...</p>
            )}
            {campaignImageUrl && (
              <div className="mt-3 w-40 h-24 rounded-xl overflow-hidden border border-slate-200">
                <img src={campaignImageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Campaign Story */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Campaign Story (Detailed Description) *
            </label>
            <textarea
              required
              rows={5}
              value={campaignStory}
              onChange={(e) => setCampaignStory(e.target.value)}
              placeholder="Explain the background, mission, technical roadmap, and why backers should support this initiative..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reward Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reward Info (What Supporters Receive)
            </label>
            <input
              type="text"
              value={rewardInfo}
              onChange={(e) => setRewardInfo(e.target.value)}
              placeholder="e.g. Backer badge, early access prototype, or personalized updates"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting Campaign...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Submit Campaign for Admin Approval</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default AddNewCampaign;
