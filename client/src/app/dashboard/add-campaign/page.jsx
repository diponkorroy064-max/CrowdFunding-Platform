"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Upload, 
  Coins, 
  Calendar, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Gift,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  'Clean Tech & Energy',
  'Healthcare & Medical',
  'Education & Learning',
  'Humanitarian & Relief',
  'Creative Arts',
  'Community & Civic'
];

export default function AddCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [fundingGoal, setFundingGoal] = useState('');
  const [minContribution, setMinContribution] = useState('10');
  const [deadline, setDeadline] = useState('');
  const [rewardInfo, setRewardInfo] = useState('');
  const [story, setStory] = useState('');
  
  // Image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid File', 'Please choose an image file (JPG, PNG, WEBP, GIF, SVG, AVIF, etc.)', 'warning');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToMulter = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    const res = await axios.post(`${apiBase}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data?.success && res.data?.url) {
      return res.data.url;
    }
    throw new Error(res.data?.message || 'Image upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !fundingGoal || !deadline || !story) {
      Swal.fire('Incomplete Form', 'Please fill out all required campaign fields.', 'warning');
      return;
    }

    setSubmitting(true);
    let campaignImageUrl = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80';

    try {
      if (imageFile) {
        setUploadingImage(true);
        campaignImageUrl = await uploadImageToMulter(imageFile);
        setUploadingImage(false);
      }

      await apiClient.post('/campaigns', {
        campaign_title: title,
        campaign_story: story,
        category,
        funding_goal: Number(fundingGoal),
        minimum_Contribution: Number(minContribution || 1),
        deadline,
        reward_info: rewardInfo,
        campaign_image_url: campaignImageUrl,
        creator_name: user?.displayName || user?.name || 'Verified Creator',
        creator_email: user?.email,
      });

      Swal.fire({
        title: 'Campaign Created!',
        text: 'Your campaign has been submitted for Admin approval. Once approved, it will be visible on the Explore page.',
        icon: 'success',
        confirmButtonColor: '#059669',
      }).then(() => {
        router.push('/dashboard/my-campaigns');
      });
    } catch (err) {
      console.error('Campaign creation error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to create campaign.', 'error');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-600" />
          Launch New Campaign
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide compelling details and images to attract community supporters and secure funding credits.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campaign Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solar Mini-Grids for Remote Himalayan Villages"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-slate-50/50"
              required
            />
          </div>

          {/* Category & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-slate-50/50 text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Funding Deadline Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  min={todayStr}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-slate-50/50"
                  required
                />
              </div>
            </div>

          </div>

          {/* Funding Goal & Minimum Contribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Goal in Credits */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Funding Goal (Credits) *
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="50"
                  value={fundingGoal}
                  onChange={(e) => setFundingGoal(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-slate-50/50"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                20 credits = $1 USD when withdrawn as a creator.
              </p>
            </div>

            {/* Minimum Pledge */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Contribution (Credits) *
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  value={minContribution}
                  onChange={(e) => setMinContribution(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-slate-50/50"
                  required
                />
              </div>
            </div>

          </div>

          {/* Reward Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-600" />
              Supporter Perks & Reward Details
            </label>
            <input
              type="text"
              value={rewardInfo}
              onChange={(e) => setRewardInfo(e.target.value)}
              placeholder="e.g. Backers receive private Discord access, digital certificate, and monthly project updates."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50"
            />
          </div>

          {/* Campaign Story */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Campaign Story & Vision *
            </label>
            <textarea
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Explain the background, why this project matters, what the funds will be used for, and the impact it will generate..."
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50 text-slate-800"
              required
            />
          </div>

          {/* Image Upload with Multer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Hero Image (Multer File Upload: JPG, PNG, WEBP, GIF, SVG, AVIF)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48 h-32 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px]">No image selected</span>
                  </div>
                )}
              </div>

              <label className="w-full flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-center">
                  <Upload className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-slate-700">
                    {imageFile ? imageFile.name : 'Click to Browse & Upload Campaign Image'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Accepts any image format (JPG, PNG, WEBP, SVG, etc.) up to 10MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {uploadingImage
                ? 'Uploading Image via Multer...'
                : submitting
                ? 'Submitting Campaign...'
                : 'Publish Campaign for Review'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>

    </div>
  );
}
