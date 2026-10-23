"use client";

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Sparkles, ArrowRight } from 'lucide-react';

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

export default function HeroSlider() {
  return (
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
  );
}
