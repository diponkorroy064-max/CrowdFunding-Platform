"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  HeartHandshake, 
  CreditCard, 
  History, 
  PlusCircle, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  FileCheck, 
  AlertTriangle,
  Menu,
  X,
  Coins,
  LogOut,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { user, loading, logOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <LoadingSpinner text="Loading dashboard workspace..." />;
  }

  const supporterNav = [
    { name: 'Supporter Overview', href: '/dashboard/supporter-home', icon: Home },
    { name: 'My Contributions', href: '/dashboard/my-contributions', icon: HeartHandshake },
    { name: 'Purchase Credits', href: '/dashboard/purchase-credit', icon: CreditCard },
    { name: 'Payment History', href: '/dashboard/payment-history', icon: History },
  ];

  const creatorNav = [
    { name: 'Creator Overview', href: '/dashboard/creator-home', icon: Home },
    { name: 'Add Campaign', href: '/dashboard/add-campaign', icon: PlusCircle },
    { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: Layers },
    { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: DollarSign },
    { name: 'Creator Payments', href: '/dashboard/creator-payments', icon: History },
  ];

  const adminNav = [
    { name: 'Admin Overview', href: '/dashboard/admin-home', icon: ShieldCheck },
    { name: 'Campaign Approvals', href: '/dashboard/campaign-approvals', icon: FileCheck },
    { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
    { name: 'Manage Campaigns', href: '/dashboard/manage-campaigns', icon: Layers },
    { name: 'Withdrawal Requests', href: '/dashboard/withdrawal-requests', icon: DollarSign },
    { name: 'Fraud Reports', href: '/dashboard/reports', icon: AlertTriangle },
  ];

  const currentNav = user.role === 'admin' 
    ? adminNav 
    : user.role === 'creator' 
    ? creatorNav 
    : supporterNav;

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-slate-100/70 flex">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Desktop & Mobile - Fixed Top to Bottom */}
      <aside
        className={`fixed top-0 lg:top-16 sm:lg:top-20 bottom-0 left-0 z-50 lg:z-30 w-72 bg-white border-r border-slate-200/90 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Dashboard Header / Profile */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt="Avatar"
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="truncate">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {user.displayName || user.name || 'Member'}
                </h4>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {user.role} Dashboard
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Credit Balance Card */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-700/20">
            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-300" />
                Available Credits
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="text-2xl font-black mt-1">
              {user.credits ?? 0} <span className="text-xs font-semibold text-emerald-200">Credits</span>
            </div>
            
            {user.role === 'supporter' && (
              <Link
                href="/dashboard/purchase-credit"
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-bold transition-colors"
              >
                <span>Buy Credits ($1 = 10 Cr)</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}

            {user.role === 'creator' && (
              <Link
                href="/dashboard/withdrawals"
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-bold transition-colors"
              >
                <span>Request Payout</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/campaigns"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Explore Public Campaigns</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Mobile Header Toggle */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">{user.displayName}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              {user.credits ?? 0} Cr
            </span>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
