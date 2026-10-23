import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2">
        The campaign or page you are looking for may have been moved, deleted, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
        >
          <span>Explore Campaigns</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
