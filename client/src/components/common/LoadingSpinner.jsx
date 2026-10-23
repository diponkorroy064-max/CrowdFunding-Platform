import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'default' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  }[size] || 'w-10 h-10 border-3';

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses} border-emerald-500 border-t-transparent rounded-full animate-spin`}
      />
      <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase animate-pulse">
        Loading CrowdSpark...
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
          {spinner}
        </div>
      </div>
    );
  }

  return <div className="py-12 flex justify-center items-center">{spinner}</div>;
};

export default LoadingSpinner;
