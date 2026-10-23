import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function CampaignPagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 6,
  category = 'All',
  search = '',
  sort = 'raised-desc'
}) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  // Helper to generate URL preserving query params
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (search && search.trim()) params.set('search', search.trim());
    if (sort && sort !== 'raised-desc') params.set('sort', sort);
    if (pageNumber > 1) params.set('page', pageNumber.toString());
    const query = params.toString();
    return `/campaigns${query ? `?${query}` : ''}`;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Informative counts */}
      <div className="text-sm text-slate-500 font-medium text-center sm:text-left">
        Showing <span className="font-bold text-slate-800">{startItem}</span> to{' '}
        <span className="font-bold text-slate-800">{endItem}</span> of{' '}
        <span className="font-bold text-emerald-700">{totalItems}</span> campaigns{' '}
        <span className="hidden md:inline text-slate-400">
          (Page {currentPage} of {totalPages})
        </span>
      </div>

      {/* Pagination Controls */}
      <nav aria-label="Campaign Pagination" className="inline-flex items-center gap-1.5 flex-wrap justify-center">
        {/* First Page button */}
        {hasPrev ? (
          <Link
            href={createPageUrl(1)}
            title="First Page"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            title="First Page"
            className="p-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 transition-colors inline-flex items-center justify-center cursor-not-allowed opacity-60"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous button */}
        {hasPrev ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-600 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs font-semibold transition-colors cursor-not-allowed opacity-60"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
        )}

        {/* Page Number Pills */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 font-bold select-none text-xs"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return isCurrent ? (
              <span
                key={p}
                aria-current="page"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600 ring-offset-2 select-none"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={createPageUrl(p)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next button */}
        {hasNext ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-emerald-600 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs font-semibold transition-colors cursor-not-allowed opacity-60"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Last Page button */}
        {hasNext ? (
          <Link
            href={createPageUrl(totalPages)}
            title="Last Page"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            title="Last Page"
            className="p-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 transition-colors inline-flex items-center justify-center cursor-not-allowed opacity-60"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </nav>
    </div>
  );
}
