"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  FolderHeart
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyContributionsPage() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchContributions = async (currentPage) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/supporter/contributions/${user.email}`, {
        params: { page: currentPage, limit: 5 }
      });
      setContributions(res.data.contributions || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(page);
  }, [user, page]);

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-600" />
            My Contributions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete history of campaigns you've pledged platform credits to ({total} total pledges).
          </p>
        </div>

        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
        >
          Explore More Causes
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching contributions..." />
          </div>
        ) : contributions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No contributions made yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Browse approved community campaigns and pledge your available credits.
            </p>
            <Link
              href="/campaigns"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6 font-bold">Campaign</th>
                  <th className="py-4 px-6 font-bold">Creator</th>
                  <th className="py-4 px-6 font-bold">Pledge Amount</th>
                  <th className="py-4 px-6 font-bold">Pledge Date</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {contributions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block max-w-xs truncate">
                        {item.campaign_title}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {item.creator_name || 'Creator'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        {item.Contribution_amount} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {item.current_date || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/campaigns/${item.campaign_id}`}
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({total} items)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors ${
                      page === num
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
