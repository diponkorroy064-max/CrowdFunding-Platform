import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon, TwitterIcon } from './SocialIcons';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-700 shadow-md flex items-center justify-center group-hover:scale-105 transition-all">
                <img
                  src="/logo.png"
                  alt="CrowdSpark Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-tight">
                  Crowd<span className="text-emerald-400">Spark</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400/80">
                  Community Crowdfunding
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering visionary creators and passionate supporters through community micro-pledges, Next.js architecture, and Better Auth authentication.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="Facebook Profile"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="Twitter Profile"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/campaigns" className="hover:text-emerald-400 transition-colors">
                  All Campaigns
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=Technology" className="hover:text-emerald-400 transition-colors">
                  Technology & Innovation
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=Community" className="hover:text-emerald-400 transition-colors">
                  Community & Causes
                </Link>
              </li>
              <li>
                <Link href="/campaigns?category=Creative" className="hover:text-emerald-400 transition-colors">
                  Art & Creative Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Model */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform Rules
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Supporter Credit: 10 Credits = $1 USD
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Creator Payout: 20 Credits = $1 USD
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Instant Supporter Refund on Reject
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Admin Verified & Campaign Approvals
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Security & Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Protected by Better Auth session encryption and Stripe secure payment processing.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
              <ShieldCheck className="w-4 h-4" />
              Verified Community Platform
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CrowdSpark Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Next.js & Better Auth</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for MERN Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
