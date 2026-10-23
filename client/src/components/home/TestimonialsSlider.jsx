"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote, Star } from 'lucide-react';

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

export default function TestimonialsSlider() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          User Voices
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
          Loved by Backers & Innovators
        </h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="pb-12"
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md text-center max-w-3xl mx-auto relative">
              <Quote className="w-10 h-10 text-emerald-200 mx-auto mb-4" />
              <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed">
                "{t.quote}"
              </p>

              <div className="flex justify-center gap-1 my-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
