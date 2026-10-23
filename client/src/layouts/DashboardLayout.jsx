import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Coins,
  LayoutDashboard,
  Compass,
  HeartHandshake,
  CreditCard,
  History,
  PlusCircle,
  FolderKanban,
  Wallet,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  AlertOctagon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/common/NotificationDropdown';
import Footer from '../components/common/Footer';

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const userRole = user?.role?.toLowerCase() || 'supporter';

  // Navigation config based on role according to Page 5 Table
  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Home', path: '/dashboard/admin-home', icon: Home },
        { name: 'Manage Users', path: '/dashboard/manage-users', icon: Users },
        { name: 'Manage Campaigns', path: '/dashboard/manage-campaigns', icon: FolderKanban },
        { name: 'Withdrawal Requests', path: '/dashboard/withdrawal-requests', icon: Wallet },
        { name: 'Reports', path: '/dashboard/reports', icon: AlertOctagon },
      ];
    } else if (userRole === 'creator') {
      return [
        { name: 'Home', path: '/dashboard/creator-home', icon: Home },
        { name: 'Add New Campaign', path: '/dashboard/add-campaign', icon: PlusCircle },
        { name: 'My Campaigns', path: '/dashboard/my-campaigns', icon: FolderKanban },
        { name: 'Withdrawals', path: '/dashboard/withdrawals', icon: Wallet },
        { name: 'Payment History', path: '/dashboard/creator-payments', icon: History },
      ];
    } else {
      // Supporter
      return [
        { name: 'Home', path: '/dashboard/supporter-home', icon: Home },
        { name: 'Explore Campaigns', path: '/dashboard/explore-campaigns', icon: Compass },
        { name: 'My Contributions', path: '/dashboard/my-contributions', icon: HeartHandshake },
        { name: 'Purchase Credit', path: '/dashboard/purchase-credit', icon: CreditCard },
        { name: 'Payment History', path: '/dashboard/payment-history', icon: History },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. Dashboard Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                    Crowd<span className="text-emerald-500">Spark</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    {userRole} Workspace
                  </span>
                </div>
              </Link>
            </div>

            {/* Right side: Available Credits | User Image | User Role | User Name | Notification */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Available Credits */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold shadow-sm"
                title="Your Available Credits"
              >
                <Coins className="w-4 h-4 text-emerald-500" />
                <span>{user?.credits ?? 0} Credits</span>
              </div>

              {/* Notification Pop-up */}
              <NotificationDropdown />

              {/* User Image | User Role | User Name */}
              <div className="flex items-center gap-2.5 pl-2 sm:pl-4 border-l border-slate-200">
                <img
                  src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.displayName || 'User Profile'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user?.displayName || 'Member'}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {userRole}
                  </p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Body with Sidebar + Sections Based on Routes */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 shadow-2xl transform transition-transform duration-200 lg:static lg:inset-auto lg:w-auto lg:col-span-3 lg:p-0 lg:shadow-none lg:transform-none lg:bg-transparent ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 lg:hidden">
              <span className="font-bold text-sm text-slate-700">Navigation Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-card space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {userRole} Menu
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </NavLink>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Back to Main Website</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area (Sections Based on Routes) */}
          <section className="lg:col-span-9 min-w-0">
            <Outlet />
          </section>

        </div>
      </div>

      {/* 3. Dashboard Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
