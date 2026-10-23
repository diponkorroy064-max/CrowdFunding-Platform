import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import TopFundedSection from '@/components/home/TopFundedSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import ImpactStatsSection from '@/components/home/ImpactStatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSlider from '@/components/home/TestimonialsSlider';
import CtaBannerSection from '@/components/home/CtaBannerSection';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CrowdSpark | Empowering Ideas Through Community Funding',
  description: 'CrowdSpark connects creators with passionate supporters to bring ideas, creative projects, and positive causes to life with server-side rendered speed and Better Auth security.',
};

async function getTopFundedCampaigns() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    const res = await fetch(`${apiBase}/campaigns/top-funded`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.warn('Failed to fetch top funded campaigns on server:', res.statusText);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn('Server fetch error in getTopFundedCampaigns:', err.message);
    return [];
  }
}

export default async function HomePage() {
  const topCampaigns = await getTopFundedCampaigns();

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Hero Swiper Section */}
      <HeroSlider />

      {/* 2. Top Funded Campaigns (Server-Side Rendered from MongoDB) */}
      <TopFundedSection campaigns={topCampaigns} />

      {/* 3. Explore by Category Section (Server-Side Rendered) */}
      <CategoriesSection />

      {/* 4. Platform Credibility & Impact Stats Section (Server-Side Rendered) */}
      <ImpactStatsSection />

      {/* 5. How It Works - 3 Step Guide (Server-Side Rendered) */}
      <HowItWorksSection />

      {/* 6. Backer Testimonials Carousel */}
      <TestimonialsSlider />

      {/* 7. Creator Call to Action Banner (Server-Side Rendered) */}
      <CtaBannerSection />
    </div>
  );
}
