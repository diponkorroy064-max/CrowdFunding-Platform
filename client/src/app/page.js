"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  Users,
  Zap,
  Globe2,
  Quote,
  Star
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

export default function Home() {
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await apiClient.get('/campaigns/top-funded');
        if (res.data && res.data.length > 0) {
          setTopCampaigns(res.data);
        } else {
          setTopCampaigns([
            {
              _id: 'mock1',
              campaign_title: 'EcoFlow: Community Solar Clean Water Pumps',
              category: 'Community',
              campaign_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
              amount_raised: 4500,
              funding_goal: 5000,
              creator_name: 'SolarAid Collective'
            },
            {
              _id: 'mock2',
              campaign_title: 'Aura Next-Gen Open Source Robotics Kit',
              category: 'Technology',
              campaign_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
              amount_raised: 3800,
              funding_goal: 4000,
              creator_name: 'Dr. Evelyn Vance'
            },
            {
              _id: 'mock3',
              campaign_title: 'Chronicles of Earth: Environmental Graphic Novel',
              category: 'Creative',
              campaign_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
              amount_raised: 2900,
              funding_goal: 3000,
              creator_name: 'Studio Lumina'
            },
            {
              _id: 'mock4',
              campaign_title: 'Smart AgTech: Low-Cost Drip Irrigation for Small Farmers',
              category: 'Technology',
              campaign_image_url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
              amount_raised: 2400,
              funding_goal: 3500,
              creator_name: 'Tariq Rahman'
            },
            {
              _id: 'mock5',
              campaign_title: 'HeartBeat: Portable Pediatric Cardiac Monitor',
              category: 'Healthcare',
              campaign_image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
              amount_raised: 2100,
              funding_goal: 2500,
              creator_name: 'BioMed Innovators'
            },
            {
              _id: 'mock6',
              campaign_title: 'Heritage Revive: Traditional Artisan Weaving Guild',
              category: 'Creative',
              campaign_image_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
              amount_raised: 1950,
              funding_goal: 2000,
              creator_name: 'Craft Heritage Alliance'
            }
          ]);
        }
      } catch (err) {
        console.warn('Error fetching top campaigns:', err.message);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchTopCampaigns();
  }, []);

  const heroSlides = [
    {
      heading: 'Ignite Groundbreaking Ideas',
      subtitle: 'Where Visionary Creators Meet Dedicated Community Supporters',
      description: 'Back sustainable technologies, creative storytelling, and social impact projects with platform credits and real-time transparency powered by Next.js and Better Auth.',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
      badge: 'Community-Driven Micro Funding',
      actionText: 'Explore Active Campaigns',
      link: '/campaigns'
    },
    {
      heading: 'Empowering Creators Globally',
      subtitle: 'Launch Your Project with Zero Upfront Barriers',
      description: 'Submit your campaign, get verified by our trusted review committee, and withdraw funds directly to Stripe, Bkash, or Nagad.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
      badge: 'Transparent 20 Credits = $1 Payout',
      actionText: 'Launch Your Campaign',
      link: '/register'
    },
    {
      heading: 'Direct Impact & Instant Refunds',
      subtitle: 'Every Credit Accounted For with Complete Accountability',
      description: 'Supporters get instant automated credit refunds if a creator rejects a contribution or removes a campaign.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
      badge: 'Protected & Secure Ecosystem',
      actionText: 'Get Started with 50 Free Credits',
      link: '/register'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Clean Water Project Lead',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      quote: 'CrowdSpark allowed us to raise 4,500 credits to install solar water pumps across three drought-prone villages. The review process was swift, and withdrawals went directly through Stripe!'
    },
    {
      name: 'Alexandre Dubois',
      role: 'Indie Game Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      quote: 'The credit economy makes micro-pledges effortless for supporters. I reached 120% of my initial goal in two weeks thanks to the enthusiastic community!'
    },
    {
      name: 'Priya Sharma',
      role: 'Community Supporter',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      quote: 'I love receiving instant notifications whenever a creator approves my contribution. The refund guarantee also gives me complete peace of mind when backing bold new ideas.'
    }
  ];

  const categories = [
    { name: 'Technology', count: '142 Projects', icon: Zap, bg: 'bg-blue-50' },
    { name: 'Community', count: '98 Projects', icon: Users, bg: 'bg-emerald-50' },
    { name: 'Creative', count: '115 Projects', icon: Sparkles, bg: 'bg-purple-50' },
    { name: 'Healthcare', count: '64 Projects', icon: ShieldCheck, bg: 'bg-rose-50' },
    { name: 'Education', count: '87 Projects', icon: Globe2, bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION (Swiper Slider with 3 Banners) */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect={'fade'}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          className="h-[520px] sm:h-[600px] lg:h-[650px] w-full"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full flex items-center">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/40" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 w-full">
                  <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left duration-700">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                      {slide.heading}
                    </h1>

                    <p className="text-base sm:text-xl font-medium text-emerald-200/90">
                      {slide.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                      >
                        <span>{slide.actionText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
                      >
                        <span>Join CrowdSpark</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. TOP FUNDED CAMPAIGNS (Top 6 Raised Credits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Highest Backed Projects</span>
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
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {topCampaigns.map((camp) => {
            const raised = camp.amount_raised || 0;
            const goal = camp.funding_goal || 1;
            const progress = Math.min(100, Math.round((raised / goal) * 100));

            return (
              <div
                key={camp._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
              >
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
                    <span>{raised} Credits Raised</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {camp.campaign_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">
                      by <span className="font-semibold text-slate-700">{camp.creator_name || 'Innovator'}</span>
                    </p>
                  </div>

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

                    <div className="pt-3">
                      <Link
                        href={`/campaigns/${camp._id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <span>View Details & Back</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Simple & Transparent Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2">
              How CrowdSpark Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Our micro-credit economy guarantees accountability for backers and sustainable growth for creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 relative hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl mb-6">
                1
              </div>
              <h3 className="text-lg font-bold mb-3">1. Join & Get Bonus Credits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supporters receive 50 complimentary credits upon registration, while creators receive 20 credits. Purchase more credits securely with Stripe at 10 credits = $1 USD.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 relative hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xl mb-6">
                2
              </div>
              <h3 className="text-lg font-bold mb-3">2. Pledge & Direct Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supporters pledge credits to active campaigns. Creators review pledges: approved credits fuel the project goal; rejected credits are immediately refunded!
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 relative hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xl mb-6">
                3
              </div>
              <h3 className="text-lg font-bold mb-3">3. Creator Withdrawals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once a creator reaches at least 200 credits, they request payouts converted at 20 credits = $1 USD through Stripe, Bkash, or Nagad, verified by our Admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Diverse Innovations
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find causes and technical frontiers aligned with your passion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={`/campaigns?category=${cat.name}`}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-slate-800 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 mt-1">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. PLATFORM IMPACT IN NUMBERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">125K+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">Credits Contributed</p>
              <p className="text-[11px] text-white/60">Across all vetted initiatives</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">98.4%</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">Pledge Satisfaction</p>
              <p className="text-[11px] text-white/60">Automated credit refunds</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">450+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">Successful Campaigns</p>
              <p className="text-[11px] text-white/60">Funded & built to reality</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl sm:text-5xl font-black text-emerald-300 tracking-tight">$60K+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">Creator Payouts</p>
              <p className="text-[11px] text-white/60">Processed via Stripe & MFS</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved by Backers & Innovators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real experiences from creators and supporters bringing dreams into tangible reality.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between h-full hover:shadow-xl transition-all">
                <div>
                  <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] font-semibold text-emerald-600">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

    </div>
  );
}
