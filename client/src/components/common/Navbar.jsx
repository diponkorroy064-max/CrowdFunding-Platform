"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Coins, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  Compass
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { useAuth } from '@/context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const clientRepoUrl = process.env.NEXT_PUBLIC_CLIENT_REPO_URL || 'https://github.com/diponkorroy064-max/CrowdFunding-Platform';

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin-home';
    if (user.role === 'creator') return '/dashboard/creator-home';
    return '/dashboard/supporter-home';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white p-1 border border-slate-200/80 shadow-md shadow-emerald-500/10 flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-500/50 transition-all">
              <img
                src="/logo.png"
                alt="CrowdSpark Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors block leading-tight">
                Crowd<span className="text-emerald-600">Spark</span>
              </span>
              <span className="hidden sm:block text-[9.5px] uppercase font-extrabold tracking-widest text-emerald-700/80">
                Community Crowdfunding
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/campaigns"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/campaigns' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Campaigns
            </Link>

            {/* Join as Developer (Redirects to client GitHub repo) */}
            <a
              href={clientRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 shadow-sm"
              title="Visit Client GitHub Repository"
            >
              <GithubIcon className="w-3.5 h-3.5 shrink-0" width={14} height={14} />
              Join as Developer
            </a>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Available Credits Badge */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold shadow-sm"
                  title="Available Platform Credits"
                >
                  <Coins className="w-4 h-4 text-emerald-500" />
                  <span>{user.credits ?? 0} Credits</span>
                </div>

                {/* Notifications Pop-up */}
                <NotificationDropdown />

                {/* Dashboard Button */}
                <Link
                  href={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  Dashboard
                </Link>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user.displayName || 'User Avatar'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                        {user.displayName || 'Member'}
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-600 capitalize">
                        {user.role || 'Supporter'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                <span>{user.credits ?? 0}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/campaigns"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            <Compass className="w-4 h-4" /> Explore Campaigns
          </Link>

          <a
            href={clientRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600"
          >
            <GithubIcon className="w-4 h-4 shrink-0" width={16} height={16} /> Join as Developer (GitHub)
          </a>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{user.displayName}</p>
                    <p className="text-[10px] text-emerald-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {user.credits ?? 0} Credits
                </div>
              </div>

              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" /> Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
