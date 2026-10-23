import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  HeartHandshake, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Globe2,
  Award
} from 'lucide-react';

export const metadata = {
  title: "About Us | CrowdSpark Crowdfunding Platform",
  description: "Learn about CrowdSpark's mission, our sustainable credit economy, and how we empower innovators and supporters through community micro-pledges.",
};

export default function AboutPage() {
  const stats = [
    { value: "$2.5M+", label: "Community Capital Pledged", sublabel: "Across 40+ countries" },
    { value: "15,000+", label: "Passionate Backers", sublabel: "Active monthly supporters" },
    { value: "1,200+", label: "Campaigns Brought to Life", sublabel: "Verified innovations" },
    { value: "100%", label: "Automated Refund Guarantee", sublabel: "Zero backer financial risk" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Radical Transparency",
      description: "Every campaign submission undergoes stringent administrative audit before launch. Backers review real-time funding milestones with full financial transparency.",
      badge: "Integrity First"
    },
    {
      icon: Coins,
      title: "Dual-Margin Credit Economy",
      description: "Supporters buy platform credits at 10 Credits = $1.00 USD, while creators withdraw at 20 Credits = $1.00 USD, eliminating heavy debt and arbitrary upfront listing fees.",
      badge: "Fair Economics"
    },
    {
      icon: HeartHandshake,
      title: "Instant Backer Protection",
      description: "If a campaign is cancelled or rejected, our automated database triggers immediately refund 100% of pledged credits straight back to the backer's wallet balance.",
      badge: "Zero-Risk Pledge"
    },
    {
      icon: Globe2,
      title: "Sustainable Impact",
      description: "We champion breakthroughs in Clean Energy, Low-cost Healthcare Tech, STEM Education, and Creative Arts that drive long-term societal progress.",
      badge: "Global Causes"
    }
  ];

  const leadershipTeam = [
    {
      name: "Diponkor Roy",
      role: "Founder & Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Full-stack engineer passionate about decentralized community finance, Next.js architecture, and high-trust platforms."
    },
    {
      name: "Dr. Evelyn Vance",
      role: "Head of Creator Relations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Former university incubator director guiding thousands of social innovators to realize their campaign goals."
    },
    {
      name: "Marcus Aurelius Chen",
      role: "Platform Trust & Security",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Security specialist ensuring Better Auth encryption, zero fraud tolerance, and automated reconciliation."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover The Story Behind CrowdSpark</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Catalyzing Visionary Causes Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Community Backing</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CrowdSpark was created to bridge the chasm between courageous ideas and the capital needed to realize them. By replacing traditional debt and complex venture hurdles with community micro-pledges, we turn collective empathy into real-world change.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>Explore Active Campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition-all"
            >
              <span>Contact Platform Team</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-slate-100">
              <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-1">
                {s.label}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {s.sublabel}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Our Founding Philosophy</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Why We Built a Better Way to Fund Innovation
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Traditional crowdfunding platforms charge heavy upfront fees, lock funds behind arbitrary delays, or leave supporters stranded when a project defaults. CrowdSpark was engineered from the ground up to solve these structural pitfalls.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              With our <strong>platform credit model</strong>, supporters purchase credits in small bundles and pledge directly to campaigns they believe in. If a campaign is rejected or deleted, credits immediately bounce back to the backer. When a campaign succeeds, creators withdraw funds directly to their verified payment accounts.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Zero debt obligations for grassroots creators</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>100% automated credit refunds on rejected pledges</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Multi-gateway disbursements (Stripe, bKash, Rocket, Nagad)</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                alt="CrowdSpark Collaborative Team"
                className="w-full h-96 sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Collaborative Ecosystem</span>
                <h3 className="text-xl font-bold mt-1">From Idea to Reality Together</h3>
                <p className="text-xs text-slate-300 mt-2">Connecting creative dreamers with patrons who believe in collective progress.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-slate-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Our Core Pillars</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              The Principles That Guide Every Decision
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              We hold ourselves to the highest standards of governance, digital trust, and community alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl p-6 sm:p-7 bg-slate-800/80 border border-slate-700 hover:border-emerald-500/60 transition-all hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700">
                        {v.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {v.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The People Behind The Spark</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Meet Our Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3">
            Experienced engineers, educators, and community builders working together to elevate global initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadershipTeam.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 text-center hover:border-emerald-500/40 transition-all group"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden ring-4 ring-emerald-500/20 mb-5 group-hover:scale-105 transition-transform">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">
                {member.role}
              </p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 sm:p-14 text-white text-center shadow-2xl shadow-emerald-700/20 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Spark Something Meaningful?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Whether you are an innovator with an ambitious blueprint or a patron ready to support positive causes, CrowdSpark gives you the verified platform to make it happen.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/campaigns"
                className="px-6 py-3 rounded-xl bg-white text-emerald-900 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
              >
                Back a Campaign Today
              </Link>
              <Link
                href="/dashboard/add-campaign"
                className="px-6 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-white text-xs sm:text-sm font-bold border border-emerald-400/30 transition-all"
              >
                Launch Your Cause
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
